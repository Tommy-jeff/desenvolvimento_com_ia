# Ficha — 00. Perímetro

> Levantado em 2026-09-14 · fontes citadas por linha · teto de leitura: 10 arquivos (10 usados)

> ⛔ **Restrição desta execução:** nenhum comando `git` foi invocado (nem leitura). Onde a
> resposta só viria de git, a linha diz isso literalmente. Contagens de arquivo foram feitas
> com `find` + exclusão manual dos padrões de `.gitignore` (metodologia descrita em "Tamanho").

**Arquivos abertos (10/10):** `.gitignore` · `pubspec.yaml` · `README.md` · `.fvmrc` ·
`.metadata` · `android/.gitignore` · `ios/.gitignore` · `fonts/font_awesome_flutter/.gitignore` ·
`analysis_options.yaml` · `lib/analysis_options.yaml`

## Já em contexto (não relido)

- **`CLAUDE.md`** (instruções de projeto carregadas pelo harness) — respondeu: descrição do
  produto, camadas de `lib/`, papel de cada diretório, resumo de dependências, manifesto de
  qualidade, roadmaps ativos, tripulação de revisão. ⚠️ Ele **não é versionado**: consta em
  `.gitignore` junto de `GEMINI.md`, `.claude/` e `.gemini/` (`.gitignore`, bloco final).
- **`MEMORY.md`** (memória do usuário) — respondeu: uso de fvm, convenção de nomes em inglês,
  proibição de operações git, exigência de JDK 21 no Gradle.
- **Snapshot `gitStatus` do harness** — respondeu: branch atual e branch padrão (sem datas).

## Identidade

| Campo | Valor | Fonte |
|---|---|---|
| Slug | `veniti_mobile_app` | fixado pelo despacho desta execução |
| Nome do pacote | `veniti_mobile_app` | `pubspec.yaml:1` |
| Descrição | `Veniti Mobile App` | `pubspec.yaml:2` |
| Versão / build | `1.26.0+153` | `pubspec.yaml:18` |
| Publicação | `publish_to: 'none'` — pacote privado, não vai para pub.dev | `pubspec.yaml:6` |
| Raiz nesta máquina | `C:\Users\thoma\StudioProjects\veniti_mobile_app` | despacho + `ls` da raiz |
| Branch atual | `feat/CU-86ajykxee/migration-misc-endpoints` | contexto (`gitStatus`) |
| Branch padrão | `master` | contexto (`gitStatus`) |
| Último commit (data) | **NÃO ENCONTRADO — a fonte exigiria comando git, proibido nesta execução.** | — |
| Remote configurado | **NÃO ENCONTRADO — a fonte exigiria comando git, proibido nesta execução.** | — |

**Origem provável (achado incidental, não pesquisado):** o README aponta downloads hospedados em
`https://bitbucket.org/autem_developers/veniti_mobile_app/downloads/...`
(`README.md:10`, `README.md:46`, `README.md:59`). Isso indica hospedagem em **Bitbucket**, org
`autem_developers`, mas **não confirma** qual remote está configurado hoje.

**Sinal fraco de vitalidade** (não substitui a data do commit): `ls -la` da raiz mostra `.git/`
com mtime `Sep 14 00:51` e `pubspec.yaml` / `android/` / `ios/` / `lib/` com mtime `Aug 20`.
Os cinco commits mais recentes citados no contexto são todos de migração de endpoints para a
API v2 — o roadmap `endpoints-residuais-v2` (o maior de `docs/`) é o trabalho em curso.

## Stack

