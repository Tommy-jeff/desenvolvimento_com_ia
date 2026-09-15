# Ficha — 05. Fronteiras e risco

> Levantado em 2026-09-14 · fontes citadas por linha · teto de leitura: 12 arquivos (12 usados)
> Projeto: `C:\Users\thoma\StudioProjects\veniti_mobile_app` · slug `veniti_mobile_app`
> ⛔ Execução **sem nenhum comando git**. Onde o item sugeria histórico via `git log`, a linha está
> marcada como não encontrada. Os fatos de git abaixo vieram de **leitura de arquivo**
> (`.git/config`, `~/.gitconfig`, `.gitignore`) ou do **contexto** — nunca de invocação de git.

## Já em contexto (não relido)

- `CLAUDE.md` (raiz do projeto) — carregado pelo harness como instrução de projeto. Responde:
  a lista canônica de áreas sensíveis ("Piso de severidade"), a regra de dependência nova,
  a proibição de commit pela sessão, o gate mecânico, o formato de mensagem de commit sugerido,
  a regra doc-only e o manifesto de qualidade.
- `MEMORY.md` (auto-memória do usuário) — responde a política de git: *"Sem operações git — nunca
  git add/commit/push; deixar tudo como modified, commit é do dev"*. Também traz
  "DoD antes dos inspetores" e "API retrocompat, nunca block_version".
- **git status inicial** (fornecido pelo harness, não executado por mim) — branch corrente
  `feat/CU-86ajykxee/migration-misc-endpoints`, branch principal `master`, árvore limpa, e as
  5 mensagens de commit mais recentes (usadas abaixo só como evidência de **formato**).

---

## Áreas sensíveis (MÉDIO bloqueia como ALTO)

A lista canônica é **regra escrita** e aparece em dois lugares independentes — `CLAUDE.md`
("Piso de severidade", seção Tripulação de revisão) e, replicada para dentro de cada item de
roadmap, em `docs/roadmap/endpoints-residuais-v2/_TEMPLATE/quality.md:152-155`:

> *"MÉDIO nelas BLOQUEIA como ALTO: autenticação/sessão · SQLite e migrações · permissões,
> platform channels, foreground service e geolocalização · ações FCM · assinatura/release · o
> próprio pipeline de revisão."*

