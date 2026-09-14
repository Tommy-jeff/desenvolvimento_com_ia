// Testes da lógica pura do gate. Sem dependência: `node --test` basta.
//
//   node --test adaptadores/claude-code/gate/
//
// Ficam fora da suíte do projeto hospedeiro de propósito: o gate é do pacote, não do
// projeto, e o projeto não deve ganhar teste de terceiro por adotar a tripulação.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  blockedGitSubcommand,
  deliveryIsFresh,
  evaluateCheck,
  evaluateGate,
  emptyState,
  isDocOnlyPath,
  matchGlob,
  reviewIsFresh,
  splitShellCommands,
  tokenize,
} from './review-pipeline.mjs';

test('matchGlob: * não atravessa separador, ** atravessa', () => {
  assert.equal(matchGlob('*.md', 'README.md'), true);
  assert.equal(matchGlob('*.md', 'docs/README.md'), false);
  assert.equal(matchGlob('docs/**', 'docs/a/b/c.txt'), true);
  assert.equal(matchGlob('docs/**', 'docs'), false);
  assert.equal(matchGlob('**/*.snap', 'a/b/x.snap'), true);
  assert.equal(matchGlob('**/*.snap', 'x.snap'), true, '**/ casa zero segmentos');
});

test('matchGlob: metacaractere de regex no padrão é literal', () => {
  assert.equal(matchGlob('a.b', 'a.b'), true);
  assert.equal(matchGlob('a.b', 'axb'), false, 'ponto não pode virar coringa');
  assert.equal(matchGlob('v1+.txt', 'v1+.txt'), true);
});

test('isDocOnlyPath: separador do Windows é normalizado', () => {
  assert.equal(isDocOnlyPath('docs\\guia\\a.txt'), true);
  assert.equal(isDocOnlyPath('src/app.ts'), false);
  assert.equal(isDocOnlyPath('.gitignore'), true);
  assert.equal(isDocOnlyPath('CHANGELOG.md'), true);
});

test('isDocOnlyPath: padrão vindo da config substitui o default', () => {
  assert.equal(isDocOnlyPath('notas/x.md', ['notas/**']), true);
  assert.equal(isDocOnlyPath('README.md', ['notas/**']), false, 'default não vale junto');
});

test('splitShellCommands: separadores não escondem um segundo comando', () => {
  assert.deepEqual(splitShellCommands('ls && git commit -m x'), ['ls', 'git commit -m x']);
  assert.deepEqual(splitShellCommands('a ; b | c'), ['a', 'b | c']);
  assert.deepEqual(splitShellCommands('a || b'), ['a', 'b']);
});

test('splitShellCommands: separador dentro de aspas não quebra', () => {
  assert.deepEqual(splitShellCommands('echo "a; b"'), ['echo "a; b"']);
});

test('tokenize: aspas agrupam', () => {
  assert.deepEqual(tokenize('git commit -m "uma mensagem"'), [
    'git',
    'commit',
    '-m',
    'uma mensagem',
  ]);
});

test('blockedGitSubcommand: pega add, commit e push', () => {
  assert.equal(blockedGitSubcommand('git add .'), 'add');
  assert.equal(blockedGitSubcommand('git commit -m x'), 'commit');
  assert.equal(blockedGitSubcommand('git push origin main'), 'push');
});

test('blockedGitSubcommand: leitura passa', () => {
  assert.equal(blockedGitSubcommand('git status --porcelain'), null);
  assert.equal(blockedGitSubcommand('git diff HEAD'), null);
  assert.equal(blockedGitSubcommand('npm test'), null);
});

test('blockedGitSubcommand: caminho completo e .exe não escapam', () => {
  assert.equal(blockedGitSubcommand('/usr/bin/git commit -m x'), 'commit');
  assert.equal(blockedGitSubcommand('git.exe push'), 'push');
  // Caminho com espaço só invoca git se vier entre aspas — sem elas, o shell tentaria
  // executar `C:\Program`. É a forma citada que precisa ser pega.
  assert.equal(blockedGitSubcommand('"C:\\Program Files\\Git\\bin\\git.exe" push'), 'push');
});