| Camada / pacote | Linguagem | Gerenciador | Manifesto | Fonte |
|---|---|---|---|---|
| App Flutter (único pacote de produto) | Dart | pub | `pubspec.yaml` | `pubspec.yaml:1` |
| SDK Dart exigido | Dart `>=3.10.0 <4.0.0` | — | `environment.sdk` | `pubspec.yaml:20` |
| Toolchain Flutter | — | **fvm**, versão pinada `3.44.8` | `.fvmrc` | `.fvmrc` (conteúdo: `{"flutter": "3.44.8"}`) |
| Canal Flutter registrado | — | `stable`, revision `d79295af24c3ed621c33713ecda14ad196fd9c31` | `.metadata` | `.metadata` |
| Tipo de projeto | — | `project_type: app` (não é plugin/package) | `.metadata` | `.metadata` |
| Host Android | Groovy DSL (+ Kotlin/Java) | **Gradle** | `android/build.gradle`, `android/app/build.gradle`, `android/settings.gradle` | `find -maxdepth 3` |
| Host iOS | Swift/ObjC | **CocoaPods** | `ios/Podfile` | `find -maxdepth 3` |
| Pacote vendorado `font_awesome_flutter` | Dart | pub via `dependency_overrides.path: ./fonts/font_awesome_flutter` | `fonts/font_awesome_flutter/pubspec.yaml` | `pubspec.yaml:108-112` |
| Gate de qualidade containerizado | shell | **Docker Compose** | `docker-compose.yml`, `quality/Dockerfile`, `quality/entrypoint.sh` | `find`; semântica em contexto (`CLAUDE.md`) |
| Git hooks | shell | **husky** (`husky ^0.1.7` em `dev_dependencies`) | `.husky/pre-commit` | `pubspec.yaml` bloco `dev_dependencies`; `ls .husky` |

**Overrides de dependência em vigor** (`pubspec.yaml:108-120`) — relevante para qualquer fatia que
mexa em pubspec: `path_provider_foundation: 2.5.1`, `geolocator_android: 5.0.2`,
`font_awesome_flutter` por `path`, `flutter_image_compress_common` por **git pin**
(`github.com/fluttercandies/flutter_image_compress`, ref `b69a5cb932e9...`).

**Observação de estado, sem juízo:** `mocktail: ^1.0.4` e `envied_generator: ^1.3.2` estão em
`dependencies` (não em `dev_dependencies`) — `pubspec.yaml`, bloco `dependencies`.

**Lint:** há **dois** `analysis_options.yaml`. O da raiz (`analysis_options.yaml:1-6`) é o efetivo
para `flutter analyze` na raiz: `include: package:flutter_lints/flutter.yaml` + `analyzer.exclude:
fonts/**, build/**`. O de `lib/analysis_options.yaml` é o template padrão do Flutter, sem regras
ativas (todas comentadas). Qual governa o quê é assunto da fatia de lint — aqui fica só o registro
de que existem dois.

## Layout (2 níveis, ignorados omitidos)

```
veniti_mobile_app/
├── lib/                    # CÓDIGO — 342 .dart (o produto inteiro)
│   ├── ui/                 #   138 — telas e widgets por feature
│   ├── blocs/              #    56 — cubits/states/containers
│   ├── database/           #    46 — SQLite: helper (DAOs) + model
│   ├── interface/          #    22 — clientes REST/WebSocket/AWS
│   ├── utils/              #    18 — constantes, device_type, app_sizes
│   ├── core/               #    15 — enums, exceptions, mixins, types
│   ├── strategy/ 13 · services/ 13 · extension/ 6
│   ├── workers/ 4 · widgets/ 3 · foreground_task/ 3 · preferences/ 2 · animations/ 1
│   ├── main.dart, firebase_options.dart
│   └── analysis_options.yaml   # (segundo arquivo de lint, ver "Stack")
├── test/                   # TESTES — 60 .dart, espelha lib/
│   └── ui/20 · interface/18 · strategy/4 · database/4 · core/4 · utils/3
│       services/3 · blocs/2 · extension/1 · helpers/1
├── docs/                   # DOCUMENTAÇÃO — 126 arquivos, quase tudo .md
│   ├── roadmap/            #   7 roadmaps; endpoints-residuais-v2 é o maior (35 arquivos)
│   ├── orientacoes_implementacao/  # 10 docs de integração com a API
│   └── historico-correcoes/, temp/
├── android/                # INFRA Android — 51 arquivos (Gradle, manifest, res)
├── ios/                    # INFRA iOS — 51 arquivos (Podfile, Runner, plists, .aiff)
├── assets/                 # 82 — audio/, car_images/, icons/, images/, launcher/
├── fonts/font_awesome_flutter/  # 28 — pacote VENDORADO (excluído do analyze)
├── google_fonts/           # 5 — Montserrat x3, SourceSans3, OFL.txt (asset declarado)
├── quality/                # Dockerfile + entrypoint.sh (gate containerizado)
├── .husky/pre-commit       # hook de pré-commit
├── .specforce/             # 39 arquivos — OUTRO sistema de automação versionado
│                           #   (archive/, docs/, memorial/, scripts/, config.yaml)
├── .windsurf/              # 2 — rules/ e workflows/ (config de outro assistente)
├── tools/refresh_env.sh
└── raiz: pubspec.yaml, analysis_options.yaml, README.md, AGENTS.md, AGENT.md,
         QUALITY_WIKI.md, docker-compose.yml, firebase.json, shorebird.yaml,
         .fvmrc, .metadata, .gitattributes, .gitignore, .env.exemple
```