| Caminho / área | Por quê | Força da evidência | Fonte |
|---|---|---|---|
| **Autenticação e sessão** — `lib/interface/oauth_authentication.dart`, `lib/preferences/`, token em `SharedPreferences` | Token OAuth, ciclo de vida e refresh; um `401` mal tratado desloga o usuário em campo | **MÁXIMA** — regra escrita **+** incidente registrado **+** densidade de teste. As três evidências, coincidentes | `CLAUDE.md` (contexto) · `_TEMPLATE/quality.md:152-155` · `.specforce/docs/security.md:5-6` (documento **comitado**) · incidente: `docs/historico-correcoes/2026-08-17-401-do-token-desloga-durante-login.md` |
| **SQLite e migrações** — `lib/database/helper/`, `lib/database/model/` | Schema na versão 98 com migrações desde a 65; escrita/migração destrutiva corrompe dado local do prestador | **ALTA** — regra escrita **+** incidente de parse de modelo | `CLAUDE.md` (contexto, "Schema version atual: 98") · `_TEMPLATE/quality.md:152-155` · `.specforce/docs/security.md:32` (queries parametrizadas obrigatórias, concatenação de SQL raw "estritamente proibida") · incidente: `docs/historico-correcoes/2026-07-08-checklist-file-external-id-int-cast.md` |
| **Permissões, platform channels, foreground service e geolocalização** — `lib/foreground_task/`, `lib/workers/` | Rastreamento em background é a função central do app em campo | **ALTA por regra escrita**, mas **sem incidente registrado e com densidade de teste baixa**: não há diretório `test/foreground_task` nem `test/workers` na varredura de `test/**/*_test.dart` | `CLAUDE.md` (contexto) · `_TEMPLATE/quality.md:152-155` · ausência de testes: varredura `find test -name "*_test.dart"` (58 arquivos, nenhum nessas pastas) |
| **Ações FCM** — `SYNC_TASKS`, `SYNC_LOGOUT`, `SYNC_CANCEL`, `SYNC_LOCATION` | `SYNC_LOGOUT` derruba sessão remotamente; as ações cruzam push → estado do app | **ALTA por regra escrita**; sem incidente registrado | `CLAUDE.md` (contexto) · `_TEMPLATE/quality.md:152-155` |
| **Assinatura e release** — `pubspec.yaml` (versão), `shorebird.yaml`, `android/`, `ios/` | Distribuição OTA por Shorebird: um patch errado sai sem passar pela store. A versão do app é decisão humana explícita | **MÁXIMA** — regra escrita em **duas** fontes independentes, uma delas comitada | `CLAUDE.md` (contexto) · `_TEMPLATE/quality.md:152-155` · `.specforce/docs/governance.md:35` — *"O AI NUNCA deve alterar a versão do app (`pubspec.yaml`) autonomamente"* · `pubspec.yaml:18` (`version: 1.26.0+153`) |
| **O próprio pipeline de revisão** — `.claude/tool/review_pipeline.dart`, `.claude/bin/review_pipeline.exe`, `.claude/settings.json` | Quebrar o gate desliga silenciosamente toda a verificação: `CLAUDE.md` diz que sem o `.exe` "os hooks falham **abertos** (sem gate)" | **ALTA por regra escrita**; corroborada pela configuração real dos hooks | `CLAUDE.md` (contexto) · `.claude/settings.json:1-29` (hooks `PreToolUse`/`Stop` apontam para o `.exe`) |
| **`lib/interface/` — camada de clientes de API** (22 arquivos) | Não está na lista canônica por nome, mas é onde 6 dos 7 roadmaps ativos trabalham, e os `quality.md` por item a nomeiam repetidamente como a área sensível **daquele** item | **MÉDIA-ALTA por densidade de teste** (a mais alta do repositório, muito acima da média) **+** regra escrita por item | Densidade: `test/interface` tem **17** arquivos de teste para **22** arquivos em `lib/interface` (≈0,77), contra `lib/ui` com 138 arquivos e ≈15 testes (≈0,11) — `find`/`uniq -c` · regra por item: `02-search-users/quality.md:151`, `04-alerts/quality.md:161`, `05-mobile-version/quality.md:140` |
| **Flags de rollback** — `lib/utils/const.dart` | São o único mecanismo de reversão das migrações v1→v2 (rollback = flipar a constante + patch Shorebird); precisam voltar a `true` ao fim | **ALTA** — regra escrita em item de roadmap | `docs/roadmap/endpoints-residuais-v2/06-verificacao-e2e/quality.md:130` · `README.md:38` (decisão travada) |
| **Segredos e `.env`** — `.env`, `lib/firebase_options.dart` | `.env` existe na raiz e é ignorado pelo git; a proibição de commitá-lo é regra escrita comitada | **ALTA** — regra escrita **+** confirmação mecânica no `.gitignore` | `.specforce/docs/security.md:16` — *"O arquivo `.env` NUNCA deve ser comitado"* · `.gitignore:68` (`/.env`) |
| **Tela de despacho** — `lib/ui/tasks/widgets/professional_list.dart` | Declarada "a mais sensível do app" — é onde o master escolhe a quem despachar um serviço | **ALTA** — regra escrita, específica de item | `docs/roadmap/endpoints-residuais-v2/03-search-professionals-distancia/brief.md:25` e `quality.md:171` |

**Não são área sensível por evidência, só por impressão minha** (portanto viram pergunta ao dev,
não linha da tabela): chat/WebSocket e upload de mídia. Ambos têm incidentes registrados
(`2026-07-20-websocket-chat-nao-recebe-eventos.md`, `2026-07-23-websocket-sem-reinscricao-apos-reconexao.md`,
`2026-07-24-content-type-upload-checklist.md`), o que é a **segunda** evidência mais forte — mas
nenhuma regra escrita os inclui no piso de severidade. Ver Perguntas ao dev.

---

