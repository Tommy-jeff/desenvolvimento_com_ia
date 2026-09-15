# Ficha — 01. Manifesto e sensores

> Levantado em 2026-09-14 · projeto `veniti_mobile_app` (Flutter) · fontes citadas por linha
> · teto de leitura: 15 arquivos (15 usados)
> ⛔ Esta execução proibiu **qualquer comando git**, inclusive de leitura. Onde a resposta só
> viria de git, a linha diz isso literalmente.
> ⛔ Nenhum comando de verificação foi executado: os comandos abaixo estão **registrados, não
> rodados**.

## Já em contexto (não relido)

- `CLAUDE.md` — carregado pelo harness como instrução de projeto. Respondeu: o manifesto de
  qualidade canônico (3 comandos), a regra do `fvm`, o alvo `lib test` do format, a existência
  do gate `.claude/tool/review_pipeline.dart` + hooks, a regra doc-only, a proibição de
  `git add/commit/push` pela sessão, e o stack de teste (`flutter_test` + `mocktail` +
  `bloc_test` + `sqflite_common_ffi`).
- `MEMORY.md` do usuário (auto-memória) — respondeu: fvm é obrigatório e o symlink
  `.fvm/flutter_sdk` **não acompanha troca de branch** (a IDE pode buildar com o Flutter
  errado); "sem operações git" é regra permanente do dev, não só desta execução.

## Manifestos

| Nível | Comando | Cobre | Não cobre | Tempo típico | Fonte |
|---|---|---|---|---|---|
| **rápido** | `bash .specforce/scripts/all_tasks_check.sh` | `dart format` **só nos .dart alterados** (vs HEAD, staged+unstaged); `semgrep` **só nos alterados**; `flutter test --coverage` **só nos `*_test.dart` alterados** | ⚠️ **não roda teste algum se o diff não tocou um `*_test.dart`** (`all_tasks_check.sh:58-63` — sai com `exit 0` e um aviso); o `analyze` dele é de projeto inteiro e **não fatal** (`:44`); não usa `fvm` (`:12`, `:44`) | NÃO ENCONTRADO — nenhum arquivo declara; não medido (não rodei) | `.specforce/scripts/all_tasks_check.sh:1-70`; acionado por `.specforce/config.yaml:42-43` (`on_all_tasks_finished`) |
| **rápido (só formato)** | `bash .specforce/scripts/format_changed.sh` | `dart format` nos `.dart` alterados vs HEAD | tudo o mais | NÃO ENCONTRADO — não medido | `.specforce/scripts/format_changed.sh:1-13`; `.specforce/config.yaml:37-39` (`on_task_finished`, seguido de `flutter analyze --no-fatal-infos --no-fatal-warnings`) |
| **completo** | `fvm dart format --output=none --set-exit-if-changed lib test`<br>`fvm flutter analyze --fatal-infos --fatal-warnings`<br>`fvm flutter test` | formatação de `lib` e `test`; análise estática com **info e warning fatais**; **suíte inteira** (58 arquivos `*_test.dart` em `test/`) | build Android/iOS; semgrep/SAST (**não está no manifesto completo**); cobertura | **~60 s quente** — valor declarado no código do gate, medido em 2026-08-03 | `.claude/tool/review_pipeline.dart:305-319` (constante `manifestCommands`); idêntico ao bloco "Manifesto de qualidade" do `CLAUDE.md` (contexto) |

⚠️ **O nível rápido do projeto NÃO é substituto seguro do completo.** `all_tasks_check.sh:58-63`
pula os testes quando o diff não inclui um `*_test.dart` — ou seja, uma alteração em `lib/`
sem alteração de teste passa pelo "rápido" **sem executar teste nenhum**. Some-se a isso que o
`analyze` dele é `--no-fatal-infos --no-fatal-warnings` (`:44`), contra `--fatal-infos
--fatal-warnings` do manifesto completo. **Na composição o piso não desce: o veredito é do
manifesto completo.** Dado que o completo custa ~60 s quente, o ganho do rápido é pequeno e o
risco é alto.

