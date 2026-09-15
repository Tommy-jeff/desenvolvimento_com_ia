# Ficha — 04. Aparelho de IA existente

> Levantado em 2026-09-14 · fontes citadas por linha
>
> **Consolidação de duas passadas**, cada uma com teto de 12 arquivos:
> - **Passada 1** (12/12): `.gitignore`, `AGENTS.md`, `AGENT.md`, `docs/AI_GUIDELINES.md`,
>   `QUALITY_WIKI.md`, `.husky/pre-commit`, `.specforce/config.yaml`,
>   `.specforce/docs/governance.md`, `.claude/settings.json`, `.claude/settings.local.json`,
>   `.claude/INSTALL.md`, `.windsurf/rules/doc-flutter.md` — mais listagens de diretório.
> - **Passada 2** (12/12): repetiu `.gitignore`, `AGENTS.md`, `AGENT.md`,
>   `docs/AI_GUIDELINES.md`, `.husky/pre-commit`, `.specforce/config.yaml`,
>   `.specforce/docs/governance.md`, `.claude/settings.json`, `.claude/settings.local.json`
>   e abriu o que a passada 1 deixou fechado: **`.specforce/scripts/all_tasks_check.sh`**,
>   **`phase_check.sh`** e **`format_changed.sh`**.
>
> A passada 2 derrubou uma classificação da passada 1 (os scripts do Specforce eram
> "ignorar — não lidos"; são **conflito material**) e levantou o **Conflito #8**, o mais grave
> desta ficha. As seções abaixo já estão consolidadas.
>
> ⛔ **Ambas as passadas foram proibidas de rodar qualquer comando git.** A distinção
> versionado/ignorado vem **exclusivamente da leitura do `.gitignore` com `cat`**. Onde exigiria
> `git check-ignore`/`git ls-files`, está declarada como não encontrada.

## Já em contexto (não relido)

- `CLAUDE.md` (raiz, 27.563 b) — carregado pelo harness como project instructions. Respondeu:
  a doutrina inteira da "Tripulação de revisão" (5 passos, piso de severidade, 3 rodadas,
  proibição de commit), o manifesto de qualidade, o gate mecânico e seus comandos, a regra
  doc-only, o formato de roadmap, e a declaração de pegada zero no git. **É o artefato central
  desta fatia e não foi reaberto em nenhuma das duas passadas.**