test('blockedGitSubcommand: flags globais antes do subcomando não escapam', () => {
  assert.equal(blockedGitSubcommand('git -C /tmp/repo commit -m x'), 'commit');
  assert.equal(blockedGitSubcommand('git -c user.name=x commit -m y'), 'commit');
  assert.equal(blockedGitSubcommand('GIT_DIR=/tmp/x git push'), 'push');
});

test('blockedGitSubcommand: comando que apenas contém a palavra não é bloqueado', () => {
  assert.equal(blockedGitSubcommand('echo "git commit"'), null, 'está dentro de aspas');
  assert.equal(blockedGitSubcommand('gitk --all'), null, 'outro executável');
});

test('deliveryIsFresh: sobrevive a correção, morre com HEAD novo', () => {
  const v = { status: 'approved', unit: 'item-01', head: 'abc', codeHash: 'h1' };
  assert.equal(deliveryIsFresh(v, 'item-01', 'abc'), true);
  assert.equal(deliveryIsFresh(v, 'item-01', 'def'), false, 'HEAD mudou');
  assert.equal(deliveryIsFresh(v, 'item-02', 'abc'), false, 'outra unidade');
});

test('deliveryIsFresh: reprovado nunca é fresco', () => {
  const v = { status: 'rejected', unit: 'item-01', head: 'abc' };
  assert.equal(deliveryIsFresh(v, 'item-01', 'abc'), false);
});

test('reviewIsFresh: qualquer edição de código o invalida', () => {
  const v = { status: 'approved', codeHash: 'h1' };
  assert.equal(reviewIsFresh(v, 'h1'), true);
  assert.equal(reviewIsFresh(v, 'h2'), false);
  assert.equal(reviewIsFresh(null, 'h1'), false);
});

const baseCheck = {
  rigor: 'normativo',
  codePaths: ['src/a.ts'],
  unitId: 'item-01',
  head: 'abc',
  codeHash: 'h1',
};

test('evaluateCheck: observador nunca bloqueia', () => {
  const r = evaluateCheck({ ...baseCheck, rigor: 'observador', state: emptyState() });
  assert.equal(r.blocked, false);
});

test('evaluateCheck: doc-only dispensa vereditos', () => {
  const r = evaluateCheck({ ...baseCheck, codePaths: [], state: emptyState() });
  assert.equal(r.blocked, false);
});

test('evaluateCheck: sem vereditos, bloqueia e nomeia os dois', () => {
  const r = evaluateCheck({ ...baseCheck, state: emptyState() });
  assert.equal(r.blocked, true);
  assert.match(r.reason, /delivery/);
  assert.match(r.reason, /review/);
});

test('evaluateCheck: review vencido por edição posterior bloqueia sozinho', () => {
  const state = {
    ...emptyState(),
    delivery: { status: 'approved', unit: 'item-01', head: 'abc', codeHash: 'h0' },
    review: { status: 'approved', codeHash: 'h0' },
  };
  const r = evaluateCheck({ ...baseCheck, state });
  assert.equal(r.blocked, true);
  assert.match(r.reason, /review/);
  assert.doesNotMatch(r.reason, /delivery/, 'delivery não é invalidado por correção');
});

test('evaluateCheck: dois vereditos frescos liberam', () => {
  const state = {
    ...emptyState(),
    delivery: { status: 'approved', unit: 'item-01', head: 'abc', codeHash: 'h1' },
    review: { status: 'approved', codeHash: 'h1' },
  };
  const r = evaluateCheck({ ...baseCheck, state });
  assert.equal(r.blocked, false);
});

test('evaluateGate: só o nível normativo bloqueia git', () => {
  const cmd = 'git commit -m x';
  assert.equal(evaluateGate({ rigor: 'normativo', command: cmd }).blocked, true);
  assert.equal(evaluateGate({ rigor: 'consultivo', command: cmd }).blocked, false);
  assert.equal(evaluateGate({ rigor: 'observador', command: cmd }).blocked, false);
});

test('evaluateGate: bloqueia mesmo escondido depois de outro comando', () => {
  const r = evaluateGate({ rigor: 'normativo', command: 'npm test && git push' });
  assert.equal(r.blocked, true);
  assert.match(r.reason, /push/);
});

test('evaluateGate: comando de leitura passa no nível normativo', () => {
  const r = evaluateGate({ rigor: 'normativo', command: 'git log --oneline -5' });
  assert.equal(r.blocked, false);
});