⚠️ **O nível rápido depende de git** (`git rev-parse --show-toplevel`, `git diff` —
`all_tasks_check.sh:19-24`, `format_changed.sh:6-12`). Num contexto que proíbe git (como esta
execução), **ele é inexecutável**; o manifesto completo não depende de git.

### Exige ambiente especial?

| Exigência | Detalhe | Fonte |
|---|---|---|
| **SDK gerenciado por versão (fvm)** | `.fvmrc` fixa Flutter **3.44.8**. Todo comando Flutter/Dart do manifesto é prefixado por `fvm`. | `.fvmrc:1-2`; `CLAUDE.md` (contexto); `review_pipeline.dart:309,317,318` |
| **Dart SDK** | `sdk: '>=3.10.0 <4.0.0'` | `pubspec.yaml:20` |
| **Arquivo de variáveis de ambiente** | `.env` é **gitignorado** (`.gitignore:68`) e não vem no clone. Há um `.env.exemple` na raiz como modelo. | `.gitignore:68`; listagem da raiz |
| **Geração de código (envied/build_runner)** | `lib/utils/env.g.dart` é gerado a partir do `.env`. Regeneração: `./tools/refresh_env.sh` (= `dart run build_runner clean` + `dart run build_runner build --delete-conflicting-outputs`). O `.gitignore` **não** lista `*.g.dart`, e `lib/utils/env.g.dart` está presente no disco. Se o arquivo gerado é versionado (e portanto o manifesto roda sem `.env`): **NÃO ENCONTRADO — a fonte exigiria comando git, proibido nesta execução.** | `tools/refresh_env.sh:20-25`; `.gitignore` (sem entrada `*.g.dart`); `ls lib/utils/env.g.dart` |
| **Semgrep (SAST)** | Instalação **manual e à parte** do Flutter: `brew install semgrep` / `pip install semgrep`; no Windows, "via WSL ou Pip". **Não está no manifesto completo** — só nos hooks e no Docker. | `QUALITY_WIKI.md:11-14` |
| **Docker (opcional)** | Caminho alternativo do gate: `docker-compose up --build quality-gate`. Imagem `ghcr.io/cirruslabs/flutter:stable` (⚠️ `stable`, **não** a 3.44.8 do `.fvmrc`) + semgrep via pip. | `docker-compose.yml:1-10`; `quality/Dockerfile:1-27`; `QUALITY_WIKI.md:32-40` |
| **Bash/Unix no PATH (Windows)** | Os scripts de qualidade são bash; o README exige Git for Windows instalado com "Git from the command line and also from 3rd-party software". | `README.md:66-76`; `.specforce/scripts/all_tasks_check.sh:5-7` |
| Emulador / device / segredos de rede | Não exigidos pelo manifesto completo — os 58 testes são unitários/widget (`sqflite_common_ffi` em `dev_dependencies`). Não verificado por execução. | `pubspec.yaml:130-141` |

## Sensores