- `MEMORY.md` (auto-memória do usuário, `~/.claude/projects/.../memory/`) — respondeu: regra
  "Sem operações git" (nunca add/commit/push), "Code naming in English", "DoD antes dos
  inspetores", "Bug-fix history folder", obrigatoriedade do fvm, e
  "fvm-symlink-nao-segue-branch" (crítico para o Conflito #9).

---

## O quadro em uma tabela

O projeto tem **quatro aparelhos de IA empilhados, de três donos, que não se conhecem**:

| Camada | Dono | Versionado? | Natureza | Vivo? |
|---|---|---|---|---|
| **A. Specforce** (`.specforce/`, `AGENTS.md`) | time / ferramenta externa | **não ignorado** | Spec-Driven Development + hooks de transição de estado | specs todas arquivadas desde 2026-05; mtime 2026-08-19 |
| **B. Husky + AI_GUIDELINES + QUALITY_WIKI** (`.husky/`, `AGENT.md`, `docs/AI_GUIDELINES.md`) | time | **não ignorado** | Quality gate de pre-commit do git | sim — roda em todo commit |
| **C. Tripulação pessoal** (`CLAUDE.md`, `.claude/`, `~/.claude/agents/`) | o dev, nesta máquina | **IGNORADO** | Revisão por agentes + gate mecânico nos hooks do Claude Code | sim — 6 retornos JSON reais |
| **D. Windsurf** (`.windsurf/`) | ? | **não ignorado** | Regra de documentação, `trigger: manual` | provável resíduo (2026-05-15) |

A camada **C é a mais rigorosa** em verificação e a mais restritiva em git. A camada **A é a
única que outro dev do time enxerga** — e é **mais frouxa**. É daí que nasce todo o conflito.

---

## Inventário

Legenda de "Versionado?": **IGNORADO** = casa com linha explícita do `.gitignore`.
**não ignorado** = nenhuma linha do `.gitignore` o alcança (rastreamento efetivo não
verificável sem git — ver "Não coberto").

| Artefato | Ferramenta | Versionado? | O que determina | Desfecho proposto | Justificativa |
|---|---|---|---|---|---|
| `CLAUDE.md` (raiz) | Claude Code | **IGNORADO** (`.gitignore:70`) | Guia do projeto + doutrina completa da tripulação + manifesto + roadmaps | **complementa** (é o próprio hospedeiro) | Já contém a tripulação. É onde o ponteiro do pacote deve morar — ver seção própria |
| `.claude/` (dir inteiro) | Claude Code | **IGNORADO** (`.gitignore:72`) | Hooks, gate mecânico, permissões, retornos, comando `/status-steps` | **complementa** | Aparelho vivo do dev, pegada zero no git por desenho (`.claude/INSTALL.md:3`) |
| `.claude/settings.json` | Claude Code | IGNORADO | 2 hooks: PreToolUse(Bash\|PowerShell)→`gate`; Stop→`check` | **complementa** | Ver "Hooks e gates" |
| `.claude/settings.local.json` | Claude Code | IGNORADO | Allowlist: `fvm flutter *`, `fvm dart *`, **`git *`**, `fvm --version` (:4-8) | **conflita** (aparente) | Permite `git *` amplamente; quem barra git é o hook, não a allowlist — ver Conflito #5 |
| `.claude/tool/review_pipeline.dart` (22.255 b) + `.claude/bin/review_pipeline.exe` (6,4 MB, compilado 2026-08-03) | gate próprio | IGNORADO | `begin/scope/set/check/status/gate/reset`; estado em `review-state.json` (567 b) | **complementa** | **Gate já instalado e funcional** — o pacote NÃO deve instalar outro |
| `.claude/tool/review_pipeline_test.dart` | — | IGNORADO | Testes do gate, fora da suíte padrão de propósito | **complementa** | Regenerar o exe após editar o gate (`INSTALL.md:40-43`) |
| `.claude/INSTALL.md` | Claude Code | IGNORADO | Backup/portabilidade: copiar `.claude/` + `CLAUDE.md` | **complementa** | Mas **desatualizado**: aponta agentes em `.claude/agents/*.md` (:13), que **não existe** |
| `.claude/retornos/*.json` (6 arquivos, 22–55 KB) | tripulação | IGNORADO | Retornos reais de `delivery-inspector`, `coder-reviewer`, `software-engineer` | **complementa** | **Prova de uso vivo** da tripulação. Dois layouts coexistem — ver Conflito #6 |
| `.claude/current-item.md` (5.694 b) | Claude Code | IGNORADO | Pedido verbatim entregue ao delivery-inspector (que não vê a conversa) | **complementa** | Mecanismo já previsto em `CLAUDE.md`. Reaproveitar, não reinventar |
| `.claude/commands/status-steps.md` (14.895 b) | slash command | IGNORADO | Comando `/status-steps` (conteúdo não lido — teto) | **complementa** (provisório) | Gêmeo do skill Gemini abaixo; classificação provisória |
| `~/.claude/agents/{coder-reviewer,delivery-inspector,harness-scout,software-engineer}.md` | Claude Code | **fora do repo** (nível usuário) | As 4 definições de agente da tripulação, mtime 2026-09-14 00:37 | **complementa** — com ressalva grave | **Colisão total de nome, já materializada.** Ver "Colisões de nome" |
| `AGENTS.md` (4.545 b, mtime 2026-08-19 14:15) | **Specforce** (e todo agente que lê `AGENTS.md`) | **não ignorado** | Protocolo SDD obrigatório `/spf:discovery\|spec\|constitution\|implement\|archive` (:9-13); **Proactive Mandate** (:15-19); **DIRECT EDIT PROHIBITION** — proibido mutar código sem spec aprovada (:21-26); Constitution em `.specforce/docs/` (:29-35); hooks bloqueiam transição (:52); reads cirúrgicos e paralelismo (:54-58); **Interactive Consultation Protocol** (:60-61) | **conflita (forte)** | Doutrina de planejamento rival à de roadmap do `CLAUDE.md`. Ver Conflito #1 |
| `AGENT.md` (1.037 b, mtime 2026-05-15) | genérico | **não ignorado** | "Foundational Mandates ... **take precedence over general workflows**" (:3); husky intocável, não usar `--no-verify` (:9-12); remete a `docs/AI_GUIDELINES.md` com mesma prioridade (:14-18) | **complementa** | Converge com a tripulação (não burlar gate). **Melhor lugar versionado para uma regra de precedência** — já se arroga esse poder. Nome quase colide com `AGENTS.md` — ver #7 |
| `docs/AI_GUIDELINES.md` (1.635 b, mtime 2026-05-15) | genérico | **não ignorado** | "must be read and respected by all AI agents" (:39); não remover husky/`.husky/` (:9-10); não usar `--no-verify` sem humano (:11); `flutter pub add` para dependência (:30); **todo bugfix/feature acompanhado de teste** (:35); não remover teste sem justificativa (:36); pre-commit roda `dart format .` (:21) | **complementa** + **conflita (pontual)** | A regra de teste obrigatório é casa e vale. O `dart format .` colide com `CLAUDE.md` — Conflito #3 |
| `QUALITY_WIKI.md` (1.881 b, mtime 2026-05-15) | — | **não ignorado** | Pipeline husky/Docker/Jenkins; "**warnings são permitidos por enquanto**" (:28); orienta `dart format .` (:45) | **conflita (pontual)** | Piso mais baixo que o manifesto do `CLAUDE.md`. Ver Conflitos #2 e #3 |
| `.husky/pre-commit` (1.569 b) | Husky (git hook) | **não ignorado** | Docker `quality-gate` primeiro (:11-18); fallback nativo: `flutter pub get` (:28) → `flutter analyze --no-fatal-warnings --no-fatal-infos` (:32) → `semgrep scan --config=auto --error` excl. `ios/`,`android/`,`lib/firebase_options.dart` (:37) → **`flutter test` completo** (:44). **Não roda `dart format`** | **conflita (pontual)** + **complementa** | Semgrep (SAST) é cobertura que a tripulação **não** tem → agregar. Severidade frouxa → não rebaixar |
| `.specforce/config.yaml` | Specforce | **não ignorado** | Hooks que **bloqueiam transição de estado** (:35-43); instruções de implementação "always run `dart format`" e "clean unused imports" (:21-23); bug-requirements exige RCA (:10-11); archive exige memorial (:27-28) | **conflita** | Terceiro gate no repo, com piso rebaixado. Ver "Hooks e gates" |
| **`.specforce/scripts/all_tasks_check.sh`** | Specforce | **não ignorado** | Verificação **recortada ao diff**: coleta `.dart` alterados vs HEAD + staged (:23-25); `dart format` **mutante** nos alterados (:38); `flutter analyze --no-fatal-infos --no-fatal-warnings` projeto inteiro (:44); `semgrep --config p/default --error` nos alterados (:50-53); **`flutter test` SÓ nos `_test.dart` alterados — e PULA os testes inteiros se nenhum arquivo de teste mudou** (:58-64) | **conflita (grave)** | É a verificação-final do fluxo versionado e **pode sair verde sem executar um único teste**. Ver Conflito #8 — **achado da passada 2** |
| **`.specforce/scripts/phase_check.sh`** | Specforce | **não ignorado** | Igual ao acima **sem etapa de teste**: format + `analyze --no-fatal-*` + semgrep, recortado ao diff (:41-59). Implementação NUL-safe cuidadosa (:22-30) | **conflita (pontual)** | Frouxidão no analyze (#2). Ausência de teste é legítima para "fim de fase" |
| **`.specforce/scripts/format_changed.sh`** | Specforce | **não ignorado** | `dart format` **mutante** só nos `.dart` alterados vs HEAD+staged, NUL-safe (:10-13) | **complementa** | Resolve exatamente a armadilha que o `CLAUDE.md` documenta (`dart format .` varre `build/`/`fonts/`). **Ferramenta da casa a citar durante a execução** |
| `.specforce/docs/governance.md` | Specforce (Constituição) | **não ignorado** | Owner = **Allan Salles**, Major exige aprovação dele (:18); **AI NUNCA comita** (:33); nunca push/PR sem instrução (:34); nunca muda versão do app (:35); nunca modifica `.specforce/docs/` sem aprovação (:32); nunca decisão arquitetural Major / nova dependência sem aprovação (:37); **Conflict Resolution Protocol**: recusar, citar o documento violado, propor alternativa, aguardar aprovação (:39-43) | **complementa (forte)** | **Reforça a tripulação**: proibição de commit idêntica; a proibição de dependência nova espelha a regra de dossiê do `CLAUDE.md`. O protocolo de recusa-e-cita é **mais explícito** que "para e escala ao dev" — vale adotar a forma dele |
| `.specforce/docs/{principles,architecture,ui-ux,security,engineering,memorial}.md` | Specforce (Constituição) | **não ignorado** | Normativos de leitura obrigatória segundo `AGENTS.md:29-35`. **Não lidos** — teto | **complementa (presumido, não verificado)** | `engineering.md` (padrões de código + estratégia de teste) é a **lacuna mais cara** desta ficha |
| `.specforce/archive/` (8 specs, 24 arquivos, todas 2026-05) + `.specforce/memorial/` (3 arquivos) | Specforce | **não ignorado** | Specs encerradas + memorial de lições | **ignorar** (como doutrina) | Histórico, não norma. Mas é **prova de que o fluxo Specforce rodou 8 vezes de verdade** |
| `GEMINI.md` (18.086 b, mtime 2026-06-18) | Gemini CLI | **IGNORADO** (`.gitignore:71`) | Guia de projeto para Gemini (**não lido** — teto) | **ignorar** (provisório) | Gitignorado e 2 meses mais velho que o `CLAUDE.md`; provável irmão estagnado. 18 KB é tamanho de doutrina completa — confirmar com o dev |
| `.gemini/skills/status_and_steps/SKILL.md` (15.121 b) | Gemini CLI | **IGNORADO** (`.gitignore:73`) | Skill "status and steps" (não lido) | **ignorar** (provisório) | Quase-gêmeo de `.claude/commands/status-steps.md` (14.895 b) |
| `.windsurf/rules/doc-flutter.md` | Windsurf | **não ignorado** | Regra **manual** (`trigger: manual`, :2): gerar doc comments `///` **em inglês**, Effective Dart, sem alterar código (:7-13) | **ignorar** (com ressalva) | Trigger manual, então não contamina sessões. Mas **conflita** com `CLAUDE.md` em doutrina e idioma — ver #4 |
| `.windsurf/workflows/documenting-this-flutter-file.md` | Windsurf | **não ignorado** | Workflow de documentação (não lido) | **ignorar** | Mesmo motivo |
| `quality/Dockerfile` + `quality/entrypoint.sh` + `docker-compose.yml` | Docker/Jenkins | **não ignorado** | Replica o gate de qualidade do CI; é o que o pre-commit tenta **primeiro** | **complementa** | Não é aparelho de IA, mas define o gate real quando há Docker. Conteúdo não lido |
| `.vscode/settings.json` (51 b) | VS Code | `.vscode/` **comentado** no `.gitignore:22`; só `launch.json` ignorado (:59) | não lido (teto) | **ignorar** | 51 bytes, improvável ser normativo de IA |
| `status_and_steps/` (raiz) | — | **não ignorado** | Diretório **vazio** | **ignorar** | Sem arquivos |
| `.github/`, `.cursor/`, `.cursorrules` | Copilot / Cursor | — | **NÃO ENCONTRADO** — `ls -la` da raiz confirmou ausência | — | Não há `copilot-instructions.md` nem regra de Cursor |

---

## Conflitos

| # | Artefato | Conflita com | Natureza | Precedência proposta |
|---|---|---|---|---|
| **1** | `AGENTS.md:21-26` — "**CRITICAL: DIRECT EDIT PROHIBITION**": proibido mutar código sem spec aprovada (`requirements.md`+`design.md`+`tasks.md`); `AGENTS.md:15-19` manda **auto-ativar** `spf.*` sem o usuário pedir | Doutrina de roadmap do `CLAUDE.md`: unidade de trabalho é `docs/roadmap/<tema>/NN-slug/{brief,quality}.md` + Skill `roadmap-driven-development` | **Doutrinário e estrutural.** Duas máquinas de planejamento incompatíveis no mesmo repo. Pior sintoma: uma sessão que leia `AGENTS.md` **se recusa a implementar** um item de roadmap, ou sequestra a sessão para `/spf:spec` | **`CLAUDE.md` vence para sessões da tripulação.** Evidência de que o roadmap é a doutrina viva: é o artefato mais novo (2026-08-19 17:37), lista 7 roadmaps ativos, e as specs do Specforce estão **todas arquivadas desde 2026-05**. Proposta de conciliação: declarar que `brief.md`+`quality.md` **satisfaz** a exigência de "approved specification" (:24), porque cumpre o mesmo fim com piso **igual ou mais alto** (o `quality.md` é imutável, comitado antes, e forjá-lo é achado crítico). ⚠️ `AGENTS.md` foi tocado em 2026-08-19 14:15, **3 h antes** do `CLAUDE.md` — **pergunta obrigatória ao dev** |
| **2** | `.husky/pre-commit:32` · `.specforce/config.yaml:39` · `all_tasks_check.sh:44` · `phase_check.sh:49` — todos `flutter analyze --no-fatal-infos --no-fatal-warnings` · `QUALITY_WIKI.md:28` "warnings são permitidos por enquanto" | Manifesto do `CLAUDE.md`: `fvm flutter analyze --fatal-infos --fatal-warnings` | **Piso de severidade divergente.** A casa tolera warning/info; o manifesto da tripulação reprova. Um warning novo passa nos **quatro** gates versionados e **reprova** no `coder-reviewer` | **O manifesto vence — o piso nunca desce.** Regra do papel: em composição agrega-se rigor, nunca se desconta. Não exige alterar nenhum arquivo versionado: a tripulação roda um comando **mais estrito além** do que a casa roda. O pre-commit frouxo continua existindo para o commit manual do dev. ⚠️ **Decisão do dev** — implica reprovar entrega que o gate do time aprovaria |
| **3** | `docs/AI_GUIDELINES.md:21` e `QUALITY_WIKI.md:45` mandam `dart format .` (raiz) | (a) `CLAUDE.md`: `dart format .` **quebra** (varre `build/`) e formataria `fonts/` vendorado — usar `lib test`; (b) o próprio `.husky/pre-commit` **não roda `dart format` em linha nenhuma** | **Casa contra casa, e a instrução antiga está factualmente errada e é destrutiva.** Os dois frouxos são de 2026-05-15; o correto é de 2026-08-19. E o guia descreve um passo que o hook nem executa | **`CLAUDE.md` vence.** Ordem de preferência: `bash .specforce/scripts/format_changed.sh` (recorte ao diff, **já versionado e seguro**) → `fvm dart format --output=none --set-exit-if-changed lib test` (checagem não-mutante). **Nunca `dart format .`**. Corrigir `AI_GUIDELINES.md:21` e `QUALITY_WIKI.md:45` é mudança em arquivo **versionado** — decisão exclusiva do dev |
| **4** | `.windsurf/rules/doc-flutter.md:7-13` — gerar docstring para tudo, inclusive privado, **em inglês** | `CLAUDE.md`: "**Não adicionar** comentários, docstrings ou type annotations em código não alterado"; e comentários/docstrings em **pt-BR** | **Doutrinário e de idioma**, duplo | **`CLAUDE.md` vence.** A regra é `trigger: manual` (:2) — só roda se um humano invocar, então não contamina sessões da tripulação. Classificada **ignorar**, não como precedência a arbitrar. ⚠️ Mas é o único aparelho **versionado** que prega o oposto: outro dev pode segui-lo de boa-fé |
| **5** | `.claude/settings.local.json:7` — allowlist `Bash(git *)` | `CLAUDE.md` "A SESSÃO NÃO RODA `git add`/`commit`/`push`" + memória "Sem operações git" | **Aparente, não real.** A allowlist só dispensa o prompt; quem **bloqueia** é o hook PreToolUse | Manter. Mas registrar: **se o `.exe` do gate sumir, os hooks falham abertos** (`INSTALL.md:42-43`) e aí `git *` fica liberado **sem rede de proteção nenhuma**. O sintoma é "nada bloqueia", não "erro" |
| **6** | `.claude/retornos/` com dois layouts: plano (`coder-reviewer.json`) e por item (`checklist-integridade-couchdb/delivery-inspector.json`) | `CLAUDE.md`: retornos do formato novo ficam em `docs/roadmap/<tema>/NN-<slug>/retornos/` | **Três caminhos para a mesma coisa.** Risco real: o inspetor ler retorno velho de outra unidade | **Um só caminho, por item: o do `CLAUDE.md`**, porque fica junto do `quality.md` que julga. Os `.json` soltos em `.claude/retornos/` são resíduo do formato legado — **não os toquei** (só leitura) |
| **7** | `AGENT.md` (singular) vs `AGENTS.md` (plural), ambos na raiz, ambos normativos, conteúdos distintos | entre si | **Armadilha de leitura, humana e de agente.** Um caractere separa "mandatos de husky" de "protocolo SDD" | Pedir ao dev a fusão ou renomeação. **Não é ação minha** — ambos são versionados |
| **8** ⭐ | `all_tasks_check.sh:58-64` — `flutter test` roda **apenas nos `_test.dart` alterados**, e se nenhum mudou o script **imprime "⚠ Pulando testes unitários" e sai 0** | Manifesto do `CLAUDE.md`: `fvm flutter test` (suíte inteira, ~400 testes) | **Rigor / detecção de regressão — o conflito mais grave desta ficha.** Alterar `lib/` sem tocar em teste nenhum faz a verificação-final do Specforce sair **verde sem executar um único teste**. Regressão em teste existente passa invisível. Atenuante: `.husky/pre-commit:44` roda a suíte completa — mas **no commit**, e **a sessão nunca comita**. Logo, para a tripulação, o buraco fica aberto | **A suíte inteira vence.** Recorte ao diff é legítimo como *feedback rápido durante* a tarefa; **não** como *verificação de entrega*. ⚠️ **Decisão do dev** — é o item que mais muda o custo por rodada (~60 s quentes, segundo o `CLAUDE.md`). **Achado da passada 2** |
| **9** | Todos os scripts versionados invocam **`flutter`/`dart` nus**: `.husky/pre-commit:25,28,32,44`; `all_tasks_check.sh:12,38,44,69`; `phase_check.sh:12,43,49`; `format_changed.sh:13` | `CLAUDE.md` (aviso de topo) + memória `fvm-symlink-nao-segue-branch`: **sempre `fvm flutter`/`fvm dart`**, o projeto tem `.fvmrc` | **Versão de SDK.** O `flutter` do PATH pode não ser o do `.fvmrc`. A memória do dev registra que o symlink `.fvm/flutter_sdk` **já ficou na versão do branch anterior** — isso já mordeu. Resultado: dois SDKs diferentes verificando o mesmo código | **`fvm` vence para tudo que a tripulação roda.** A tripulação **não altera** os scripts versionados (são da casa); apenas executa o manifesto com prefixo `fvm`. Corrigir os 4 scripts é commit próprio do dev. ⚠️ Conflito **pré-existente entre artefatos da casa** — não foi criado pela tripulação |

---

## Colisões de nome

⚠️ **Esta é a colisão mais séria do levantamento, e ela já está materializada no disco.**

| Nome do projeto | Papel da tripulação | Renomear qual? |
|---|---|---|
| `~/.claude/agents/coder-reviewer.md` (14.797 b) | `coder-reviewer` | **Nenhum — são o mesmo artefato.** Ver análise abaixo |
| `~/.claude/agents/delivery-inspector.md` (11.923 b) | `delivery-inspector` | idem |
| `~/.claude/agents/software-engineer.md` (8.060 b) | `software-engineer` | idem |
| `~/.claude/agents/harness-scout.md` (5.207 b) | `harness-scout` (este papel) | idem |
| `AGENTS.md` (Specforce) — "AI Agent Collaboration Guide" | conceito de "agentes" da tripulação | **O pacote não usa esse arquivo.** Risco é de leitura humana, não de resolução |
| `spf.discovery` / `spf.spec` / `spf.constitution` / `spf.implement` / `spf.archive` (`AGENTS.md:9-13`) | — | **Sem colisão** — o namespace `spf.` isola bem. A briga com o Specforce é de doutrina (#1), não de nome |
| `quality.md` (régua imutável do item) | — | **Colide com o diretório `quality/`** (Dockerfile do quality-gate) e com o termo "Quality Gate" do husky/`AI_GUIDELINES.md`. Três coisas diferentes chamadas "quality" no mesmo repo. Sem renomeação — mas **sempre citar com caminho completo** |

**O que de fato aconteceu aqui — e por que não é a colisão que o item previa:**

1. Os quatro agentes **não estão no projeto**: `.claude/agents/` **não existe** (`ls -la .claude/`
   lista apenas `INSTALL.md`, `bin/`, `commands/`, `current-item.md`, `retornos/`,
   `review-state.json`, `scheduled_tasks.lock`, `settings.json`, `settings.local.json`, `tool/`).
   Eles estão em `~/.claude/agents/`, **nível usuário**, mtime `2026-09-14 00:37` — hoje.
2. `.claude/INSTALL.md:13` ainda declara `Agentes | .claude/agents/*.md`. **A documentação de
   backup está desatualizada em relação ao disco.** Quem restaurar o bundle seguindo o INSTALL em
   outra máquina copia `.claude/` e **não leva agente nenhum**.
3. Consequência que importa: os nomes não colidem entre "agente do projeto" e "papel da
   tripulação" — **eles se resolvem para o mesmo arquivo**, e esse arquivo é **global a todos os
   projetos deste dev**.

**Desfecho proposto — o risco inverte de direção.** O perigo não é o projeto e o pacote brigarem
por um nome; é o pacote, ao instalar `metodo/papeis/*` como `~/.claude/agents/<mesmo-nome>.md`,
**sobrescrever silenciosamente** as definições que este projeto usa em produção (6 retornos JSON
reais provam o uso). Duas saídas, e **a escolha é do dev**:

- **(A) Confirmar que são o mesmo artefato** — se os 4 arquivos já são a tripulação do pacote
  instalada globalmente, não há nada a renomear; basta o pacote nunca sobrescrever sem diff explícito.
- **(B) Se divergirem** — o **pacote** renomeia (ex.: prefixo `crew-`), nunca o projeto. Viés
  obrigatório: a convenção da casa ganha, e a casa aqui é o `CLAUDE.md`, que cita os três nomes em
  prosa normativa e cuja tripulação já roda.

Ressalva honesta: **não abri nenhum dos 4 arquivos de agente** (fora da fatia e do teto), então
**não posso afirmar se a doutrina deles coincide com a do pacote** — só que os nomes e o local coincidem.

---

## Hooks e gates já instalados

**Este projeto tem TRÊS camadas de interceptação independentes.** Instalar o gate do pacote
criaria uma quarta — o pior desfecho que esta fatia existe para evitar.

### Camada 1 — Hooks do Claude Code (a única que intercepta o assistente)

Fonte: `.claude/settings.json`.

| Evento | Matcher | Comando | Timeout | O que bloqueia |
|---|---|---|---|---|
| `PreToolUse` | `Bash\|PowerShell` | `"$CLAUDE_PROJECT_DIR"/.claude/bin/review_pipeline.exe gate` | 10 s | Operações git de escrita (`add`/`commit`/`push`) — **sempre**, segundo `CLAUDE.md` |
| `Stop` | (todos) | `"$CLAUDE_PROJECT_DIR"/.claude/bin/review_pipeline.exe check` | 60 s | O **fim do turno**, sem os dois vereditos frescos (delivery + review) |

Binário `.claude/bin/review_pipeline.exe` (6,4 MB, compilado 2026-08-03, ~60 ms/chamada). Fonte
`.claude/tool/review_pipeline.dart` (22.255 b). Estado `.claude/review-state.json` (567 b).

Propriedades relevantes (de `CLAUDE.md`, em contexto — **não reli o `.dart`**): `set review
approved` **roda o manifesto ele mesmo** e recusa registro se vermelho; `delivery` prende à
unidade+HEAD, `review` prende ao codeHash exato; dispensa doc-only para `*.md`, `docs/**`,
`.claude/**`, `.gitignore`; bypass só via `REVIEW_GATE_BYPASS=1` no ambiente que lança a sessão.

⚠️ **Modo de falha documentado:** sem o `.exe`, os hooks **falham abertos** — sem gate nenhum
(`.claude/INSTALL.md:42-43`). Combinado com `Bash(git *)` na allowlist (`settings.local.json:7`),
a ausência do binário deixa git totalmente livre.

### Camada 2 — Husky pre-commit (intercepta o commit humano)

Fonte: `.husky/pre-commit`. Dispara em `git commit`; **irrelevante para a sessão, que não comita**.

1. Tenta `docker compose run --rm quality-gate` (:13); se falhar, cai para nativo (:17).
2. Nativo: `flutter pub get` (:28) → `flutter analyze --no-fatal-warnings --no-fatal-infos` (:32)
   → `semgrep scan --config=auto --error` excluindo `ios/`, `android/`, `lib/firebase_options.dart`
   (:37) → **`flutter test` completo** (:44).
3. Semgrep é **pulado em silêncio** se não estiver instalado (:38-40).
4. Chama `flutter` **sem `fvm`** (:25,28,32,44) — Conflito #9.

**Cobertura que a tripulação não tem: SAST (semgrep).** Tratar como **complementa**, e avisar ao
dev que o `coder-reviewer` não substitui essa varredura.

⚠️ **Consequência estrutural:** como a sessão nunca comita, **o único lugar onde a suíte completa
de testes roda automaticamente está fora do alcance da tripulação**. É isso que torna o Conflito
#8 material, e não teórico.

### Camada 3 — Hooks do Specforce (intercepta transição de estado do fluxo `/spf:*`)

Fonte: `.specforce/config.yaml:35-43`. `AGENTS.md:52`: "If a hook fails, the state transition
will be blocked."

| Evento | Comando | O que de fato roda |
|---|---|---|
| `on_task_finished` | `bash .specforce/scripts/format_changed.sh` + `flutter analyze --no-fatal-infos --no-fatal-warnings` | format mutante no diff + analyze frouxo |
| `on_phase_finished` | `bash .specforce/scripts/phase_check.sh` | format + analyze frouxo + semgrep, **sem teste** |
| `on_all_tasks_finished` | `bash .specforce/scripts/all_tasks_check.sh` | format + analyze frouxo + semgrep + **teste só dos `_test.dart` alterados, ou nenhum** |

Os três dependem de `git`, `dart`, `flutter` e `semgrep` no PATH e **abortam se faltar qualquer um**
(`all_tasks_check.sh:12-17`, `phase_check.sh:12-17`). Só disparam dentro do fluxo `/spf:*`; como a
tripulação não usa `/spf:*`, **na prática estão dormentes** — mas são gate real, versionado, e com
piso rebaixado. Se o dev retomar o Specforce, os Conflitos #2 e #8 saem do papel imediatamente.

### Recomendação sobre o gate do pacote

**NÃO instalar.** O gate do projeto já cobre o mesmo terreno (bloqueio de git, exigência de dois
vereditos frescos, verificação do manifesto sem acreditar em auto-relato) e está em uso comprovado.
Dois `PreToolUse` no mesmo matcher `Bash` = dois vereditos podendo discordar, com o dev sem saber
qual falou. Pior: `settings.json` tem um **único** objeto `hooks` — escrever por cima **apaga** o
gate atual, e a falha é **silenciosa e aberta**.

Se o pacote precisar de estado próprio, o caminho é **ensinar o pacote a chamar
`review_pipeline.exe`**, não empilhar um segundo binário. Em qualquer cenário: **backup de
`.claude/settings.json` antes de tocar**.

### Revisor no lado do servidor (bot de PR)

**NÃO ENCONTRADO — procurei em:** `.github/` (ausente, confirmado por `ls -la` da raiz), raiz do
projeto (sem `Jenkinsfile`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `.circleci/`). Há menção a um
pipeline **Jenkins** em `QUALITY_WIKI.md:40` e no `CLAUDE.md`, mas **a configuração dele não está
neste repositório** — deve viver no servidor. Se esse Jenkins já roda análise no PR, parte do
trabalho do `coder-reviewer` pode estar sendo repetido. **Pergunta ao dev.**

---

## Onde o ponteiro do pacote deve ser colado

**Alvo único: `CLAUDE.md` na raiz** (gitignorado, `.gitignore:70`).

Por quê:

1. **É o documento que o harness de fato carrega** — chegou sozinho no contexto das duas passadas,
   sem ninguém abrir. Nenhum outro candidato tem essa propriedade.
2. **É o mais novo** (2026-08-19 17:37) e o único que já descreve a tripulação.
3. **É gitignorado**, o que preserva a decisão explícita de pegada zero (`CLAUDE.md` +
   `INSTALL.md:3`): nenhum outro dev do repositório vê o aparelho do método.
4. Foi informado a esta fatia que **o dev não faz mais parte da empresa que mantém o repositório**
   — o que torna qualquer alteração versionada uma decisão de custo e legitimidade, não uma
   escolha técnica. (Premissa recebida do despacho, não verificada em arquivo.)

**Onde NÃO colar:**

- ❌ `AGENTS.md` — é **gerido pelo Specforce**, cercado por `<!-- SPECFORCE_AGENTS_START -->` (:1)
  / `<!-- SPECFORCE_AGENTS_END -->` (:64) e pelo aviso "Do not edit inside these markers" (:63).
  Texto colado **dentro** dos marcadores é perdido na próxima sincronização. *(Existe uma costura
  tecnicamente segura — **abaixo da linha 64**, fora dos marcadores — mas o arquivo é versionado,
  então continua vetado pela regra de pegada zero. Só vale se o dev decidir passar o método ao time.)*
- ❌ `AGENT.md`, `docs/AI_GUIDELINES.md`, `QUALITY_WIKI.md` — **não ignorados pelo `.gitignore`**;
  colar ali vaza o método para o repositório da empresa.
- ❌ `GEMINI.md` / `.gemini/` — outra ferramenta, artefato estagnado (2026-06-18).
- ❌ `.windsurf/` — versionado e de trigger manual.

**Se — e só se — o dev decidir que o time herda o método**, dois toques versionados, em commit
próprio dele: (1) 3 linhas em `AGENTS.md` **abaixo da linha 64**, apontando o pacote; (2) uma linha
de **precedência explícita** em `AGENT.md` resolvendo os Conflitos #1, #2 e #8 — é o arquivo que já
se declara precedente sobre workflows gerais (:3).

**Ajuste que o dev pode querer fazer junto (não fiz nada):** `.claude/INSTALL.md:13` precisa
refletir que os agentes moraram para `~/.claude/agents/`, senão o procedimento de backup
documentado perde os quatro agentes.

---

## Não coberto

- **`.specforce/docs/engineering.md`** — **a lacuna mais cara.** `AGENTS.md:34` diz que contém
  "coding standards, testing strategy, and refactoring guidelines". É a **convenção de teste da
  casa, versionada**, e o viés do item manda que ela vença sobre a do método. Sem lê-la, os
  Conflitos #2 e #8 estão sendo arbitrados com meio quadro.
- **`.specforce/docs/security.md`** — importa porque o piso de severidade da tripulação tem "área
  sensível" (auth/sessão, SQLite, permissões, FCM); o documento pode definir outra lista.
- **`.specforce/docs/{principles,architecture,ui-ux}.md`** + `memorial/ROUTING.md` — resto da
  Constituição de leitura obrigatória (`AGENTS.md:29-35`). O memorial pode duplicar
  `docs/historico-correcoes/` (memória do dev).
- **`GEMINI.md` (18.086 b)** — não lido nas duas passadas. Vale abrir: é guia de projeto inteiro
  para outra ferramenta e pode conter diretriz conflitante (arquitetura, testes, idioma).
  Classifiquei **ignorar** só por ser gitignorado e 2 meses mais velho — **isso é inferência de
  metadado, não de conteúdo**.
- **`.claude/tool/review_pipeline.dart` (22.255 b)** — não lido. O comportamento veio do
  `CLAUDE.md`. Vale abrir para confirmar **exatamente** o que o `gate` casa como "operação git"
  (regex? lista?) e se algum nome de agente está hardcoded — isso decide se renomear um agente
  quebraria o gate.
- **`.claude/commands/status-steps.md` (14.895 b)** e **`.gemini/skills/status_and_steps/SKILL.md`
  (15.121 b)** — quase-gêmeos (~226 b de diferença): workflow duplicado em duas ferramentas. Vale
  abrir para saber se prescrevem processo que compete com o roadmap.
- **`~/.claude/agents/*.md`** (4 arquivos, ~40 KB) — deliberadamente não abertos: fora da fatia.
  Sem isso **não dá para afirmar se a doutrina deles bate com a do pacote** — só que os nomes batem.
- **`~/.claude/settings.json` e `~/.claude/settings.local.json`** (nível usuário) — podem conter
  **hooks globais** que se somam aos do projeto. Vale abrir **antes de instalar qualquer gate**.
- **`quality/Dockerfile` + `quality/entrypoint.sh` + `docker-compose.yml`** — definição real do
  `quality-gate` que o husky tenta **primeiro**. Pode ser mais ou menos estrito que o fallback
  nativo, e ninguém sabe qual dos dois de fato roda na máquina do dev.
- **`.windsurf/workflows/documenting-this-flutter-file.md`** — não lido; só a `rules/` foi.
- **Rastreamento efetivo no git** — sei quais caminhos o `.gitignore` alcança, mas não quais
  arquivos estão de fato *tracked*, nem se algum ignorado foi commitado antes da regra.
  **NÃO ENCONTRADO — a fonte exigiria comando git, proibido nesta execução.**
- **Configuração de CI/PR no servidor (Jenkins)** — **NÃO ENCONTRADO — a fonte exigiria comando
  git (remotes) ou acesso ao servidor, proibido/indisponível nesta execução.**
- **`.gitattributes`, `.vscode/settings.json`, `.idea/`** — não abertos; baixa probabilidade de
  serem normativos de IA.

---

## Perguntas ao dev

1. **Specforce está vivo ou morto?** `AGENTS.md` manda, em maiúsculas, **não editar código sem
   spec aprovada** — o que proíbe literalmente o modo de trabalho por roadmap. As specs estão todas
   arquivadas desde maio/2026, mas `AGENTS.md` e `.specforce/` têm mtime de 19/08. Se estiver morto,
   a tripulação precisa de precedência **escrita** no `CLAUDE.md`, senão uma sessão futura vai ler
   `AGENTS.md` e se recusar a implementar. **Alternativa conciliadora:** declarar
   `brief.md`+`quality.md` como "approved specification" equivalente (Conflito #1).
2. **Escopo de teste (Conflito #8) — a pergunta que mais muda o custo por rodada.** Ciente de que
   `all_tasks_check.sh:58-64` **pula os testes inteiros** quando nenhum `_test.dart` mudou, e de
   que o `flutter test` completo só roda no `git commit` (que a sessão nunca executa), confirma
   `fvm flutter test` **completo** como parte do manifesto da tripulação?
3. **O piso de severidade vale mesmo (Conflito #2)?** `QUALITY_WIKI.md:28` diz "warnings são
   permitidos por enquanto" e os **quatro** gates versionados rodam `--no-fatal-*`, enquanto o
   manifesto exige `--fatal-infos --fatal-warnings`. Assumi o mais rigoroso (o piso não desce).
   Confirma, mesmo significando reprovar entrega que o gate do time aprovaria?
4. **Os 4 agentes em `~/.claude/agents/` são a tripulação do pacote, ou uma versão local
   divergente?** Disso depende tudo: se divergirem, instalar o pacote **sobrescreve silenciosamente**
   o aparelho que este projeto usa hoje (6 retornos JSON provam o uso).
5. **`.claude/INSTALL.md:13` deve ser corrigido** para apontar `~/.claude/agents/`? Do jeito que
   está, o backup documentado não leva os agentes.
6. **`AI_GUIDELINES.md:21` e `QUALITY_WIKI.md:45` mandam `dart format .`, que o `CLAUDE.md` diz que
   quebra** — e que o próprio `.husky/pre-commit` nem executa. Quer corrigir os dois arquivos
   versionados, ou fica como está e a tripulação apenas ignora? (Não toquei em nada.)
7. **Scripts versionados usam `flutter` nu, sem `fvm` (Conflito #9)** — e sua memória registra que
   o symlink do fvm já apontou para a versão errada. Dívida conhecida e tolerada, ou vale abrir item
   para prefixar `fvm` em `.husky/pre-commit` e nos 3 scripts do `.specforce`?
8. **Existe bot de revisão no PR, ou o Jenkins já analisa?** Se sim, o `coder-reviewer` pode estar
   repetindo trabalho de graça — a `QUALITY_WIKI.md` sugere que o Jenkins roda o mesmo gate.
9. **`.specforce/docs/governance.md:18` nomeia "Allan Salles" como Owner** e exige aprovação dele
   para decisões Major e para dependência nova. Essa cadeia ainda se aplica, ou quem aprova agora é
   você? Afeta diretamente a regra de "escalar ao dev" da tripulação.
10. **`AGENT.md` vs `AGENTS.md`:** fundir, renomear ou deixar? Um caractere separa dois normativos
    diferentes na mesma pasta.
11. **Windsurf e Gemini ainda são usados por alguém no time?** Se não, `.windsurf/` é o único
    aparelho de IA **versionado** que sobrou e pode induzir outro dev a doutrina contrária à do
    `CLAUDE.md` (docstring em tudo, em inglês).
12. **Adotar o `Conflict Resolution Protocol` do `governance.md:39-43`** (recusar → citar o
    documento e a regra violada → propor alternativa → aguardar aprovação) como forma padrão do
    `software-engineer` escalar? É mais explícito que o "para e escala ao dev" atual, e é a
    convenção da casa.
