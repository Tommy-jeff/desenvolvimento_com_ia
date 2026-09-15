// Testes de estrutura do pacote.
//
//   node --test testes/estrutura.test.mjs
//
// (o caminho do arquivo, não o do diretório: `node --test <dir>` falha no Windows)
//
// Rubrica é prosa, e prosa não se testa. Mas a ESTRUTURA que a prosa habita se testa: seção
// obrigatória que sumiu, papel sem frontmatter, fatia sem teto, campo que os papéis leem e o
// modelo não declara. Foi exatamente esse tipo de buraco — um modelo sem teto de tamanho, uma
// rubrica sem regra de persistência — que custou caro no primeiro uso real.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ler = (rel) => readFileSync(path.join(RAIZ, rel), 'utf8');
const NUL = String.fromCharCode(0);

const PAPEIS = ['coder-reviewer', 'delivery-inspector', 'software-engineer', 'harness-scout'];
const FATIAS = [
  '00-perimetro',
  '01-manifesto-e-sensores',
  '02-testes',
  '03-padroes-e-decisoes',
  '04-aparelho-de-ia',
  '05-fronteiras-e-risco',
  '06-classes-de-arquivo',
];

// ─── papéis ────────────────────────────────────────────────────────────────

test('todo papel existe e tem título e proibições', () => {
  for (const id of PAPEIS) {
    const t = ler(`metodo/papeis/${id}.md`);
    assert.match(t, /^# .+/m, `${id}: sem título`);
    assert.match(t, /^## Proibições/m, `${id}: sem seção de proibições`);
  }
});

test('todo papel que grava retorno manda gravar cedo', () => {
  // O escape de 2026-09-14: trabalho caro que só persiste no fim.
  for (const id of ['coder-reviewer', 'delivery-inspector', 'software-engineer', 'harness-scout']) {
    const t = ler(`metodo/papeis/${id}.md`);
    assert.match(t, /[Gg]rave .*cedo|assim que/, `${id}: não manda gravar cedo`);
    assert.match(t, /heredoc/, `${id}: não proíbe heredoc`);
  }
});

test('todo papel que consome a ficha sabe o que é uma suposição', () => {
  for (const id of ['coder-reviewer', 'delivery-inspector', 'software-engineer']) {
    const t = ler(`metodo/papeis/${id}.md`);
    assert.match(t, /SUPOSIÇÃO/, `${id}: não trata campo marcado como suposição`);
  }
});

test('papéis e agentes.json não divergem', () => {
  const cfg = JSON.parse(ler('adaptadores/claude-code/agentes.json'));
  const noJson = Object.keys(cfg.agentes).sort();
  const noDisco = readdirSync(path.join(RAIZ, 'metodo/papeis'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();
  assert.deepEqual(noJson, noDisco, 'agentes.json e metodo/papeis/ descrevem conjuntos diferentes');
});

test('todo agente declara name, description e tools', () => {
  const cfg = JSON.parse(ler('adaptadores/claude-code/agentes.json'));
  for (const [id, meta] of Object.entries(cfg.agentes)) {
    for (const campo of ['name', 'description', 'tools']) {
      assert.ok(meta[campo], `${id}: falta ${campo}`);
    }
    assert.equal(meta.name, id, `${id}: name diverge da chave`);
    assert.doesNotMatch(
      meta.tools,
      /PowerShell/,
      `${id}: PowerShell só existe no Windows — o mesmo arquivo mentiria em macOS/Linux`,
    );
  }
});

// ─── núcleo neutro ─────────────────────────────────────────────────────────

test('o núcleo não carrega frontmatter de ferramenta', () => {
  for (const id of PAPEIS) {
    const t = ler(`metodo/papeis/${id}.md`);
    assert.doesNotMatch(
      t.split('\n').slice(0, 5).join('\n'),
      /^tools:|^name:/m,
      `${id}: frontmatter de ferramenta vazou para o núcleo (é do adaptador)`,
    );
  }
});

test('nenhum arquivo do núcleo tem byte NUL', () => {
  const varrer = (dir) => {
    for (const entrada of readdirSync(path.join(RAIZ, dir), { withFileTypes: true })) {
      const rel = `${dir}/${entrada.name}`;
      if (entrada.isDirectory()) varrer(rel);
      else if (entrada.name.endsWith('.md')) {
        assert.ok(!ler(rel).includes(NUL), `${rel}: contém byte NUL`);
      }
    }
  };
  varrer('metodo');
});

// ─── modelos ───────────────────────────────────────────────────────────────

test('o modelo da ficha declara todo campo operacional que os papéis leem', () => {
  const t = ler('metodo/modelos/ficha-indice.md');
  const campos = [
    'projeto',
    'slug',
    'raiz',
    'reconhecido_em',
    'dono_disponivel',
    'aprovado_pelo_dev',
    'nivel_de_rigor',
    'idioma_dos_retornos',
    'quem_comita',
    'roadmap_mora_em',
    'retornos_schema',
    'manifesto_rapido',
    'manifesto_completo',
  ];
  for (const c of campos) {
    assert.match(t, new RegExp(`^${c}:`, 'm'), `ficha-indice: falta o campo ${c}`);
  }
});

test('o modelo da ficha impõe teto de tamanho', () => {
  assert.match(ler('metodo/modelos/ficha-indice.md'), /Teto: 120 linhas/);
});

test('o modelo da régua tem as seções que os inspetores leem', () => {
  const t = ler('metodo/modelos/quality.md');
  for (const secao of [
    '## Escopo',
    '## Arquivos a tocar',
    '## Orçamentos',
    '## Testes obrigatórios',
    '## Definition of Done',
    '# CLASSIFICAÇÃO DE ACHADOS',
  ]) {
    assert.ok(t.includes(secao), `quality: falta ${secao}`);
  }
});

test('o modelo do brief carrega o frontmatter de status', () => {
  const t = ler('metodo/modelos/brief.md');
  for (const c of ['status:', 'prioridade:', 'depende_de:', 'bloqueia:', 'commit:']) {
    assert.ok(t.includes(c), `brief: falta ${c}`);
  }
});

test('todo modelo referenciado pelo método existe', () => {
  for (const m of [
    'brief.md',
    'quality.md',
    'retornos-schema.md',
    'roadmap-readme.md',
    'skill-normativa.md',
    'ficha-indice.md',
    'ponteiro-no-projeto.md',
  ]) {
    assert.ok(existsSync(path.join(RAIZ, 'metodo/modelos', m)), `modelo ausente: ${m}`);
  }
});

// ─── reconhecimento ────────────────────────────────────────────────────────

test('toda fatia existe e é listada no README do reconhecimento', () => {
  const readme = ler('metodo/reconhecimento/README.md');
  for (const f of [...FATIAS, '07-consolidacao']) {
    assert.ok(existsSync(path.join(RAIZ, `metodo/reconhecimento/${f}.md`)), `fatia ausente: ${f}`);
    assert.ok(readme.includes(`${f}.md`), `README não lista a fatia ${f}`);
  }
});

test('toda fatia declara os dois tetos e o arquivo de saída', () => {
  for (const f of FATIAS) {
    const t = ler(`metodo/reconhecimento/${f}.md`);
    assert.match(t, /Teto de leitura: \d+ arquivos/, `${f}: sem teto de leitura`);
    assert.match(t, /teto de saída: \d+ linhas/, `${f}: sem teto de saída`);
    assert.match(t, /\*\*Saída:\*\*/, `${f}: não declara o arquivo de saída`);
    assert.match(t, /Só leitura/, `${f}: não se declara só-leitura`);
  }
});

test('a consolidação impõe teto de bloqueantes e conhece o modo sem dono', () => {
  const t = ler('metodo/reconhecimento/07-consolidacao.md');
  assert.match(t, /cinco bloqueantes/, 'sem teto de bloqueantes');
  assert.match(t, /dono_disponivel/, 'não conhece o modo sem dono');
  assert.match(t, /120 linhas/, 'não impõe o teto do índice no gate');
});

test('o método documenta o modo sem dono', () => {
  const t = ler('metodo/00-metodo.md');
  assert.match(t, /dono_disponivel/, 'método não documenta dono_disponivel');
  assert.match(t, /SUPOSIÇÃO/, 'método não define o que é uma suposição marcada');
});

// ─── pacote ────────────────────────────────────────────────────────────────

test('o backlog só aceita item com origem rastreável', () => {
  const t = ler('MELHORIAS.md');
  const itens = t.split('\n').filter((l) => /^### /.test(l));
  assert.ok(itens.length > 0, 'backlog vazio');
  const corpos = t.split(/^### /m).slice(1);
  for (const corpo of corpos) {
    const titulo = corpo.split('\n')[0];
    assert.match(corpo, /\*\*Origem:\*\*|Origem:|decisão do dev/, `item sem origem: ${titulo}`);
  }
});