| Sensor | Existe? | Comando | Bloqueia o quê | Onde roda | Fonte |
|---|---|---|---|---|---|
| **Testes** | ✅ | `fvm flutter test` (completo) · `flutter test --coverage <arquivos alterados>` (rápido) | Manifesto completo: bloqueia o `set review approved` do gate da tripulação. Pre-commit: bloqueia o `git commit`. Docker: bloqueia o gate. | gate da tripulação · `.husky/pre-commit:43-44` · `quality/entrypoint.sh:22-23` · `.specforce/scripts/all_tasks_check.sh:66-69` | `review_pipeline.dart:318`; `.husky/pre-commit:44`; `quality/entrypoint.sh:23` |
| **Formatação** | ✅ | `fvm dart format --output=none --set-exit-if-changed lib test` | Manifesto completo apenas. ⚠️ **O pre-commit NÃO formata** — não há nenhum passo de format em `.husky/pre-commit`, nem em `quality/entrypoint.sh`. Os scripts do Specforce formatam **in-place** (corrigem, não reprovam). | só no manifesto da tripulação; Specforce reescreve silenciosamente | `review_pipeline.dart:307-316`; ausência verificada em `.husky/pre-commit:1-46` e `quality/entrypoint.sh:1-25` |
| **Lint / análise estática** | ✅ | **3 rigores diferentes** (ver "Documentado × praticado"): `fvm flutter analyze --fatal-infos --fatal-warnings` (manifesto) · `flutter analyze --no-fatal-warnings --no-fatal-infos` (pre-commit e Specforce) · `flutter analyze --no-fatal-warnings` (Docker) | Manifesto: **info e warning reprovam**. Pre-commit, Specforce e Docker: só **erro** reprova. | idem acima | `review_pipeline.dart:317`; `.husky/pre-commit:32`; `quality/entrypoint.sh:15`; `.specforce/config.yaml:39` |
| **Regras de lint** | ✅ | (configuração) `include: package:flutter_lints/flutter.yaml`; `analyzer.exclude: fonts/**, build/**`. **Nenhuma regra custom, nenhum `errors:` override.** | — | `analysis_options.yaml` | `analysis_options.yaml:1-6`; `flutter_lints: ^6.0.0` em `pubspec.yaml:131` |
| **Tipos** | n/a | Dart é estaticamente tipado; a checagem de tipos está dentro do `flutter analyze`. Sem sensor separado. | — | — | inferido de `analysis_options.yaml` + ausência de outro sensor na raiz, em `quality/` e em `.specforce/scripts/` |
| **Segurança estática (SAST)** | ✅ | `semgrep scan --config=auto --error --exclude="ios/" --exclude="android/" --exclude="lib/firebase_options.dart"` (pre-commit) · sem o exclude do `firebase_options.dart` (Docker) · `semgrep scan --config "p/default" --error --quiet <alterados>` (Specforce) | Bloqueia o commit **se o semgrep estiver instalado**; ⚠️ se não estiver, o pre-commit **pula em silêncio** (`else` → "Skipping SAST scan"). No Docker é obrigatório. **Não está no manifesto da tripulação.** | `.husky/pre-commit:35-40` · `quality/entrypoint.sh:18-19` · `all_tasks_check.sh:50-53` | fontes citadas |
| **Segredos** | ⚠️ parcial | Sem scanner dedicado de segredos. A cobertura vem indiretamente do ruleset `auto`/`p/default` do semgrep. `.env` é gitignorado; `.env.exemple` versionado. | — | — | `.gitignore:68`; ausência verificada na raiz, em `quality/` e em `.specforce/scripts/` |
| **Cobertura** | ⚠️ parcial, **sem piso** | Só o nível rápido passa `--coverage` (`all_tasks_check.sh:69`), e apenas para os testes alterados. Nenhum limiar, nenhum relatório consumido, nenhum `dart_test.yaml`, nenhum diretório `coverage/`. `/coverage/` é gitignorado. | **nada** — é subproduto, não gate | — | `all_tasks_check.sh:69`; `.gitignore:65-66`; `ls dart_test.yaml test/dart_test.yaml coverage` → inexistentes |
| **Gate mecânico da tripulação** | ✅ | `fvm dart run .claude/tool/review_pipeline.dart <begin\|scope\|set\|check\|status\|gate\|reset>`; os hooks chamam o binário `.claude/bin/review_pipeline.exe` | `PreToolUse` (Bash/PowerShell) → bloqueia **toda** operação git; `Stop` → bloqueia o fim de turno sem os dois vereditos frescos. `set review approved` **roda o manifesto ele mesmo** e recusa se vermelho. | `.claude/settings.json` | `.claude/settings.json:3-27`; `review_pipeline.dart:303,321-325`; `CLAUDE.md` (contexto) |
| **Hook de pre-commit (Husky)** | ✅ | instalação: `dart run husky install` | `git commit` (tenta Docker primeiro; se falhar, cai para execução nativa) | `.husky/pre-commit` | `.husky/pre-commit:1-46`; `husky: ^0.1.7` em `pubspec.yaml:134`; `QUALITY_WIKI.md:20-25` |
| **Hooks do Specforce** | ✅ | `on_task_finished`, `on_phase_finished`, `on_all_tasks_finished` | nada bloqueia commit; rodam ao fim de tarefa/fase do fluxo Specforce (`format_changed.sh` corrige em vez de reprovar) | `.specforce/config.yaml:35-43` | idem |
| **CI (Jenkins / GH Actions / GitLab)** | ❌ **não no repositório** | — | — | — | NÃO ENCONTRADO — procurei: `find . -maxdepth 3` por `Jenkinsfile*`, `.gitlab-ci*`, `azure-pipelines*`, `bitbucket-pipelines*`, `Makefile`; `ls -a .github` (inexistente); `ls .ci ci` (inexistentes). Só existem `docker-compose.yml` e `quality/Dockerfile`. O `QUALITY_WIKI.md:40` **afirma** que o Docker "simula exatamente o que acontece no pipeline de CI (Jenkins)", mas o Jenkinsfile não está versionado aqui. |
| **Pre-push** | ❌ | — | — | — | NÃO ENCONTRADO — `ls -aR .husky` mostra **apenas** `pre-commit` |