## Fronteiras humanas

| Caminho / área | Quem aprova | Fonte |
|---|---|---|
| **Decisões constitucionais Major** (trocar state management, mudar protocolo de autenticação, alterar a estrutura de camadas) | **Allan Salles** — nomeado *"Lead Engineer e proprietário do produto Veniti Prestador"*. É o único **dono humano nomeado** em arquivo **comitado** no repositório | `.specforce/docs/governance.md:18` |
| **`.specforce/docs/**`** (principles, architecture, ui-ux, security, engineering, governance) | Owner, explicitamente: *"O AI NUNCA deve modificar qualquer arquivo em `.specforce/docs/` sem aprovação explícita do Owner — toda modificação constitucional é uma ação humana"* | `.specforce/docs/governance.md:32` |
| **Dependência nova** e **elemento visual/tela nova** | **o dev que despacha a sessão** — exige dossiê + aprovação explícita; sem isso é achado **crítico automático** | `CLAUDE.md` (contexto) · `_TEMPLATE/quality.md:90-95` · `docs/roadmap/endpoints-residuais-v2/README.md:138-140` |
| **Decisões travadas dos roadmaps** | **o dev.** Os 7 READMEs de roadmap repetem a mesma cláusula: *"Não re-decidir decisões travadas — se houver motivo, parar, perguntar ao dev e registrar na tabela"* | `atendimento-ciclo-vida-v2/README.md:155` · `checklist-endpoints-v2/README.md:131` · `endpoints-residuais-v2/README.md:47,249` · `fotos-de-usuario/README.md:108` · `login-sessao-v2/README.md:196` · `tratamento-erros-api/README.md:131` · `usuario-telemetria-v2/README.md:305` |
| **`quality.md` de um item de roadmap** | **o dev, em commit próprio, antes da implementação.** Editá-lo de dentro da unidade que ele governa é "forja de contrato" — achado crítico | `CLAUDE.md` (contexto, seção Roadmaps) |
| **Contrato da API (backend / portal)** — `docs/orientacoes_implementacao/*.md` | **Time de backend, terceiro.** O app **não decide** o contrato: a cópia local do handoff está declarada DESATUALIZADA e *"sincronizar depende de receber o arquivo atualizado do repositório da API"*. Há precedente de achados escalados sem tocar código: *"C3 e C4 foram escalados ao portal sem tocar em código (decisão do dev)"* | `endpoints-residuais-v2/README.md:18-29` · `usuario-telemetria-v2/README.md:231` |
| **Criação/alteração de documento normativo** (Skill, README normativo de tema) | **o dev** — *"a criação/alteração de docs normativos exige aprovação do dev (`CLAUDE.md`)"* | `endpoints-residuais-v2/README.md:20` |
| **Commit, push e Pull Request** | **Owner / dev** — ver "Saída do trabalho" | `.specforce/docs/governance.md:33-34` · `CLAUDE.md` (contexto) · `MEMORY.md` (contexto) |

**Arquivo de donos de código (CODEOWNERS): NÃO ENCONTRADO** — procurei com
`find . -maxdepth 3 -iname "CODEOWNERS"`; o único resultado próximo foi `fonts/font_awesome_flutter/.github`,
que é de um pacote **vendorado**, não do projeto. O remoto é Bitbucket
(`git@bitbucket.org:autem_developers/veniti_mobile_app.git`, lido em `.git/config`), onde a
convenção `CODEOWNERS` do GitHub não se aplica. A autoridade humana é declarada em prosa, em
`.specforce/docs/governance.md`, não em arquivo de mecanismo.

**Proteção de branch: NÃO ENCONTRADO** — não é visível no repositório local; seria configuração
do lado do Bitbucket. Procurei em `.git/config`, `.gitignore`, raiz do projeto e `.husky/`.

⚠️ **Tensão que a tripulação precisa saber:** o dono humano nomeado no repositório (Allan Salles,
`.specforce/docs/governance.md:18`) **não é** necessariamente quem despacha as sessões hoje —
ver o fato registrado em "Saída do trabalho". Toda aprovação que a régua manda pedir "ao Owner"
precisa, na prática, ser resolvida **com o dev**. Isso está em Perguntas ao dev.

