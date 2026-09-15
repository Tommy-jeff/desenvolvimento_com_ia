#!/usr/bin/env node
// Instalador do pacote de desenvolvimento.
//
//   node instalar.mjs --alvo claude-code --projeto /caminho/do/projeto
//   node instalar.mjs --alvo todos --projeto . --rigor consultivo
//   node instalar.mjs --alvo claude-code --simular      (não escreve nada)
//
// Regra que governa este arquivo: ele GERA a partir de `metodo/`, nunca copia conteúdo
// duplicado. Rubrica se edita em metodo/papeis/; o que está em ~/.claude ou .cursor é
// derivado e descartável.
//
// E a segunda regra, que vale mais num projeto que não é seu: ele NUNCA sobrescreve em
// silêncio o que não foi ele que escreveu. Arquivo alheio vira `<nome>.novo` ao lado, com
// aviso — a decisão de mesclar é de quem conhece o projeto.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACOTE = path.dirname(fileURLToPath(import.meta.url));
// O prefixo é ESTÁVEL entre versões: é por ele que se reconhece um arquivo nosso. A versão
// entra depois, para que a instalação saiba que está trocando a geração do método por outra.
const MARCA_PREFIXO = 'gerado pelo pacote de desenvolvimento';
const VERSAO = '1.1.0';
const MARCA = `${MARCA_PREFIXO} v${VERSAO} — edite em metodo/, não aqui`;
const RX_VERSAO = new RegExp(`${MARCA_PREFIXO} v([0-9][^ ]*)`);
const PAPEIS = ['coder-reviewer', 'delivery-inspector', 'software-engineer', 'harness-scout'];

const args = process.argv.slice(2);
const opt = (nome, padrao = null) => {
  const i = args.indexOf(`--${nome}`);
  return i === -1 ? padrao : args[i + 1];
};
const flag = (nome) => args.includes(`--${nome}`);

const SIMULAR = flag('simular');
// `--forcar` existe para a PRIMEIRA instalação sobre arquivos feitos à mão, e para assumir a
// versão do pacote depois de conferir o `.novo`. Nunca é o default: num projeto que não é
// seu, sobrescrever em silêncio a instrução de outra pessoa é o pior desfecho possível.
const FORCAR = flag('forcar');
const alvoBruto = opt('alvo');
const projeto = opt('projeto') ? path.resolve(opt('projeto')) : null;
const rigor = opt('rigor', 'observador');

const relatorio = { escritos: [], preservados: [], avisos: [] };

// ─────────────────────────────────────────────────────────────────────────────

function ler(rel) {
  return readFileSync(path.join(PACOTE, rel), 'utf8');
}

/** Escreve só se o destino não existir, ou se o que está lá foi gerado por nós. */
function escrever(destino, conteudo, { marcado = true } = {}) {
  const rotulo = path.relative(process.cwd(), destino);
  if (existsSync(destino)) {
    const atual = readFileSync(destino, 'utf8');
    if (atual === conteudo) {
      relatorio.preservados.push(`${rotulo} (idêntico)`);
      return;
    }
    // Troca de geração: o arquivo é nosso, mas de outra versão do método. Vale avisar, não
    // bloquear — o que é perigoso aqui não é a troca, é ela passar despercebida (ver abaixo).
    const versaoAtual = atual.match(RX_VERSAO)?.[1];
    if (versaoAtual && versaoAtual !== VERSAO) {
      relatorio.avisos.push(
        `${rotulo}: substituindo a geração v${versaoAtual} pela v${VERSAO} do método.`,
      );
    }
    if (marcado && !atual.includes(MARCA_PREFIXO) && !FORCAR) {
      const lado = `${destino}.novo`;
      if (!SIMULAR) {
        mkdirSync(path.dirname(lado), { recursive: true });
        writeFileSync(lado, conteudo, 'utf8');
      }
      relatorio.avisos.push(
        `${rotulo} JÁ EXISTE e não foi gerado por este pacote — escrevi ${path.basename(lado)} ao lado. Mescle à mão.`,
      );
      return;
    }
  }
  if (!SIMULAR) {
    mkdirSync(path.dirname(destino), { recursive: true });
    writeFileSync(destino, conteudo, 'utf8');
  }
  relatorio.escritos.push(rotulo);
}