## Correspondência (para o índice)

| Diretriz | Desfecho | Instrumento | Justificativa da composição |
|---|---|---|---|
| Comando de verificação completo | `PROJETO` | `fvm dart format --output=none --set-exit-if-changed lib test` + `fvm flutter analyze --fatal-infos --fatal-warnings` + `fvm flutter test` | O projeto declara os três como manifesto canônico e o gate os executa por conta própria. A tripulação usa **estes**, sem inventar. Sempre com `fvm`; `dart format .` na raiz é proibido (varre `build/`, formata `fonts/` vendorado). |
| Nível rápido de verificação | `COMPÕE` (com ressalva forte) | `bash .specforce/scripts/all_tasks_check.sh` existe e é por-diff | O projeto tem um rápido, mas ele **pula testes quando o diff não toca um `*_test.dart`** e analisa sem `--fatal-*`. **O piso não desce**: serve de triagem durante a implementação, mas **o veredito de rodada e o encerramento exigem o manifesto completo** (~60 s quente — barato o bastante para não haver desculpa). Além disso depende de `git diff`. |
| Formatação | `PROJETO` | `fvm dart format --output=none --set-exit-if-changed lib test` | Alvos `lib test` são obrigatórios; não usar `.` nem a raiz. |
| Análise estática / lint | `COMPÕE` | `fvm flutter analyze --fatal-infos --fatal-warnings` | Coexistem três rigores (manifesto fatal · pre-commit e Specforce não-fatal · Docker não-fatal-warnings). **O piso não desce: vale o mais severo**, o do manifesto. Warning ou info novo reprova, mesmo que o pre-commit do projeto os tolere. |
| Testes | `PROJETO` | `fvm flutter test` (suíte inteira, 58 arquivos `*_test.dart`) | Nenhum gate de cobertura; o que o projeto exige é a suíte verde. |
| SAST / segredos | `PROJETO` (fora do manifesto) | `semgrep scan --config=auto --error --exclude="ios/" --exclude="android/" --exclude="lib/firebase_options.dart"` | O semgrep **não** faz parte do manifesto da tripulação e **não** entra no veredito por essa via; é sensor do pre-commit/Docker/Specforce, e pula em silêncio se não instalado. A tripulação não deve duplicá-lo nem assumir que rodou. |
| Cobertura | `NATIVO` (ausente no projeto) | — | Não há piso nem relatório consumido. Nada a compor: o método usa o dele, se tiver. |
| Gate de commit / quem comita | `PROJETO` | `.claude/tool/review_pipeline.dart` + `.husky/pre-commit` | O gate bloqueia `git add/commit/push` **sempre**; o commit é do dev, à mão. Regra reforçada pela memória do dev ("sem operações git") e pela restrição desta execução. |
| Dependências / `pubspec.yaml` | `PROJETO` | dossiê + aprovação explícita do dev para qualquer dependência nova (incl. `dev_dependencies` e `dependency_overrides`, Gradle, CocoaPods) | Sem aprovação = achado crítico automático (regra do `CLAUDE.md`, em contexto). |
| Doc-only (dispensa o fluxo) | `PROJETO` | `*.md`, `docs/**`, `.claude/**`, `.gitignore` | Definido no gate; nada a acrescentar. |

