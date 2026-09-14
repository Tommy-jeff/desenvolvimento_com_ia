#!/usr/bin/env node
// Gate mecânico da tripulação de revisão.
//
// Torna o fluxo de revisão REGRA em vez de convenção: sem os dois vereditos frescos, o fim
// do turno é bloqueado; e, no nível `normativo`, `git add|commit|push` é bloqueado sempre.
//
// Node ESM puro, sem dependência nenhuma, de propósito: o pacote precisa rodar numa máquina
// que você não configurou, dentro de um projeto que não é seu.
//
// Invocado de dois jeitos:
//   - hooks do assistente, com o JSON do tool call no stdin  → `gate` (PreToolUse) e
//     `check` (Stop). Exit 2 bloqueia.
//   - pelos papéis e pela sessão, como CLI                    → begin · scope · set · status · reset
//
// Configuração: <projeto>/.crew/config.json, gerado pelo instalador a partir da ficha.
// SEM config, o gate FALHA ABERTO (exit 0, silencioso) — um projeto que não adotou a
// tripulação nunca pode ser bloqueado por ela.
//
// Decisões de desenho:
//   - "Mudança de código" = qualquer path não-doc no `git status`. Doc-only dispensa o fluxo.
//   - O hash cobre o CONTEÚDO do worktree e é invariante a staging: `git add` não muda o
//     veredito, porque o que foi revisado foi o conteúdo, não o índice.
//   - `delivery` prende à unidade de trabalho + HEAD: correções não o invalidam (o auditor
//     de entrega já julgou a entrega; corrigir achado não refaz a entrega).
//   - `review` prende ao codeHash exato: QUALQUER edição de código o invalida, porque o
//     revisor aprovou aquele código e não outro.
//   - `set review approved` RODA o manifesto ele mesmo e recusa o registro se estiver
//     vermelho. Auto-relato é forjável; o gate confere em vez de acreditar.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// Lógica pura (coberta por review-pipeline.test.mjs)
// ─────────────────────────────────────────────────────────────────────────────

export const MISSING = 'MISSING';
export const CLEAN_HASH = 'clean';
export const STAGES = ['delivery', 'review'];
export const BLOCKED_GIT_SUBCOMMANDS = new Set(['add', 'commit', 'push']);

export const DEFAULT_DOC_ONLY = ['*.md', 'docs/**', '.crew/**', '.gitignore'];