function cabecalhoYaml(campos) {
  const linhas = Object.entries(campos).map(([k, v]) => `${k}: ${v}`);
  return ['---', ...linhas, '---', '', `<!-- ${MARCA} -->`, ''].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Alvo: Claude Code
// ─────────────────────────────────────────────────────────────────────────────

function instalarClaudeCode() {
  const cfg = JSON.parse(ler('adaptadores/claude-code/agentes.json'));
  const home = path.join(os.homedir(), '.claude');

  // ⚠️ ~/.claude/agents é NÍVEL DE USUÁRIO: instalar "para um projeto" muda o comportamento
  // de TODOS os projetos desta máquina. Medido no veniti, cujos retornos já em disco foram
  // escritos por uma geração anterior dos mesmos papéis.
  relatorio.avisos.push(
    `os ${PAPEIS.length} papéis vão para ${path.join(home, 'agents')} — NÍVEL DE USUÁRIO. ` +
      'Isso altera o comportamento de TODOS os projetos desta máquina, não só do que você passou ' +
      'em --projeto. Retornos já gravados por uma geração anterior continuam válidos, mas não ' +
      'carregam os campos que a geração nova espera.',
  );

  for (const id of PAPEIS) {
    const meta = cfg.agentes[id];
    if (!meta) throw new Error(`agente sem frontmatter em agentes.json: ${id}`);
    const corpo = ler(`metodo/papeis/${id}.md`);
    escrever(path.join(home, 'agents', `${id}.md`), cabecalhoYaml(meta) + corpo);
  }

  const skill = cfg.skill;
  const skillDir = path.join(home, 'skills', skill.id);
  escrever(
    path.join(skillDir, 'SKILL.md'),
    cabecalhoYaml({ name: skill.name, description: skill.description }) + ler('metodo/00-metodo.md'),
  );

  // Modelos viajam junto: uma sessão isolada não enxerga a pasta do pacote.
  for (const arquivo of readdirSync(path.join(PACOTE, 'metodo/modelos'))) {
    escrever(
      path.join(skillDir, 'templates', arquivo),
      ler(`metodo/modelos/${arquivo}`),
      { marcado: false },
    );
  }

  // O roadmap de reconhecimento também: é ele que a skill manda rodar em projeto novo.
  for (const arquivo of readdirSync(path.join(PACOTE, 'metodo/reconhecimento'))) {
    escrever(
      path.join(skillDir, 'reconhecimento', arquivo),
      ler(`metodo/reconhecimento/${arquivo}`),
      { marcado: false },
    );
  }

  if (projeto) instalarGate();
}

function instalarGate() {
  const destino = path.join(projeto, '.crew');
  for (const arquivo of ['review-pipeline.mjs', 'review-pipeline.test.mjs']) {
    escrever(
      path.join(destino, arquivo),
      ler(`adaptadores/claude-code/gate/${arquivo}`),
      { marcado: false },
    );
  }

  const configPath = path.join(destino, 'config.json');
  if (existsSync(configPath)) {
    relatorio.preservados.push('.crew/config.json (já existia — não toquei nos comandos)');
  } else {
    escrever(
      configPath,
      `${JSON.stringify(
        {
          _gerado: MARCA,
          _preencher: 'manifestoRapido e manifestoCompleto vêm da fatia 01 da ficha',
          nivelDeRigor: rigor,
          manifestoRapido: [],
          manifestoCompleto: [],
          docOnly: ['*.md', 'docs/**', '.crew/**', '.gitignore'],
          stateFile: '.crew/review-state.json',
          exigirAdequacao: true,
        },
        null,
        2,
      )}\n`,
      { marcado: false },
    );
    relatorio.avisos.push(
      '.crew/config.json nasceu com manifesto VAZIO. Sem ele, `set review approved` recusa — de propósito.',
    );
  }

  // Hooks: detectar antes de escrever. Dois `Stop` bloqueantes brigando é pior que nenhum.
  const settings = path.join(projeto, '.claude', 'settings.json');
  const bloco = {
    PreToolUse: [
      {
        matcher: 'Bash|PowerShell',
        hooks: [
          {
            type: 'command',
            command: 'node "$CLAUDE_PROJECT_DIR/.crew/review-pipeline.mjs" gate',
            timeout: 10,
          },
        ],
      },
    ],
    Stop: [
      {
        hooks: [
          {
            type: 'command',
            command: 'node "$CLAUDE_PROJECT_DIR/.crew/review-pipeline.mjs" check',
            timeout: 60,
          },
        ],
      },
    ],
  };

  if (!existsSync(settings)) {
    escrever(settings, `${JSON.stringify({ hooks: bloco }, null, 2)}\n`, { marcado: false });
    return;
  }
  let atual;
  try {
    atual = JSON.parse(readFileSync(settings, 'utf8'));
  } catch {
    relatorio.avisos.push('.claude/settings.json ilegível — não mexi. Instale os hooks à mão.');
    return;
  }
  if (atual.hooks) {
    const lado = path.join(projeto, '.crew', 'hooks-para-mesclar.json');
    escrever(lado, `${JSON.stringify({ hooks: bloco }, null, 2)}\n`, { marcado: false });
    relatorio.avisos.push(
      '.claude/settings.json JÁ TEM hooks — NÃO mexi, e não mexa você sem ler isto: dois gates ' +
        'ocupando PreToolUse/Stop se substituem em SILÊNCIO e com FALHA ABERTA. O projeto fica ' +
        'sem gate nenhum e ninguém percebe, porque a ausência de gate não emite sinal. Em ' +
        'projeto que já tem aparelho, o caminho é FUNDIR, não instalar. O bloco a mesclar está ' +
        'em .crew/hooks-para-mesclar.json.',
    );
    return;
  }
  atual.hooks = bloco;
  escrever(settings, `${JSON.stringify(atual, null, 2)}\n`, { marcado: false });
}

// ─────────────────────────────────────────────────────────────────────────────
// Alvo: Cursor
// ─────────────────────────────────────────────────────────────────────────────

function instalarCursor() {
  if (!projeto) throw new Error('--alvo cursor exige --projeto (as regras do Cursor são do projeto)');
  const cfg = JSON.parse(ler('adaptadores/claude-code/agentes.json'));
  const dir = path.join(projeto, '.cursor', 'rules');

  for (const id of PAPEIS) {
    const meta = cfg.agentes[id];
    const frontmatter = cabecalhoYaml({
      description: JSON.stringify(meta.description),
      alwaysApply: 'false',
    });
    escrever(path.join(dir, `crew-${id}.mdc`), frontmatter + ler(`metodo/papeis/${id}.md`));
  }

  escrever(
    path.join(dir, 'crew-metodo.mdc'),
    cabecalhoYaml({
      description: JSON.stringify(cfg.skill.description),
      alwaysApply: 'false',
    }) + ler('metodo/00-metodo.md'),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Alvo: genérico (LLM sem harness — prompts avulsos)
// ─────────────────────────────────────────────────────────────────────────────

function instalarGenerico() {
  const dir = path.join(PACOTE, 'adaptadores', 'generico', 'prompts');
  const preambulo = (id) =>
    [
      `<!-- ${MARCA} -->`,
      '',
      `# Prompt avulso — ${id}`,
      '',
      '> Cole este arquivo inteiro como instrução de uma sessão **nova e limpa**, e nada mais.',
      '> A cegueira ao raciocínio de quem implementou é o que dá valor a este papel: se você',
      '> colar junto o histórico da implementação, o resultado vira concordância cara.',
      '',
      '> Entregue junto, como dados: o caminho da pasta do item (ou o contrato), a baseline',
      '> (hash), e a ficha do projeto. Nada além disso.',
      '',
      '---',
      '',
    ].join('\n');

  for (const id of PAPEIS) {
    escrever(path.join(dir, `${id}.md`), preambulo(id) + ler(`metodo/papeis/${id}.md`), {
      marcado: false,
    });
  }
  escrever(path.join(dir, 'metodo.md'), `<!-- ${MARCA} -->\n\n` + ler('metodo/00-metodo.md'), {
    marcado: false,
  });
}

// ─────────────────────────────────────────────────────────────────────────────

function verificarGit() {
  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' });
  } catch {
    relatorio.avisos.push(
      'git NÃO encontrado no PATH. O método inteiro depende dele (baseline, universo auditável, lente anti-forja). Instale antes de usar.',
    );
  }
}

function main() {
  if (!alvoBruto) {
    process.stderr.write(
      'uso: node instalar.mjs --alvo <claude-code|cursor|generico|todos> [--projeto <path>] [--rigor <nivel>] [--simular] [--forcar]\n',
    );
    return 1;
  }
  const alvos = alvoBruto === 'todos' ? ['claude-code', 'cursor', 'generico'] : alvoBruto.split(',');

  verificarGit();
  for (const alvo of alvos) {
    if (alvo === 'claude-code') instalarClaudeCode();
    else if (alvo === 'cursor') instalarCursor();
    else if (alvo === 'generico') instalarGenerico();
    else {
      process.stderr.write(`alvo desconhecido: ${alvo}\n`);
      return 1;
    }
  }

  const p = (s) => process.stdout.write(`${s}\n`);
  p(SIMULAR ? '\n=== SIMULAÇÃO (nada foi escrito) ===' : '\n=== instalado ===');
  p(`\nescritos (${relatorio.escritos.length}):`);
  for (const x of relatorio.escritos) p(`  + ${x}`);
  if (relatorio.preservados.length) {
    p(`\npreservados (${relatorio.preservados.length}):`);
    for (const x of relatorio.preservados) p(`  = ${x}`);
  }
  if (relatorio.avisos.length) {
    p(`\nAVISOS (${relatorio.avisos.length}) — exigem decisão sua:`);
    for (const x of relatorio.avisos) p(`  ! ${x}`);
  }
  p('\npróximo passo: rodar o roadmap de reconhecimento — metodo/reconhecimento/README.md\n');
  return 0;
}

process.exit(main());