## Documentado × praticado

**Regra do método: o CI manda.** ⚠️ **Aqui não há CI versionado** (nenhum `Jenkinsfile`,
`.github/`, `.gitlab-ci.yml`). Na ausência de CI, quem manda é, nesta ordem: (1) o
**`review_pipeline.dart`**, porque é executável e **roda o manifesto ele mesmo** antes de
aceitar um veredito — não acredita em auto-relato; (2) o `.husky/pre-commit`, porque bloqueia
o commit de fato. Documento que nada executa não manda.

1. **`QUALITY_WIKI.md:27` promete formatação no pre-commit — o hook não formata.** O
   `QUALITY_WIKI.md:25-30` lista quatro verificações no `git commit`: Formatação, Análise
   Estática, SAST, Testes. O `.husky/pre-commit:24-46` executa apenas **três**: analyze, semgrep
   e testes. **Não há passo de `dart format` algum.** O `quality/entrypoint.sh:9-23` também não
   tem. → *Manda o hook: no commit, formatação não é verificada. Quem verifica é o manifesto da
   tripulação.*
2. **`QUALITY_WIKI.md:45` manda rodar `dart format .` — isso quebra neste projeto.** O
   `CLAUDE.md` (em contexto) registra que `dart format .` na raiz varre `build/` e formataria
   `fonts/` vendorado. O `analysis_options.yaml:3-6` exclui `fonts/**` e `build/**` **só do
   analyzer** — `dart format` não lê esses excludes. → *Manda o manifesto: sempre `lib test`.*
3. **Três rigores de `analyze` convivendo.** `--fatal-infos --fatal-warnings` (manifesto,
   `review_pipeline.dart:317`) × `--no-fatal-warnings --no-fatal-infos` (`.husky/pre-commit:32`
   e `.specforce/config.yaml:39`) × `--no-fatal-warnings` (`quality/entrypoint.sh:15`). O
   `QUALITY_WIKI.md:28` ratifica a tolerância ("warnings são permitidos por enquanto"). →
   *Composição: prevalece o mais severo. O "por enquanto" do wiki não rebaixa o manifesto.*
4. **`QUALITY_WIKI.md:32-40` afirma que o Docker "simula exatamente" o pipeline Jenkins — mas o
   pipeline não está no repositório**, e os dois arquivos de gate divergem entre si (o
   `entrypoint.sh:19` não exclui `lib/firebase_options.dart` do semgrep; o `pre-commit:37`
   exclui). Se o Jenkins real diverge de ambos: **NÃO ENCONTRADO — a fonte exigiria comando git**
   (ou acesso ao servidor de CI), proibido nesta execução.
5. **`QUALITY_WIKI.md:9` diz "Flutter SDK: versão estável" — o projeto fixa 3.44.8 via fvm**
   (`.fvmrc:2`), e **nenhum** script de qualidade do projeto usa `fvm`: nem o
   `.husky/pre-commit:25-44`, nem o `quality/entrypoint.sh`, nem o `all_tasks_check.sh:12,44`. A
   imagem Docker é `ghcr.io/cirruslabs/flutter:stable` (`quality/Dockerfile:1`). → *Manda o
   `.fvmrc` + `CLAUDE.md`: a tripulação roda **tudo** por `fvm`. Os sensores do projeto podem
   estar rodando com um Flutter diferente do fixado — fato relevante para interpretar
   divergências de analyze.* Some-se a memória do dev: o symlink `.fvm/flutter_sdk` não
   acompanha troca de branch.
