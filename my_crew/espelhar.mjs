#!/usr/bin/env node
// Sincroniza os espelhos do pacote a partir desta cópia, e CONFERE o resultado.
//
//   node espelhar.mjs              sincroniza e verifica
//   node espelhar.mjs --verificar  só verifica, não escreve
//
// Por que isto existe como ferramenta e não como `cp -r` na mão: sincronizar à mão é
// exatamente como a divergência nasce. Duas cópias que ninguém compara viram duas gerações
// diferentes do método, e a que está errada é sempre a que alguém está usando.
//
// Os destinos vêm de `espelhos.json`, que é DADO DE MÁQUINA — cada máquina tem os seus, e o
// arquivo não descreve o método, descreve onde esta máquina guarda cópias.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACOTE = path.dirname(fileURLToPath(import.meta.url));
const SO_VERIFICAR = process.argv.includes('--verificar');

const cfgPath = path.join(PACOTE, 'espelhos.json');
if (!existsSync(cfgPath)) {
  process.stderr.write(
    'sem espelhos.json — nada a sincronizar.\n' +
      'Crie um com {"espelhos": ["<caminho absoluto>"]} se esta máquina guardar cópias.\n',
  );
  process.exit(0);
}

const { espelhos = [] } = JSON.parse(readFileSync(cfgPath, 'utf8'));

/** Lista relativa de todos os arquivos, ignorando o que não é conteúdo do pacote. */
function arquivos(raiz, base = raiz, acc = []) {
  for (const e of readdirSync(raiz, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const abs = path.join(raiz, e.name);
    if (e.isDirectory()) arquivos(abs, base, acc);
    else acc.push(path.relative(base, abs).replace(/\\/g, '/'));
  }
  return acc;
}

function comparar(origem, destino) {
  const a = new Set(arquivos(origem));
  const b = existsSync(destino) ? new Set(arquivos(destino)) : new Set();
  const faltando = [...a].filter((f) => !b.has(f));
  const sobrando = [...b].filter((f) => !a.has(f));
  const diferentes = [...a].filter((f) => {
    if (!b.has(f)) return false;
    const pa = path.join(origem, f);
    const pb = path.join(destino, f);
    if (statSync(pa).size !== statSync(pb).size) return true;
    return !readFileSync(pa).equals(readFileSync(pb));
  });
  return { faltando, sobrando, diferentes };
}

let divergiu = false;

for (const destino of espelhos) {
  const rotulo = destino;
  if (!SO_VERIFICAR) {
    mkdirSync(path.dirname(destino), { recursive: true });
    // `force: true` sobrescreve; o que sobra no destino é removido na conferência abaixo,
    // que é onde a divergência aparece em vez de ficar escondida.
    cpSync(PACOTE, destino, {
      recursive: true,
      force: true,
      filter: (src) => !/[\\/](\.git|node_modules)$/.test(src),
    });
  }

  const { faltando, sobrando, diferentes } = comparar(PACOTE, destino);
  const total = faltando.length + sobrando.length + diferentes.length;
  if (total === 0) {
    process.stdout.write(`✔ ${rotulo}\n`);
    continue;
  }
  divergiu = true;
  process.stdout.write(`✖ ${rotulo}\n`);
  for (const f of faltando) process.stdout.write(`    faltando:   ${f}\n`);
  for (const f of diferentes) process.stdout.write(`    diferente:  ${f}\n`);
  for (const f of sobrando) process.stdout.write(`    sobrando:   ${f}  (remova à mão)\n`);
}

if (divergiu) {
  process.stderr.write(
    '\nEspelho divergente. "sobrando" nunca é removido automaticamente: apagar arquivo de um\n' +
      'diretório que não é o canônico é a operação que não dá para desfazer.\n',
  );
  process.exit(1);
}
process.stdout.write(`\n${espelhos.length} espelho(s) em dia.\n`);