/** Caracteres que precisam de escape ao virar regex. */
const GLOB_ESPECIAIS = new Set(['.', '+', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\']);

/**
 * Casa um path contra um glob simples: `*` nao atravessa `/`, `**` atravessa.
 * Deliberadamente pequeno — o universo de padroes aqui e o da config, nao o do shell.
 */
export function matchGlob(pattern, filePath) {
  let rx = '';
  for (let i = 0; i < pattern.length; i += 1) {
    const c = pattern[i];
    if (c === '*') {
      if (pattern[i + 1] === '*') {
        if (pattern[i + 2] === '/') {
          rx += '(?:.*/)?'; // "**/" atravessa zero ou mais segmentos
          i += 2;
        } else {
          rx += '.*';
          i += 1;
        }
      } else {
        rx += '[^/]*'; // "*" sozinho nao atravessa separador
      }
      continue;
    }
    if (c === '?') {
      rx += '[^/]';
      continue;
    }
    rx += GLOB_ESPECIAIS.has(c) ? '\\' + c : c;
  }
  return new RegExp('^' + rx + '$').test(filePath);
}

/** Um path é doc-only quando casa com qualquer padrão da lista. */
export function isDocOnlyPath(filePath, patterns = DEFAULT_DOC_ONLY) {
  const normalized = filePath.replace(/\\/g, '/').replace(/^\.\//, '');
  const base = normalized.split('/').pop() ?? normalized;
  return patterns.some((p) => matchGlob(p, normalized) || matchGlob(p, base));
}

/**
 * Quebra uma linha de shell nos separadores de comando, para que `ls && git commit` não
 * escape por estar depois de um `&&`.
 */
export function splitShellCommands(command) {
  const parts = [];
  let current = '';
  let quote = null;
  for (let i = 0; i < command.length; i += 1) {
    const c = command[i];
    if (quote) {
      if (c === quote) quote = null;
      current += c;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      current += c;
      continue;
    }
    if (c === ';' || c === '\n' || c === '\r' || c === '(' || c === ')') {
      parts.push(current);
      current = '';
      continue;
    }
    if ((c === '&' || c === '|') && command[i + 1] === c) {
      parts.push(current);
      current = '';
      i += 1;
      continue;
    }
    current += c;
  }
  parts.push(current);
  return parts.map((p) => p.trim()).filter(Boolean);
}

/** Tokeniza respeitando aspas — o suficiente para achar o subcomando do git. */
export function tokenize(segment) {
  const tokens = [];
  let current = '';
  let quote = null;
  for (const c of segment) {
    if (quote) {
      if (c === quote) quote = null;
      else current += c;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }
    if (/\s/.test(c)) {
      if (current) tokens.push(current);
      current = '';
      continue;
    }
    current += c;
  }
  if (current) tokens.push(current);
  return tokens;
}

/**
 * Devolve o subcomando de escrita do git presente num segmento, ou null.
 * Reconhece o executável por basename (`/usr/bin/git`, `git.exe`) e pula as flags globais
 * (`-C <dir>`, `-c k=v`, `--git-dir=…`) que separam `git` do subcomando.
 */
export function blockedGitSubcommand(segment) {
  const tokens = tokenize(segment);
  if (tokens.length === 0) return null;

  let i = 0;
  // VAR=valor antes do comando
  while (i < tokens.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[i])) i += 1;
  if (i >= tokens.length) return null;

  let exe = tokens[i].replace(/\\/g, '/');
  exe = exe.slice(exe.lastIndexOf('/') + 1).toLowerCase();
  if (exe.endsWith('.exe')) exe = exe.slice(0, -4);
  if (exe !== 'git') return null;
  i += 1;

  while (i < tokens.length) {
    const t = tokens[i];
    if (t === '-C' || t === '-c' || t === '--git-dir' || t === '--work-tree') {
      i += 2;
      continue;
    }
    if (t.startsWith('-')) {
      i += 1;
      continue;
    }
    return BLOCKED_GIT_SUBCOMMANDS.has(t) ? t : null;
  }
  return null;
}

/** Estado inicial — nenhum veredito, nenhuma unidade aberta. */
export function emptyState() {
  return { unit: null, delivery: null, review: null };
}

/**
 * Um veredito `delivery` está fresco enquanto a unidade de trabalho e o HEAD não mudarem.
 * Correções mexem no worktree, não no HEAD — e é isso que o deixa sobreviver a elas.
 */
export function deliveryIsFresh(verdict, unitId, head) {
  if (!verdict || verdict.status !== 'approved') return false;
  return verdict.unit === unitId && verdict.head === head;
}

/** Um veredito `review` está fresco só enquanto o conteúdo do código for o mesmo. */
export function reviewIsFresh(verdict, codeHash) {
  if (!verdict || verdict.status !== 'approved') return false;
  return verdict.codeHash === codeHash;
}

/**
 * A decisão do `check` (hook de fim de turno).
 * @returns {{blocked: boolean, reason: string}}
 */
export function evaluateCheck({ rigor, codePaths, state, unitId, head, codeHash }) {
  if (rigor === 'observador') {
    return { blocked: false, reason: 'nível observador — o gate registra, não bloqueia' };
  }
  if (codePaths.length === 0) {
    return { blocked: false, reason: 'doc-only — nenhum path de código alterado' };
  }
  const missing = [];
  if (!deliveryIsFresh(state.delivery, unitId, head)) missing.push('delivery');
  if (!reviewIsFresh(state.review, codeHash)) missing.push('review');
  if (missing.length === 0) return { blocked: false, reason: 'dois vereditos frescos' };
  return {
    blocked: true,
    reason: `veredito ausente ou vencido: ${missing.join(', ')}`,
  };
}

/** A decisão do `gate` (hook de operação de escrita do git). */
export function evaluateGate({ rigor, command }) {
  if (rigor !== 'normativo') {
    return { blocked: false, reason: `nível ${rigor} — git liberado` };
  }
  for (const segment of splitShellCommands(command)) {
    const sub = blockedGitSubcommand(segment);
    if (sub) return { blocked: true, reason: `git ${sub}` };
  }
  return { blocked: false, reason: 'nenhuma operação de escrita do git' };
}

// ─────────────────────────────────────────────────────────────────────────────
// I/O
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG_PATH = '.crew/config.json';

function projectRoot() {
  return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

function readConfig() {
  const file = path.join(projectRoot(), CONFIG_PATH);
  if (!existsSync(file)) return null;
  try {
    const cfg = JSON.parse(readFileSync(file, 'utf8'));
    return {
      rigor: cfg.nivelDeRigor ?? 'consultivo',
      manifestoRapido: cfg.manifestoRapido ?? [],
      manifestoCompleto: cfg.manifestoCompleto ?? [],
      docOnly: cfg.docOnly ?? DEFAULT_DOC_ONLY,
      stateFile: cfg.stateFile ?? '.crew/review-state.json',
      exigirAdequacao: cfg.exigirAdequacao ?? true,
    };
  } catch (e) {
    // Config quebrada é diagnóstico, não licença: avisa e falha ABERTO, porque um gate que
    // trava o projeto por causa do próprio defeito é pior que gate nenhum.
    process.stderr.write(`[crew] config ilegível (${e.message}) — gate desligado\n`);
    return null;
  }
}

function statePath(cfg) {
  return path.join(projectRoot(), cfg.stateFile);
}

function readState(cfg) {
  const file = statePath(cfg);
  if (!existsSync(file)) return emptyState();
  try {
    return { ...emptyState(), ...JSON.parse(readFileSync(file, 'utf8')) };
  } catch {
    return emptyState();
  }
}

function writeState(cfg, state) {
  const file = statePath(cfg);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync('git', args, {
      cwd: projectRoot(),
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) {
    if (allowFail) return '';
    throw e;
  }
}

function headCommit() {
  const out = git(['rev-parse', 'HEAD'], { allowFail: true }).trim();
  return out || MISSING;
}

/** Paths alterados no worktree, staged ou não, incluindo untracked. */
function changedPaths() {
  const out = git(['status', '--porcelain', '-uall'], { allowFail: true });
  const paths = [];
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    let p = line.slice(3).trim();
    // rename: "old -> new" — o que importa é o destino
    const arrow = p.indexOf(' -> ');
    if (arrow !== -1) p = p.slice(arrow + 4);
    if (p.startsWith('"') && p.endsWith('"')) p = p.slice(1, -1);
    paths.push(p);
  }
  return paths;
}

/**
 * Hash do CONTEÚDO dos paths de código alterados — invariante a staging.
 * Arquivo ausente entra como marcador explícito: deletar arquivo revisado muda o hash.
 */
function computeCodeHash(codePaths) {
  if (codePaths.length === 0) return CLEAN_HASH;
  const hash = createHash('sha256');
  for (const p of [...codePaths].sort()) {
    hash.update(p);
    hash.update('\0');
    const abs = path.join(projectRoot(), p);
    if (existsSync(abs)) hash.update(readFileSync(abs));
    else hash.update(MISSING);
    hash.update('\0');
  }
  return hash.digest('hex');
}

function runManifest(commands) {
  const results = [];
  for (const cmd of commands) {
    const [exe, ...args] = cmd;
    try {
      const out = execFileSync(exe, args, {
        cwd: projectRoot(),
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        timeout: 20 * 60 * 1000,
        // no Windows os runners costumam ser .bat/.cmd; o comando vem da config, não do usuário
        shell: process.platform === 'win32',
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      results.push({ cmd: cmd.join(' '), ok: true, tail: tail(out) });
    } catch (e) {
      const output = `${e.stdout ?? ''}${e.stderr ?? ''}` || e.message;
      results.push({ cmd: cmd.join(' '), ok: false, tail: tail(output) });
      break; // primeiro vermelho já decide
    }
  }
  return results;
}

function tail(text, n = 2000) {
  const s = String(text);
  return s.length <= n ? s : `…${s.slice(-n)}`;
}

async function readStdin(timeoutMs = 5000) {
  if (process.stdin.isTTY) return '';
  return new Promise((resolve) => {
    let data = '';
    const done = (v) => {
      clearTimeout(timer);
      resolve(v);
    };
    const timer = setTimeout(() => done(data), timeoutMs);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => {
      data += c;
    });
    process.stdin.on('end', () => done(data));
    process.stdin.on('error', () => done(data));
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Comandos
// ─────────────────────────────────────────────────────────────────────────────

function context(cfg) {
  const state = readState(cfg);
  const changed = changedPaths();
  const codePaths = changed.filter((p) => !isDocOnlyPath(p, cfg.docOnly));
  return {
    state,
    changed,
    codePaths,
    head: headCommit(),
    codeHash: computeCodeHash(codePaths),
    unitId: state.unit?.id ?? MISSING,
  };
}

function cmdBegin(cfg, args) {
  const id = args[0];
  if (!id) {
    process.stderr.write('uso: begin <id-do-item>\n');
    return 1;
  }
  const state = readState(cfg);
  state.unit = { id, head: headCommit(), at: new Date().toISOString() };
  state.delivery = null;
  state.review = null;
  writeState(cfg, state);
  process.stdout.write(`unidade aberta: ${id} @ ${state.unit.head.slice(0, 8)}\n`);
  process.stdout.write('vereditos zerados — a unidade anterior não empresta aprovação a esta\n');
  return 0;
}

function cmdScope(cfg) {
  const { changed, codePaths, unitId, head, codeHash } = context(cfg);
  process.stdout.write(`unidade: ${unitId}\nHEAD: ${head}\ncodeHash: ${codeHash}\n\n`);
  if (changed.length === 0) {
    process.stdout.write('worktree limpo — nenhum arquivo alterado\n');
    return 0;
  }
  process.stdout.write(`código (${codePaths.length}):\n`);
  for (const p of codePaths) process.stdout.write(`  ${p}\n`);
  const docs = changed.filter((p) => isDocOnlyPath(p, cfg.docOnly));
  process.stdout.write(`\ndoc-only (${docs.length}):\n`);
  for (const p of docs) process.stdout.write(`  ${p}\n`);
  return 0;
}

function cmdSet(cfg, args) {
  const [stage, status, ...rest] = args;
  if (!STAGES.includes(stage) || !['approved', 'rejected'].includes(status)) {
    process.stderr.write(
      'uso: set <delivery|review> <approved|rejected> [--adequacy-file <arquivo|->]\n',
    );
    return 1;
  }

  const ctx = context(cfg);

  // Aprovar a revisão AFIRMA que o manifesto está verde. O gate confere a afirmação.
  if (stage === 'review' && status === 'approved') {
    if (cfg.exigirAdequacao) {
      const flagIdx = rest.indexOf('--adequacy-file');
      const file = flagIdx === -1 ? null : rest[flagIdx + 1];
      if (!file) {
        process.stderr.write(
          'recusado: `set review approved` exige --adequacy-file <arquivo|->.\n' +
            'A adequação de teste é a única evidência de que a mutação foi de fato procurada;\n' +
            'sem arquivo, ela é exatamente o campo que some na rodada em que ninguém pede.\n',
        );
        return 1;
      }
      const text = file === '-' ? readFileSync(0, 'utf8') : readFileSync(file, 'utf8');
      if (text.trim().length < 40) {
        process.stderr.write('recusado: adequação de teste vazia ou trivial.\n');
        return 1;
      }
      ctx.state.adequacy = { at: new Date().toISOString(), text: text.trim() };
    }

    if (cfg.manifestoRapido.length === 0) {
      process.stderr.write(
        'recusado: nenhum manifesto configurado. Aprovar revisão afirma verde, e não há\n' +
          'instrumento para conferir. Preencha `manifestoRapido` em .crew/config.json.\n',
      );
      return 1;
    }
    const results = runManifest(cfg.manifestoRapido);
    const red = results.find((r) => !r.ok);
    if (red) {
      process.stderr.write(`recusado: manifesto vermelho — \`${red.cmd}\`\n${red.tail}\n`);
      return 1;
    }
    ctx.state.manifesto = { at: new Date().toISOString(), results: results.map((r) => r.cmd) };
  }

  ctx.state[stage] = {
    status,
    unit: ctx.unitId,
    head: ctx.head,
    codeHash: ctx.codeHash,
    at: new Date().toISOString(),
  };
  writeState(cfg, ctx.state);
  process.stdout.write(`${stage}: ${status} registrado (codeHash ${ctx.codeHash.slice(0, 12)})\n`);
  return 0;
}

function cmdStatus(cfg) {
  const ctx = context(cfg);
  const d = deliveryIsFresh(ctx.state.delivery, ctx.unitId, ctx.head);
  const r = reviewIsFresh(ctx.state.review, ctx.codeHash);
  process.stdout.write(
    `nível de rigor : ${cfg.rigor}\n` +
      `unidade        : ${ctx.unitId}\n` +
      `HEAD           : ${ctx.head}\n` +
      `codeHash       : ${ctx.codeHash}\n` +
      `código alterado: ${ctx.codePaths.length} arquivo(s)\n` +
      `delivery       : ${ctx.state.delivery?.status ?? '—'} ${d ? '(fresco)' : '(ausente/vencido)'}\n` +
      `review         : ${ctx.state.review?.status ?? '—'} ${r ? '(fresco)' : '(ausente/vencido)'}\n`,
  );
  return 0;
}

function cmdReset(cfg) {
  writeState(cfg, emptyState());
  process.stdout.write('estado zerado\n');
  return 0;
}

async function cmdGate(cfg) {
  const raw = await readStdin();
  let command = '';
  try {
    const payload = JSON.parse(raw || '{}');
    command = payload?.tool_input?.command ?? '';
  } catch {
    return 0; // payload ilegível não é motivo para travar o turno de ninguém
  }
  if (!command) return 0;

  const decision = evaluateGate({ rigor: cfg.rigor, command });
  if (!decision.blocked) return 0;

  process.stderr.write(
    `BLOQUEADO pelo gate da tripulação: \`${decision.reason}\`.\n\n` +
      'A entrega termina em RELATÓRIO — o commit é do dev, à mão. Isto vale mesmo com os\n' +
      'dois vereditos verdes e mesmo "só para facilitar". Se o dev pediu o commit\n' +
      'explicitamente, ele mesmo o executa.\n',
  );
  return 2;
}

async function cmdCheck(cfg) {
  await readStdin(1000);
  const ctx = context(cfg);
  const decision = evaluateCheck({
    rigor: cfg.rigor,
    codePaths: ctx.codePaths,
    state: ctx.state,
    unitId: ctx.unitId,
    head: ctx.head,
    codeHash: ctx.codeHash,
  });
  if (!decision.blocked) return 0;

  process.stderr.write(
    `BLOQUEADO pelo gate da tripulação: ${decision.reason}.\n\n` +
      `${ctx.codePaths.length} arquivo(s) de código alterados nesta unidade (${ctx.unitId}).\n` +
      'Antes de encerrar o turno: despache os dois inspetores, passe os achados dos DOIS ao\n' +
      'engenheiro numa fila única, revalide, e registre os vereditos com\n' +
      '`review-pipeline.mjs set <delivery|review> approved`.\n',
  );
  return 2;
}

// ─────────────────────────────────────────────────────────────────────────────

const USAGE = `tripulação — gate de revisão

  begin <id>                              abre uma unidade de trabalho (zera vereditos)
  scope                                   o que mudou nesta unidade
  set <delivery|review> <approved|rejected> [--adequacy-file <arquivo|->]
  status                                  estado atual e frescor dos vereditos
  gate                                    hook PreToolUse (stdin: JSON do tool call)
  check                                   hook Stop (exige vereditos frescos)
  reset                                   zera o estado
`;

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const cfg = readConfig();

  // Sem config, o projeto não adotou a tripulação: hooks saem em silêncio, CLI explica.
  if (!cfg) {
    if (command === 'gate' || command === 'check') return 0;
    process.stderr.write(
      `tripulação não configurada neste projeto (falta ${CONFIG_PATH}).\n` +
        'Rode o instalador do adaptador antes de usar o gate.\n',
    );
    return 1;
  }

  switch (command) {
    case 'begin':
      return cmdBegin(cfg, args);
    case 'scope':
      return cmdScope(cfg);
    case 'set':
      return cmdSet(cfg, args);
    case 'status':
      return cmdStatus(cfg);
    case 'reset':
      return cmdReset(cfg);
    case 'gate':
      return cmdGate(cfg);
    case 'check':
      return cmdCheck(cfg);
    default:
      process.stdout.write(USAGE);
      return command ? 1 : 0;
  }
}

// Só executa quando chamado como programa — o arquivo de teste importa as puras.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href.replace(/\\/g, '/')) {
  main().then((code) => process.exit(code));
} else if (process.env.CREW_FORCE_MAIN === '1') {
  main().then((code) => process.exit(code));
}