6. **`GEMINI.md` é uma cópia envelhecida do `CLAUDE.md`.** `GEMINI.md:294` afirma que o
   pre-commit "executa dart format" (não executa — item 1) e `:302,:336` ainda mandam
   `dart format .`. → *Manda o `CLAUDE.md`. `GEMINI.md` / `AGENT.md` / `AGENTS.md` não são
   fonte para o manifesto.*
7. **`CLAUDE.md` diz "~400 testes em `test/`"; contei 58 arquivos `*_test.dart`.** Não há
   conflito necessário (400 casos cabem em 58 arquivos), mas o número de **casos** não foi
   verificado — verificar exigiria rodar a suíte, o que esta execução proíbe.

## Não coberto

- **`.specforce/scripts/phase_check.sh`** (1.764 bytes, acionado por `on_phase_finished`,
  `.specforce/config.yaml:40-41`) — **teto de leitura atingido em 15 arquivos**. Vale abrir: é o
  nível **intermediário** de verificação e pode conter um recorte de teste por área melhor que o
  de `all_tasks_check.sh` (que pula teste quando o diff não tem `*_test.dart`). Se contiver, a
  linha "rápido" da tabela de manifestos muda.
- **Jenkinsfile / definição real do CI** — não está no repositório. Vale obter do servidor
  Jenkins ou do dev: é a única fonte que resolveria o item 4 acima e diria o que de fato é
  obrigatório antes do merge.
- **Se `lib/utils/env.g.dart` é versionado** — determina se um clone limpo consegue rodar o
  manifesto sem `.env`. NÃO ENCONTRADO — a fonte exigiria comando git, proibido nesta execução.
- **Tempo real dos níveis rápido e completo nesta máquina** — o "~60 s quente" é declaração de
  código (`review_pipeline.dart:305`, medição de 2026-08-03), não medição minha. Medir é do
  revisor, na rodada dele.
- **Conteúdo de `status_and_steps/`, `docs/` e `.gemini/`** — fora da fatia 01 e sem sinal de
  conterem manifesto; não abertos para não estourar o teto nem invadir fatia vizinha.

## Perguntas ao dev

1. **O `all_tasks_check.sh` pula os testes quando o diff não toca um `*_test.dart`
   (`:58-63`). Isso é intencional?** Se for, o nível "rápido" não serve como pré-veredito da
   tripulação e a régua é sempre o manifesto completo — quero confirmar antes de a tripulação
   passar a aceitá-lo.
2. **Warning e info de lint: o time trata como erro na prática?** Três configurações do projeto
   dizem que não (`--no-fatal-*`) e o `QUALITY_WIKI.md:28` diz "permitidos por enquanto"; o
   manifesto da tripulação diz que sim (`--fatal-infos --fatal-warnings`). Confirma que a
   composição fica no nível severo, ou o projeto quer subir também os sensores próprios?
3. **O `QUALITY_WIKI.md` promete um passo de formatação no pre-commit que o hook não tem.** É
   regressão a corrigir no hook, ou documentação a corrigir no wiki? (Não toquei em nenhum dos
   dois — reconhecimento é só leitura.)
4. **Existe Jenkinsfile em outro lugar?** Sem ele não há "o CI manda": a régua executável do
   projeto passa a ser o `.husky/pre-commit` + o `review_pipeline.dart`.
5. **Um clone limpo roda `fvm flutter test` sem `.env`?** Ou seja: `lib/utils/env.g.dart` está
   versionado, ou é obrigatório pedir o `.env` e rodar `./tools/refresh_env.sh` antes de
   qualquer verificação? (Não pude checar — git proibido nesta execução.)
6. **O semgrep deve entrar no manifesto da tripulação?** Hoje ele está fora, e no caminho nativo
   **pula em silêncio** se não estiver instalado (`.husky/pre-commit:38-40`) — é possível
   commitar sem SAST algum sem que nada reclame de forma ruidosa.
7. **Os sensores do projeto rodam sem `fvm`** (Flutter do PATH / imagem `:stable`), enquanto o
   `.fvmrc` fixa 3.44.8. É deliberado, ou os scripts deveriam ser prefixados com `fvm`?