**Não versionado, presente na máquina** (ruído a ignorar nas outras fatias):
`build/`, `build_trash_faf70411/`, `.dart_tool/`, `.fvm/`, `.idea/`, `.claude/`, `.gemini/`,
`CLAUDE.md`, `GEMINI.md`, `devtools_options.yaml`, `.env`, `pubspec.lock`,
`.flutter-plugins-dependencies`, `test_download.jpg`, `flutter_0{1,2,3}.log`,
`android/{.gradle, .kotlin, local.properties, hs_err_pid*.log, java_pid*.hprof, replay_pid*.log}`,
`status_and_steps/` (diretório **vazio**). Fontes: `.gitignore`, `android/.gitignore`,
`ios/.gitignore`, `fonts/font_awesome_flutter/.gitignore`, `ls -la` da raiz.

## Tamanho

**Metodologia** (git proibido): `find` na raiz, podando diretórios `.git .dart_tool .fvm .idea
.claude .gemini build build_trash* coverage .gradle .kotlin Pods .symlinks xcuserdata DerivedData
ephemeral captures` e `fonts/font_awesome_flutter/example`, e filtrando por nome
`*.log *.iml pubspec.lock Podfile.lock .flutter-plugins-dependencies .env devtools_options.yaml
CLAUDE.md GEMINI.md test_download.jpg launch.json *.jks key.properties local.properties gradlew
gradlew.bat gradle-wrapper.jar GeneratedPluginRegistrant.java Generated.xcconfig
flutter_export_environment.sh` — exclusões derivadas dos quatro `.gitignore` lidos.

- **Arquivos (proxy de versionados): 806.** É aproximação: sem `git ls-files` não há como
  confirmar arquivos rastreados-mas-agora-ignorados, nem untracked-não-ignorados contados a mais.
- **Extensões dominantes:**

| Ext | N | Ext | N | Ext | N |
|---|---|---|---|---|---|
| `dart` | 408 | `json` | 23 | `sh` | 6 |
| `md` | 155 | `ttf` | 14 | `gitignore` | 4 |
| `png` | 71 | `xml` | 13 | `mp3` | 4 |
| `svg` | 50 | `yaml` | 8 | `gradle` | 3 |
| | | `plist` | 8 | `entitlements` | 3 |

  Dos 408 `.dart`: **342 em `lib/`**, **60 em `test/`**, 6 no pacote vendorado `fonts/`.
- **Por diretório de topo:** `lib` 343 · `docs` 126 · `assets` 82 · `test` 60 · `ios` 51 ·
  `android` 51 · `.specforce` 39 · `fonts` 28 · raiz 14 · `google_fonts` 5 · `quality` 2 ·
  `.windsurf` 2 · `tools` 1 · `.vscode` 1 · `.husky` 1.