⚠️ **Dois regimes de governança convivem no disco.** `CLAUDE.md` (método de roadmap + tripulação
de revisão) é **gitignorado** (`.gitignore:70,72`) — é ferramental local, invisível para outros
devs. `AGENTS.md` + `.specforce/**` (protocolo Specforce SDD) **não aparecem no `.gitignore`** e
portanto são **política comitada do projeto**. `CLAUDE.md` não menciona Specforce em lugar nenhum.
Nos pontos que importam a esta fatia **os dois não se contradizem, e a composição é a soma**:

| Ponto | `CLAUDE.md` (local) | Specforce (comitado) | Composição — o piso não desce |
|---|---|---|---|
| Commit pela sessão | proibido, gate mecânico bloqueia sempre | proibido, *"commits são responsabilidade exclusiva do Owner"* (`governance.md:33`) | **proibido** |
| Push / PR | não previsto explicitamente | *"NUNCA push nem PR sem instrução explícita do Owner"* (`governance.md:34`) | **proibido sem instrução explícita** |
| Dependência nova | dossiê + aprovação do dev; crítico automático | proposta revisada e aprovada pelo Owner para decisão arquitetural Major (`governance.md:37`) | **aprovação humana explícita, sempre** |
| Versão do app | não previsto explicitamente | *"NUNCA alterar a versão do app autonomamente"* (`governance.md:35`) | **não alterar** |
| Escrever código | livre dentro do escopo do item | *"STRICTLY FORBIDDEN ... unless a valid, approved specification exists"* (`AGENTS.md:22`) | ver Perguntas ao dev — é o **único ponto de atrito operacional real** entre os dois |

---

## Dependências e licenças

- **Como se adiciona:** **dossiê + aprovação explícita do dev, antes.** Sem isso, é **achado
  crítico automático** — não é observação, é reprovação. O escopo da regra é amplo e está escrito:
  `pubspec.yaml` **incluindo `dev_dependencies` e `dependency_overrides`**, mais **Gradle** e
  **CocoaPods**.
  Fonte: `CLAUDE.md` (contexto) · `_TEMPLATE/quality.md:90-92` e `:127-129` ·
  `docs/roadmap/endpoints-residuais-v2/README.md:138`.
- **Quem aprova:** o **dev** (regra do `CLAUDE.md`). Para troca de biblioteca estruturante
  (state management, cliente HTTP), a régua comitada sobe a alçada para o **Owner**, via proposta
  revisada — `.specforce/docs/governance.md:37`.
- **Como se pede, na prática:** um roadmap registra a decisão na tabela **Decisões travadas** do
  README do tema. Exemplo concreto e vivo: `endpoints-residuais-v2/README.md:46` traz a linha
  `| Dependências novas | **Nenhuma** | dio, http, flutter_test, mocktail já estão no projeto |`,
  e `:59` instrui *"se um item parecer precisar, **pare e pergunte**"*. Precedente análogo para
  elemento visual: o texto "No local" foi aprovado pelo dev e a linha da tabela **vale como o
  dossiê** que o `CLAUDE.md` exige (`README.md:52`).
- **Lista aprovada / registro interno de dependências: NÃO ENCONTRADO** — procurei em
  `QUALITY_WIKI.md` (50 linhas, lido inteiro), `pubspec.yaml` (comentários varridos por grep),
  `.specforce/docs/security.md` e `.specforce/docs/governance.md`, e com
  `grep -rniE "licen(c|ç)a|license|depend(e|ê)ncia nova|aprova(ç|c)"` sobre `QUALITY_WIKI.md`,
  `README.md`, `AGENTS.md` e `docs/**/*.md`. A política é "aprovação caso a caso", não catálogo.
- **Política de licença: NÃO ENCONTRADO** — procurei com
  `find . -maxdepth 3 -iname "LICENSE*"` (único resultado: `fonts/font_awesome_flutter/LICENSE`,
  de pacote **vendorado**), e no `pubspec.yaml`, que traz `publish_to: 'none'` (linha 6, pacote
  privado) e **nenhum campo de licença**. Nenhuma etapa do pipeline audita licença de dependência.
- **Processo de segurança sobre dependência: parcialmente NÃO ENCONTRADO.** O que existe é
  **SAST sobre código próprio**, não auditoria de dependência: `semgrep scan --config=auto --error`
  no pre-commit (`.husky/pre-commit:35-40`), e ele é **condicional** — *"Semgrep not found.
  Skipping SAST scan"* se o binário não estiver instalado (linha 39). Não há `dart pub outdated`,
  `pub audit`, SCA nem verificação de CVE em nenhum dos dois pipelines.

---

## Saída do trabalho

### O fato que governa esta seção

⚠️ **O dev não faz mais parte da empresa que mantém este projeto.** A identidade git local (nome e
e-mail corporativos) foi removida do repositório em **2026-09-14**, e não há identidade global
configurada — ou seja, **um commit aqui falha por falta de identidade**. Na prática, **nada sai
deste repositório**.

Confirmação mecânica, obtida **sem rodar git**, por leitura direta dos arquivos de configuração:

- `.git/config` — tem `[core]`, `[remote "origin"]` e sete blocos `[branch ...]`; **não tem
  `[user]`**.
- `~/.gitconfig` — conteúdo integral: `[core]` / `autocrlf = false`. **Não tem `[user]`**.

Logo, as linhas de "Branch / commit / PR" abaixo descrevem a **convenção histórica do repositório**,
para que a tripulação reconheça o padrão ao ler o código — **não** um caminho que esta sessão, ou
qualquer sessão, vá percorrer.

### Os fatos operacionais

- **Branch:** padrão `<tipo>/<CU-ticket>/<slug-em-inglês>`, com ticket do ClickUp. Observado nos
  blocos `[branch]` de `.git/config`: `feat/CU-86agvd667/checklist-restrictions`,
  `feat/cu-86ahdr2f2/checklist_mandatory`, `feat/CU-86agzmtx0/migration-to-android-17`,
  `fix/version_1_23-1/cancelation_in_ios`. Branches de longa vida: `master` (principal) e `dev`,
  ambos com `remote = origin`. A caixa do prefixo do ticket **varia** (`CU-` e `cu-`) e nem todo
  branch tem ticket.
- **Mensagem de commit:** Conventional Commits, `<tipo>(<escopo>): <descrição>` com descrição em
  **pt-BR**. O `CLAUDE.md` (contexto) manda o relatório final encerrar com uma *"Sugestão de
  mensagem de commit (o dev decide se usa)"* nesse formato; os 5 commits recentes fornecidos pelo
  harness no **contexto** confirmam a prática (ex.: `feat(misc-migration): ...`,
  `fix(user-list): ...`). **Não há `commitlint` nem hook validando o formato** — procurei em
  `.husky/` (só existe `pre-commit`) e na raiz (sem `package.json`, sem `commitlint.config.*`).
- **Exigências de PR: NÃO ENCONTRADO.** Nenhum template de PR no repositório — procurei com
  `find . -maxdepth 3 -iname "*pull_request_template*" -o -iname "CONTRIBUTING*"`. O remoto é
  Bitbucket (`.git/config`), então qualquer exigência viveria no servidor, fora do alcance de uma
  leitura local.
- **Quantas mãos tocam o repositório: NÃO ENCONTRADO — a fonte exigiria comando git, proibido
  nesta execução.**

### Hooks de commit — duas camadas independentes

**(a) Husky `pre-commit`** (`.husky/pre-commit`, 45 linhas) — a camada do **projeto**, comitada.
Tenta primeiro `docker compose run --rm quality-gate` e, se o Docker não estiver disponível ou
falhar, cai para execução nativa (linhas 9-24). No caminho nativo roda, **abortando o commit no
primeiro erro**: `flutter pub get` → `flutter analyze --no-fatal-warnings --no-fatal-infos` →
`semgrep scan --config=auto --error` (pulado se ausente) → `flutter test`.

Dois desencontros entre o documentado e o executado, registrados como fato (não como juízo):