- **Monorepo: não.** Um único pacote de produto (`pubspec.yaml` na raiz, `project_type: app`),
  sem workspaces declarados. O segundo `pubspec.yaml` (`fonts/font_awesome_flutter/`) é um
  **fork vendorado** consumido por `dependency_overrides.path` (`pubspec.yaml:110-112`), não um
  membro de workspace. `android/` e `ios/` são hosts de plataforma do mesmo app, não pacotes.

**Leitura prática para as próximas fatias:** o alvo real é `lib/` (342 arquivos) + `test/` (60).
`docs/` é volumoso (126) mas é prosa de roadmap. `fonts/font_awesome_flutter/` está **excluído do
analyzer** (`analysis_options.yaml:5`) e não deve entrar em contagem de código do projeto.
`manifesto_completo` numa rodada é **inviável** para `lib/` inteiro; fatias seguintes precisam
mirar subdiretório por subdiretório.

## Não coberto

- **`.specforce/` (39 arquivos versionados)** — parece um segundo sistema de automação/agentes,
  este **dentro do git** (ao contrário de `.claude/`, que é gitignorado). Vale abrir
  `.specforce/config.yaml` e `.specforce/scripts/`: o README menciona que "os scripts de qualidade
  ... são executados automaticamente pelo Specforce" (`README.md`, seção "Configuração adicional no
  Windows"), então ele pode ser o dono real do pipeline de qualidade percebido pelo time.
- **`AGENTS.md` (4.5 KB) e `AGENT.md` (1 KB)** — versionados, ao contrário de `CLAUDE.md`. São a
  fonte de convenções que o **time** enxerga. Fatia de convenções deve abrir os dois e comparar
  com o `CLAUDE.md` local.
- **`QUALITY_WIKI.md`** — apontado pelo `CLAUDE.md` como detalhamento do pipeline; não aberto.
- **`docker-compose.yml` + `quality/{Dockerfile, entrypoint.sh}` + `.husky/pre-commit`** —
  existência confirmada, conteúdo não lido. É o material da fatia de build/CI.
- **`android/build.gradle`, `android/app/build.gradle`, `ios/Podfile`** — não abertos; versões de
  SDK/minSdk/assinatura ficam para a fatia de plataforma.
- **Precisão da contagem de 806**: `android/.kotlin` foi excluído por julgamento (cache de build do
  Kotlin), embora **não apareça** em nenhum `.gitignore` lido. Se estiver versionado por descuido,
  a contagem está subestimada.
- **Data do último commit e remote** — bloqueados pela restrição desta execução.
- **`.windsurf/rules` e `.windsurf/workflows`** — configuração de outro assistente, versionada;
  pode conter regras conflitantes com as do método.

## Perguntas ao dev

1. **`.specforce/` versus `.claude/`**: os dois automatizam qualidade e só um está commitado.
   Qual é o vivo hoje e qual é legado que ninguém toca?
2. **`AGENTS.md` (versionado) versus `CLAUDE.md` (gitignorado)**: quando divergirem, qual manda?
   O `CLAUDE.md` é pessoal seu ou é a política real do projeto que só não pôde ser commitada?
3. **`status_and_steps/` está vazio** e `docs/temp/` existe — são restos abandonados ou têm dono?
4. **`mocktail` e `envied_generator` estão em `dependencies`, não em `dev_dependencies`** — é
   intencional (algo em runtime depende deles) ou é um deslize que a fatia de dependências pode
   registrar como dívida?
5. **Quem comita?** As instruções locais dizem que a sessão nunca roda `git add/commit/push`. Isso
   vale também para as fatias seguintes deste reconhecimento e para qualquer implementação futura?
6. **Nível de rigor desejado no reconhecimento**: as outras sete fatias devem respeitar a mesma
   proibição total de git (o que degrada history, blame e detecção de código gerado), ou a
   proibição vale só para esta máquina/momento?