1. `QUALITY_WIKI.md:27` afirma que o hook checa **formatação** (*"Garante que o código segue o
   padrão `dart format`"*). **O script `.husky/pre-commit` não tem etapa de formatação alguma** —
   vai direto de `pub get` para `flutter analyze`.
2. O hook chama `flutter` **puro**; o `CLAUDE.md` e o `.fvmrc` na raiz mandam rodar tudo por
   **`fvm flutter`**. O `PATH` que o hook monta (linha 5) inclui `$HOME/fvm/default/bin`, o que
   sugere resolução por PATH em vez de `fvm`.

**(b) Hooks do Claude Code** (`.claude/settings.json`) — a camada do **método**, gitignorada:

- `PreToolUse`, matcher `Bash|PowerShell` → `.claude/bin/review_pipeline.exe gate` (timeout 10 s):
  bloqueia `git add`/`commit`/`push` **sempre**, mesmo com o gate verde.
- `Stop` → `.claude/bin/review_pipeline.exe check` (timeout 60 s): bloqueia o fim do turno sem os
  dois vereditos frescos (`delivery` + `review`).
- Dispensa doc-only para `*.md`, `docs/**`, `.claude/**`, `.gitignore` (`CLAUDE.md`, contexto).
- ⚠️ Sem o `.exe` compilado, **os hooks falham abertos** — sem gate (`CLAUDE.md`, contexto).

**Composição das duas camadas — o piso não desce.** Elas checam a mesma coisa com rigores
diferentes; vale sempre o mais estrito:

| Checagem | Husky (projeto) | Manifesto do `CLAUDE.md` (método) | Vale |
|---|---|---|---|
| Análise estática | `flutter analyze --no-fatal-warnings --no-fatal-infos` (permissivo; `QUALITY_WIKI.md:28` confirma: *"warnings são permitidos por enquanto"*) | `fvm flutter analyze --fatal-infos --fatal-warnings` | **`--fatal-infos --fatal-warnings`** |
| Formatação | ausente do script | `fvm dart format --output=none --set-exit-if-changed lib test` | **roda, com alvo `lib test`** |
| Alvo do format | `QUALITY_WIKI.md:45` recomenda `dart format .` | `CLAUDE.md` avisa que `dart format .` na raiz **quebra** (varre `build/`) e formataria `fonts/` vendorado | **`lib test`, nunca `.`** |
| Testes | `flutter test` | `fvm flutter test` | **ambos, via fvm** |
| SAST | `semgrep --config=auto --error`, condicional | não previsto | **soma** — semgrep é instrumento do projeto |

- **quem_comita:** **`dev`** — e com cinco fontes convergentes, nenhuma delas ambígua:
  1. **Fato operacional, decisivo:** não há identidade git no repositório nem global (`.git/config`,
     `~/.gitconfig`) — um commit **falha por falta de identidade**. E **o dev não faz mais parte da
     empresa que mantém este projeto**; na prática **nada sai deste repositório**.
  2. **Regra local:** *"A SESSÃO NÃO RODA `git add`, `git commit` NEM `git push` — A ENTREGA TERMINA
     EM RELATÓRIO. O commit é do dev, à mão. Nem 'para facilitar', nem com o gate verde."*
     (`CLAUDE.md`, contexto).
  3. **Mecanismo:** o hook `PreToolUse` bloqueia git **sempre** (`.claude/settings.json:3-15`).
  4. **Regra comitada, do lado do projeto:** *"O AI NUNCA deve fazer commit automático de código no
     repositório — commits são responsabilidade exclusiva do Owner"* (`.specforce/docs/governance.md:33`),
     e o mesmo para push/PR (`:34`).
  5. **Memória do dev:** *"Sem operações git — nunca git add/commit/push; deixar tudo como modified"*
     (`MEMORY.md`, contexto).

---

## Correspondência (para o índice)

| Diretriz | Desfecho | Instrumento | Justificativa |
|---|---|---|---|
| Áreas sensíveis / piso de severidade | **PROJETO** | Lista canônica do `CLAUDE.md`, replicada em cada `quality.md` de item | O projeto já declara exatamente as seis áreas em que MÉDIO bloqueia como ALTO, e ainda exige nomear os **paths concretos** por item (`_TEMPLATE/quality.md:156-158`). Mais específico que qualquer default do método |
| Aprovação de dependência nova | **PROJETO** | Dossiê + aprovação explícita do dev; crítico automático | Escopo mais largo que o usual: inclui `dev_dependencies`, `dependency_overrides`, Gradle e CocoaPods (`_TEMPLATE/quality.md:90-92`) |
| Política de licença de dependência | **NATIVO** | — | Nada no projeto: sem `LICENSE` próprio, `publish_to: 'none'`, sem auditoria de licença no pipeline. O método usa a dele |
| Registro/catálogo de dependências aprovadas | **NATIVO** | — | NÃO ENCONTRADO; a aprovação é caso a caso, por pessoa |
| Donos de código | **PROJETO** | `.specforce/docs/governance.md:18` nomeia o Owner | Não há `CODEOWNERS` (remoto é Bitbucket), mas há dono humano nomeado em arquivo **comitado** — mais forte que o silêncio que o método assumiria |
| Quem comita | **PROJETO** | `dev` + gate mecânico que bloqueia git sempre | O projeto é mais restritivo que o default do método: bloqueio é mecânico, não convencional |
| Hooks de qualidade no commit | **COMPÕE** | Husky `pre-commit` (projeto) **+** manifesto do `CLAUDE.md` (método) | Somam-se; onde divergem no rigor, vale o mais estrito — `--fatal-infos --fatal-warnings` sobre `--no-fatal-warnings`, e o format que o husky não roda. O semgrep do projeto é ganho puro, o método não tem SAST |
| Governança de agente (o que a IA pode fazer sozinha) | **COMPÕE** | `CLAUDE.md` (local) **+** `AGENTS.md`/`.specforce/docs/governance.md` (comitados) | Nos pontos load-bearing os dois coincidem e o piso sobe: nada de commit, push, PR, bump de versão ou dependência sem humano. Ver a tabela de composição em "Fronteiras humanas" |
| Proteção de branch / exigências de PR | **NATIVO** | — | NÃO ENCONTRADO localmente; viveria no Bitbucket. Sem evidência, o método usa o dele |
| Formato de mensagem de commit | **PROJETO** | Conventional Commits, descrição em pt-BR | Convenção observada e prescrita, **sem** hook que a valide — é convenção, não mecanismo |

---

## Não coberto

- **`.specforce/docs/principles.md`, `architecture.md`, `engineering.md`, `ui-ux.md` e
  `memorial/`** — não abertos (teto atingido). São **documentos comitados** e `AGENTS.md:29-36` os
  declara "Constituição" do projeto; `engineering.md` em especial promete *"coding standards,
  testing strategy, and refactoring guidelines"*, que podem conter fronteiras e proibições que esta
  fatia deveria ter listado. **Vale abrir** — é a única política do projeto que está sob controle de
  versão e portanto vale para outros devs, não só para esta máquina.
- **`.claude/INSTALL.md` e `.claude/tool/review_pipeline.dart`** — não abertos. O comportamento do
  gate foi levantado pelos hooks (`settings.json`) e pelo `CLAUDE.md`; os detalhes de frescor,
  `codeHash` e bypass ficaram por conta da descrição em contexto, não de leitura do código.
- **`docs/roadmap/*/README.md` dos outros 6 temas** — li integralmente só as seções de decisões
  travadas e regras normativas do `endpoints-residuais-v2` (o único no formato novo) e varri os
  demais por grep. Cada um tem sua própria tabela de **Decisões travadas** que restringe o que a
  sessão pode re-decidir; quem pegar item de tema legado precisa abrir o README daquele tema.
- **Verificação de `dependency_overrides` no `pubspec.yaml`** — `font_awesome_flutter` aparece nas
  linhas 35 e 111, e há um `fonts/font_awesome_flutter/` **vendorado** na raiz (o `CLAUDE.md` avisa
  que `dart format .` o formataria). **Não confirmei** se a linha 111 é de fato um
  `dependency_overrides` — teto atingido. Importa porque a regra de aprovação cobre
  `dependency_overrides` explicitamente.
- **`docs/AI_GUIDELINES.md`** — não aberto; pelo nome, pode conter fronteiras de agente que
  duplicam ou contradizem `CLAUDE.md` e `AGENTS.md`. Terceiro regime possível.
- **Conteúdo dos 8 registros de `docs/historico-correcoes/`** — usei apenas os **nomes** dos
  arquivos como evidência de incidente por área. Ler os registros daria a causa-raiz, que é o que
  transforma "área com incidente" em "armadilha concreta a evitar".
- **Configuração do Jenkins** — `QUALITY_WIKI.md:40` afirma que o Docker *"simula exatamente o que
  acontece no pipeline de CI (Jenkins)"*, mas não achei `Jenkinsfile` na raiz. O que o CI de verdade
  exige (e portanto bloqueia) não foi verificado; `quality/Dockerfile` e `quality/entrypoint.sh`
  não foram abertos.

---

## Perguntas ao dev

1. **Specforce está vivo ou é sedimento?** `AGENTS.md` e `.specforce/**` são **comitados** (não
   estão no `.gitignore`) e impõem um regime de spec-driven development — inclusive
   `AGENTS.md:22`: *"You are STRICTLY FORBIDDEN from using mutation tools to modify the codebase
   unless a valid, approved specification exists"*. O `CLAUDE.md` não menciona Specforce e opera por
   roadmap. **Um item de roadmap com `quality.md` comitado satisfaz a exigência de "approved
   specification", ou o regime Specforce está morto e deve ser ignorado?** É a única contradição
   operacional real entre as duas réguas.
2. **Allan Salles ainda é a autoridade de aprovação?** `.specforce/docs/governance.md:18` o nomeia
   Owner e exige aprovação dele para decisão Major, commit, push, PR e bump de versão. Dado que
   **o dev não faz mais parte da empresa que mantém este projeto**, presumo que toda aprovação
   dessas passe a ser **sua**. Confirma? Se sim, vale registrar isso em algum lugar, porque a régua
   comitada continua apontando para outra pessoa.
3. **Chat/WebSocket e upload de mídia entram no piso de severidade?** São as duas áreas com
   incidente registrado (três dos oito registros de `historico-correcoes/`) que **nenhuma regra
   escrita** inclui nas áreas sensíveis. Pela minha régua, histórico é a segunda evidência mais
   forte — mas impressão minha não basta e a lista canônica não as cita. Promover a MÉDIO-bloqueia?
4. **O `pre-commit` do husky é para valer, ou o manifesto do `CLAUDE.md` o substituiu na prática?**
   Ele checa menos que o manifesto (analyze permissivo, sem format), chama `flutter` fora do `fvm`,
   e `QUALITY_WIKI.md:27` descreve uma etapa de formatação que **não existe no script**. Se o
   husky está de fato inerte — e sem identidade git nada commita, então ele nunca dispara —, a
   tripulação deve tratá-lo como documentação histórica, não como gate.
5. **Nível de rigor desejado para começar: `observador`, `consultivo` ou `normativo`?** A leitura
   do repositório sugere fortemente **normativo** (gate mecânico que bloqueia fim de turno, piso de
   severidade escrito, quality.md imutável, máximo de 3 rodadas), mas quem decide é você.
6. **Confirma `quem_comita: dev`, com a consequência prática?** Como não há identidade git
   configurada, a entrega termina em relatório e os arquivos ficam **modified** na árvore — nada é
   commitado, nada é empurrado, e o trabalho só persiste enquanto a árvore de trabalho existir.
   Quer algum outro mecanismo de persistência de entrega (patch, diff arquivado), ou está certo
   assim?
7. **Geolocalização e foreground service estão na lista de áreas sensíveis mas praticamente sem
   teste** (nenhum arquivo de teste em `test/workers` ou `test/foreground_task`). Mexer ali exige
   verificação manual em dispositivo, ou há algum roteiro de QA que eu não encontrei?
