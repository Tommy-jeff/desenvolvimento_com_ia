---
# FATOS OPERACIONAIS — todo papel lê este bloco. Mantenha-o curto e verdadeiro.
projeto: Veniti Mobile App
slug: veniti_mobile_app
raiz: C:\Users\thoma\StudioProjects\veniti_mobile_app
reconhecido_em: 2026-09-14
aprovado_pelo_dev: nao            # nao | sim — a tripulação avisa enquanto for "nao"
nivel_de_rigor: observador        # default do método: NÃO há decisão do dev (ver P-05.5)
idioma_dos_retornos: pt-BR        # prática consolidada, NÃO normatizada (ver P-03.1)
quem_comita: dev                  # e na prática nada sai daqui — ver "Decisões do dev"
roadmap_mora_em: no-repo:docs/roadmap
retornos_schema: docs/roadmap/retornos-schema.md
manifesto_rapido: "fvm dart format --output=none --set-exit-if-changed lib test && fvm flutter analyze --fatal-infos --fatal-warnings && fvm flutter test"
manifesto_completo: "fvm dart format --output=none --set-exit-if-changed lib test && fvm flutter analyze --fatal-infos --fatal-warnings && fvm flutter test"
---

# Ficha — Veniti Mobile App

> Ponto de entrada da tripulação neste projeto. Montada pelo roadmap de reconhecimento; as
> fatias com as fontes de cada linha estão em `ficha/`. **Enquanto `aprovado_pelo_dev: nao`,
> todo papel trata esta ficha como rascunho e declara isso no limite da revisão.**

**Procedência de cada campo do frontmatter** (nenhum inferido):

| Campo | Vem de |
|---|---|
| `projeto`, `raiz` | 00 (`pubspec.yaml:1-2`, `:18`) |
| `slug` | fixado pelo despacho. O remote real é `git@bitbucket.org:autem_developers/veniti_mobile_app.git` (05, lido em `.git/config`) |
| `manifesto_rapido`, `manifesto_completo` | 01 — **idênticos de propósito**, ver "Manifestos" |
| `idioma_dos_retornos` | 03 (prática observada; **sem norma escrita** — trava) |
| `quem_comita` | 05 (cinco fontes convergentes) + despacho |
| `nivel_de_rigor` | **sem decisão do dev** → default do método. Justificativa abaixo |
| `roadmap_mora_em`, `reconhecido_em`, `aprovado_pelo_dev` | despacho do dev |
| `retornos_schema` | 03 — o arquivo **já existe** no projeto, não precisa ser copiado |

**Por que `observador` e não `normativo`.** A fatia 05 lê o repositório como fortemente
`normativo` (gate mecânico que bloqueia fim de turno, piso de severidade escrito, `quality.md`
imutável, máximo de 3 rodadas) — e está certa sobre os fatos. Mas (a) não existe decisão do dev
(P-05.5 está aberta) e o default do método é `observador`; (b) a ficha está `aprovado_pelo_dev:
nao`, e ficha não aprovada não pode emitir veredito vinculante; (c) a fatia 04 mostra que os
gates da casa e o manifesto do método **discordam no piso** (Conflitos #2 e #8) — subir o rigor
antes de o dev arbitrar faria a tripulação reprovar entrega que o gate do time aprova. Assim que
o dev responder P-05.5, o valor provável é `normativo`.

---

## ⛔ Antes de instalar qualquer coisa neste projeto: FUNDIR, NÃO INSTALAR

A fatia 04 é pré-requisito de leitura de quem for mexer no aparelho. Três fatos, cada um capaz
de destruir trabalho em uso:

1. **A tripulação já está instalada — em nível de usuário, não do projeto.** Os quatro papéis
   vivem em `~/.claude/agents/{coder-reviewer,delivery-inspector,harness-scout,software-engineer}.md`
   (`.claude/agents/` **não existe** no projeto). Instalar o pacote por cima **sobrescreve
   silenciosamente** o que este projeto usa hoje — há 6 retornos JSON reais provando uso.
   **Não sobrescrever sem diff explícito** (P-04.4).
2. **O gate mecânico já existe e ocupa os hooks.** `.claude/settings.json` tem `PreToolUse`
   (`Bash|PowerShell` → `review_pipeline.exe gate`) e `Stop` (→ `check`). O objeto `hooks` é
   **único**: escrever por cima **apaga** o gate atual, e a falha é **silenciosa e aberta**.
   Se o pacote precisar de estado, ele deve **chamar** `review_pipeline.exe`, não empilhar um
   segundo binário. **Backup de `.claude/settings.json` antes de tocar.**
3. **Há quatro aparelhos de IA empilhados, de três donos, que não se conhecem** — Specforce
   (versionado), Husky/AI_GUIDELINES (versionado), tripulação do dev (gitignorado), Windsurf
   (versionado). Ver "Aparelho de IA já instalado".

---

## O que este projeto é

App **Flutter** (Dart, `pubspec.yaml` na raiz, `project_type: app`, versão `1.26.0+153`) do
produto Veniti — plataforma B2B2C de assistência veicular. Este repositório é o app dos
**prestadores de serviço**: geolocalização em foreground service, recebimento de serviços por
FCM, checklists, anexos, chat por WebSocket, atualização OTA por Shorebird. **Não é monorepo**:
um único pacote de produto, mais `android/` e `ios/` como hosts e `fonts/font_awesome_flutter/`
como fork **vendorado** ligado por `dependency_overrides`. Toolchain **fvm**, Flutter pinado
**3.44.8** — todo comando Flutter/Dart roda com prefixo `fvm`. Tamanho: **342 `.dart` em `lib/`**
(66.569 linhas), **60 em `test/`**, 126 arquivos em `docs/`, ~806 arquivos versionados (proxy).
O alvo real de qualquer trabalho é `lib/` + `test/`. (Fatia 00.)

---

## Correspondência — diretriz da tripulação × instrumento do projeto

<!-- PROJETO = usa o do projeto · NATIVO = usa o do método · COMPÕE = os dois, e como.
     Na composição o piso NUNCA desce. -->

| Diretriz | Desfecho | Instrumento do projeto | Fatia |
|---|---|---|---|
| Verificação rápida (por rodada) | **COMPÕE — o piso é o completo** | `bash .specforce/scripts/all_tasks_check.sh` existe e é por-diff, mas **pula os testes inteiros** quando o diff não toca um `*_test.dart` e roda `analyze --no-fatal-*`. Serve de triagem; **não vale como veredito** | 01, 04 |
| Verificação completa (DoD) | `PROJETO` | os 3 comandos do manifesto, **sempre com `fvm`** | 01 |
| Lint / formatação | `PROJETO` | `fvm dart format --output=none --set-exit-if-changed lib test`. **Nunca `dart format .`** — varre `build/` e formataria o vendorado | 01, 03, 06 |
| Tipos / análise estática | **COMPÕE — vale o mais severo** | `fvm flutter analyze --fatal-infos --fatal-warnings`. Os **quatro** gates versionados da casa rodam `--no-fatal-*`; o `QUALITY_WIKI.md:28` diz "warnings são permitidos por enquanto". O piso não desce | 01, 02, 04, 05 |
| Regras de lint customizadas | `NATIVO` | `analysis_options.yaml` tem **6 linhas**: `include: flutter_lints` + exclude `fonts/**`, `build/**`. Zero regra custom, zero fronteira de import | 03 |
| Segurança estática (SAST) / segredos | `PROJETO` — **fora do manifesto** | `semgrep scan --config=auto --error --exclude="ios/" --exclude="android/" --exclude="lib/firebase_options.dart"` no pre-commit/Docker. **Pula em silêncio se não instalado.** A tripulação não o duplica nem assume que rodou | 01, 04, 06 |
| Cobertura | `NATIVO` | sem piso, sem relatório consumido, sem `dart_test.yaml`, sem `coverage/` | 01, 02 |
| Como se escreve teste | `PROJETO` | ver "Como se escreve teste aqui" | 02 |
| Fixture / factory de dados | `NATIVO` | não existe factory, builder nem fixture global — closures no `main()` de cada arquivo | 02 |
| Teste de integração / golden | `NATIVO` | não existem. E2E é **roteiro manual** (`docs/roadmap/endpoints-residuais-v2/ROTEIRO-QA.md`) | 02, 06 |
| Padrões de arquitetura e código | **COMPÕE (como contexto, não como critério)** | `UI → Cubit → Service → Interface → DB` é **descritivo e não automatizado**; só vira achado quando o `quality.md` do item o transformar em requisito. Já são critério: os **8 padrões "não reinventar"** de `docs/historico-correcoes/README.md:25-57` | 03 |
| Idioma | `PROJETO` | identificadores em **inglês**; comentários, docstrings e UI em **pt-BR**. Código legado não se renomeia em massa — achado de idioma em código não tocado é inválido | 03 |
| Severidade / classificação de defeito | `PROJETO` | CRÍTICO/ALTO/MÉDIO/BAIXO na seção `CLASSIFICAÇÃO DE ACHADOS` do `quality.md` **de cada item** — que é a **fronteira de conhecimento dos inspetores**: regra do `CLAUDE.md` que não estiver lá **não existe** para eles | 03 |
| Piso do que bloqueia | **COMPÕE (o piso do projeto é mais alto)** | crítico/alto + **médio nas áreas sensíveis**; `escalado` não gera rodada mas **bloqueia o fecho**; rebaixar severidade para caber no piso é falha de revisão | 03, 05 |
| Formato dos retornos de revisão | `PROJETO` | `docs/roadmap/retornos-schema.md` + `retornos/{coder-reviewer,delivery-inspector,software-engineer}.json`, máquina de **7 status**. Não improvisar formato | 03 |
| Revisão de código | `PROJETO` | `.claude/tool/review_pipeline.dart` + hooks; 2 inspetores cegos em paralelo; **máx. 3 rodadas**; `set review approved` roda o manifesto ele mesmo | 03, 04 |
| Régua imutável por unidade | `PROJETO` | `quality.md` comitado **antes** do código; editá-lo de dentro da unidade é **forja de contrato** (crítico) | 03 |
| Aprovação de dependência | `PROJETO` | dossiê + aprovação explícita do dev = **achado crítico automático** sem ela. Escopo: `pubspec.yaml` incl. `dev_dependencies` e `dependency_overrides`, Gradle, CocoaPods | 05 |
| Política de licença | `NATIVO` | nada no projeto: sem `LICENSE`, `publish_to: 'none'`, sem auditoria de licença nem SCA/CVE em nenhum pipeline | 05 |
| Quem comita / branch e PR | `PROJETO` | `dev`; o gate bloqueia git **sempre**; branch `<tipo>/<CU-ticket>/<slug-en>`; Conventional Commits em pt-BR **sem hook que valide**; sem template de PR, sem `CODEOWNERS` (remoto é Bitbucket) | 05 |
| Classes de arquivo | `PROJETO` | ver tabela própria — **nada é declarado por atributo**; `.gitattributes` só trata eol/binary | 06 |
| Doc-only (dispensa o fluxo) | `PROJETO` | `*.md`, `docs/**`, `.claude/**`, `.gitignore` | 01 |

---

## Manifestos

| Nível | Comando | Cobre | Não cobre | Tempo típico |
|---|---|---|---|---|
| rápido | **idêntico ao completo** (decisão de composição, fatia 01) | — | — | ~60 s quente |
| completo | `fvm dart format --output=none --set-exit-if-changed lib test`<br>`fvm flutter analyze --fatal-infos --fatal-warnings`<br>`fvm flutter test` | formatação de `lib` e `test`; análise com info **e** warning fatais; suíte inteira (58 arquivos `*_test.dart`) | build Android/iOS; **semgrep/SAST**; cobertura | **~60 s quente** (valor declarado em `review_pipeline.dart:305`, medido 2026-08-03 — não medido por mim) |

⚠️ **O projeto tem um nível rápido e ele não é admissível como veredito.**
`bash .specforce/scripts/all_tasks_check.sh` sai `exit 0` **sem executar teste nenhum** quando o
diff não inclui um `*_test.dart` (`:58-63`), e analisa com `--no-fatal-*`. Além disso depende de
`git diff` — inexecutável numa sessão que proíbe git. Como o completo custa ~60 s quente, o ganho
do rápido é pequeno e o risco é alto: **os dois campos do frontmatter carregam o mesmo comando.**

⚠️ **Exigências de ambiente:** `fvm` obrigatório (`.fvmrc` → 3.44.8); `.env` é gitignorado e não
vem no clone (`tools/refresh_env.sh` regenera `lib/utils/env.g.dart`); semgrep se instala à parte
e **não está no manifesto**; o symlink `.fvm/flutter_sdk` **não acompanha troca de branch**
(memória do dev). **Não confirmado se um clone limpo roda a suíte sem `.env`** — P-01.5.

---

## Como se escreve teste aqui

- **Framework / runner:** `flutter_test` + `bloc_test ^10.0.0` + `sqflite_common_ffi ^2.3.3`;
  dublês com `mocktail ^1.0.4`. Sem `dart_test.yaml`, sem `flutter_test_config.dart` — **todo
  setup é explícito no `main()`**.
- **Local e nome:** `test/` **espelha `lib/`** até o subnível de feature; `<unidade>_test.dart`,
  um arquivo por unidade. Auxiliares deliberadamente **sem** o sufixo, para ficarem fora da
  coleta. Única exceção: `test/helpers/`.
- **Idioma dos casos:** pt-BR descrevendo comportamento; comentário em pt-BR dizendo **qual
  regressão o caso tranca** é o traço mais visível da suíte recente.
- **Auxiliares:** `test/interface/api_test_helpers.dart` (`setUpApiTestMocks()` arma
  SharedPreferences + PackageInfo + 5 method channels; `FakeHttpClient`; `FakeHttpClientAdapter`;
  `DummyDatabase`) — importado por **20** arquivos. `test/helpers/db_test_setup.dart`
  (`initFfiDatabaseFactory`, `openInMemoryDatabase`). **Não há factory/fixture global.**
- ⚠️ **A armadilha documentada:** `http.runWithClient` **não intercepta o `Dio` do
  `GoApiClient`**. Quem testa endpoint v2 troca `GoApiClient.i.dio.httpClientAdapter` no `setUp`
  e **restaura no `tearDown`** — singleton global, senão vaza para o próximo arquivo.
- **Testes de referência** (abra um antes de escrever teste; o revisor julga "teste raso" contra eles):
  1. `test/interface/professional_api_test.dart` — **abra este primeiro.** Camada onde o trabalho
     acontece; caminho de erro é maioria; assere rota e header, não só o corpo; sentinela `_absent`.
  2. `test/ui/manage_professional_users/delete_user/delete_user_cubit_test.dart` — `blocTest` +
     `mocktail`, `seed:`/`skip: 1`, cenários tabelados por `for`, assere o que **não** deve acontecer.
  3. `test/ui/tasks/widgets/professional_list_test.dart` — widget test que atravessa a pilha;
     matriz de bordas completa + invariante negativo reutilizado (`expectNoStrayEta`).
  <br>Sub-estilo leve (cubit semeado, sem API): `test/ui/manage_professional_users/user_list/user_management_list_test.dart`.
- **Régua que os inspetores cobram** (escrita em `_TEMPLATE/quality.md`): "Testes obrigatórios"
  nomeia arquivo por arquivo marcando `Criar`/`Estender` — **confira no disco antes de escrever
  "Criar"**, porque reescrever um arquivo de teste do zero **perde cobertura sem deixar o
  manifesto vermelho** (achado ALTO). Nenhuma asserção pré-existente removida, renomeada para
  menos ou afrouxada. Onde há flag de rollback: passar **nos dois estados da flag**.
- **Volume real:** ~653 blocos executáveis por contagem estática (02); um retorno de revisão real
  registra **671 testes** (03). O `CLAUDE.md` ainda diz "~400" — **defasado**.

---

## Áreas sensíveis (MÉDIO bloqueia como ALTO)

Lista canônica escrita em duas fontes independentes (`CLAUDE.md` e `_TEMPLATE/quality.md:152-155`).
O template exige **nomear os paths concretos** do item que caem nelas, ou declarar "este item não
toca área sensível" — apagar o bullet não é permitido.

| Caminho / área | Por quê |
|---|---|
| **Autenticação e sessão** — `lib/interface/oauth_authentication.dart`, `lib/preferences/` | Token OAuth em SharedPreferences; incidente registrado (`2026-08-17-401-do-token-desloga-durante-login.md`) |
| **SQLite e migrações** — `lib/database/helper/`, `lib/database/model/` | Schema na versão 98, migrações desde a 65; SQL concatenado é proibido |
| **Permissões, platform channels, foreground service, geolocalização** — `lib/foreground_task/`, `lib/workers/` | Função central do app em campo — e **sem teste nenhum** (nenhum arquivo em `test/workers` ou `test/foreground_task`) |
| **Ações FCM** — `SYNC_TASKS`, `SYNC_LOGOUT`, `SYNC_CANCEL`, `SYNC_LOCATION` | `SYNC_LOGOUT` derruba sessão remotamente |
| **Assinatura e release** — `pubspec.yaml` (versão), `shorebird.yaml`, `android/`, `ios/` | OTA por Shorebird sai sem passar pela store; "o AI NUNCA altera a versão do app autonomamente" |
| **O próprio pipeline de revisão** — `.claude/tool/`, `.claude/bin/`, `.claude/settings.json` | Sem o `.exe` os hooks **falham abertos** — some o gate inteiro, em silêncio |
| `lib/interface/` (22 arquivos) | Fora da lista canônica por nome, mas é onde 6 dos 7 roadmaps trabalham e os `quality.md` a nomeiam por item. Maior densidade de teste do repo (17/22) |
| `lib/utils/const.dart` — flags de rollback | Único mecanismo de reversão das migrações v1→v2; precisam voltar a `true` ao fim |
| `.env`, `lib/firebase_options.dart` | "O arquivo `.env` NUNCA deve ser comitado" (regra comitada) |
| `lib/ui/tasks/widgets/professional_list.dart` | Declarada "a tela mais sensível do app" — onde o master escolhe a quem despachar |

⚠️ **Fora da lista por falta de regra escrita, mas com incidente registrado:** chat/WebSocket e
upload de mídia (3 dos 8 registros de `docs/historico-correcoes/`). Promover ou não é P-05.3.
⚠️ A fatia 03 chama a lista de "as sete áreas" e a 05 de "as seis"; o enunciado literal tem
**6 itens**. Divergência de contagem, não de conteúdo.

---

## Fronteiras humanas (exigem aprovação de gente)

| Caminho / área | Quem aprova | Fonte |
|---|---|---|
| Decisões constitucionais Major (state management, protocolo de auth, estrutura de camadas) | **Allan Salles**, "Lead Engineer e proprietário do produto" — único dono humano nomeado em arquivo **comitado**. ⚠️ Pode não ser mais o interlocutor (P-05.2) | `.specforce/docs/governance.md:18` |
| `.specforce/docs/**` | Owner, explicitamente — "toda modificação constitucional é uma ação humana" | `governance.md:32` |
| Dependência nova · elemento visual/tela nova | **o dev que despacha** — dossiê + aprovação; sem isso, crítico automático | `CLAUDE.md`; `_TEMPLATE/quality.md:90-95` |
| Decisões travadas dos roadmaps | **o dev** — cláusula repetida nos 7 READMEs: parar, perguntar, registrar na tabela | os 7 `README.md` |
| `quality.md` de um item | **o dev, em commit próprio, antes** da implementação | `CLAUDE.md` |
| Contrato da API | **time de backend, terceiro** — o app não decide; há precedente de achado escalado ao portal sem tocar código | `endpoints-residuais-v2/README.md:18-29` |
| Criação/alteração de documento normativo | **o dev** | `endpoints-residuais-v2/README.md:20` |
| Commit, push, PR, bump de versão | **Owner / dev** — ver "Decisões do dev" | `governance.md:33-35`; `CLAUDE.md`; `MEMORY.md` |

Sem `CODEOWNERS` e sem proteção de branch visível — **NÃO ENCONTRADO** (viveriam no Bitbucket).

---

## Classes de arquivo que não se lê linha a linha

<!-- Não são ignorados: são conferidos por COERÊNCIA com a fonte que os produz. -->

⚠️ **Nada disto é declarado por configuração.** `.gitattributes` só trata eol e `binary` — não há
`linguist-generated` nem `linguist-vendored`. A classe foi reconstruída por cabeçalho, exclusão
de sensor e `.gitignore`.

| Padrão | Classe | Confere-se contra |
|---|---|---|
| `fonts/font_awesome_flutter/**` | **vendorado** — 136.397 linhas, **2,05× o `lib/` inteiro**; os 2 maiores (135.401 l, 99,3%) **não se anunciam como gerados** | versão vendorada `10.5.1` × constraint `^10.12.0` do manifesto raiz (nunca satisfeita); integridade vs. upstream **não registrada em lugar nenhum**. Excluído do analyzer, **não** do semgrep |
| `lib/utils/env.g.dart` (449 l) | **gerado** — `envied_generator` via `build_runner`/`tools/refresh_env.sh` | `lib/utils/env.dart` + `.env.exemple` (o `.env` é gitignorado e nunca aparece no diff) |
| `lib/firebase_options.dart` (70 l) | **gerado** — FlutterFire CLI | `firebase.json`. Único arquivo de `lib/` excluído do SAST — **e só no pre-commit, não no Docker** |
| `google_fonts/*.ttf`, `assets/**` (82) | **vendorado / binário** | `.gitattributes` já marca `binary`; declaração no bloco `assets` do `pubspec.yaml` |
| `pubspec.lock`, `ios/Podfile.lock` | 🔴 **lockfile — NÃO versionado** (ignorado duas vezes) | **a classe está vazia**: nenhuma revisão enxerga resolução transitiva num diff. A única barreira contra dependência nova é a regra do dossiê |
| golden / snapshot | **não existem** | — nada a definir; se forem introduzidos, vira lacuna de política |

---

## Aparelho de IA já instalado no projeto

**Quatro camadas, três donos, que não se conhecem.** A camada do dev (C) é a mais rigorosa e a
única invisível para o time; a do Specforce (A) é a única que outro dev enxerga — e é mais frouxa.

| Artefato | Ferramenta | Desfecho | Como conviver |
|---|---|---|---|
| `CLAUDE.md` + `.claude/` (**gitignorados**) | Claude Code, do dev | **complementa** — é o hospedeiro | **O ponteiro do pacote vai aqui.** Único documento que o harness carrega sozinho |
| `~/.claude/agents/*.md` (4 papéis, **nível usuário**) | Claude Code | ⛔ **colisão total de nome, já materializada** | Instalar o pacote **sobrescreve**. Confirmar se são o mesmo artefato (P-04.4). Se divergirem, **o pacote renomeia, nunca o projeto** |
| `.claude/settings.json` (`PreToolUse` + `Stop`) + `review_pipeline.exe` | gate próprio, em uso | **complementa** | **Não instalar outro gate.** Objeto `hooks` único; sem o `.exe` os hooks **falham abertos** |
| `AGENTS.md` + `.specforce/**` (**versionados**) | Specforce (SDD) | **conflita (forte)** — "DIRECT EDIT PROHIBITION": proibido mutar código sem spec aprovada; manda auto-ativar `/spf:*` | Sessão que leia `AGENTS.md` pode **se recusar a implementar** item de roadmap. Precedência escrita pendente (P-04.1 / P-05.1). Conciliação proposta: `brief.md`+`quality.md` **satisfaz** "approved specification" |
| `.specforce/scripts/*.sh` | Specforce | **conflita (grave, #8)** + `format_changed.sh` **complementa** | `all_tasks_check.sh` pode sair verde sem rodar teste. `format_changed.sh` formata **in-place** e depende de git — ver divergência 01×04 abaixo |
| `.specforce/docs/governance.md` | Specforce (Constituição) | **complementa (forte)** | Proibição de commit **idêntica**. O `Conflict Resolution Protocol` (`:39-43`: recusar → citar o documento violado → propor alternativa → aguardar) é **mais explícito** que "para e escala ao dev" |
| `AGENT.md`, `docs/AI_GUIDELINES.md`, `QUALITY_WIKI.md` (versionados) | genéricos | **complementa + conflita pontual** | Mandam `dart format .` (quebra aqui) e "warnings permitidos". `CLAUDE.md` vence. ⚠️ `AGENT.md` ≠ `AGENTS.md` — um caractere separa dois normativos distintos |
| `.husky/pre-commit` (versionado) | Husky | **complementa** (SAST) + piso frouxo | Semgrep é cobertura que a tripulação **não** tem → agregar. Analyze frouxo → não rebaixar. Como a sessão nunca comita, **é o único lugar onde a suíte completa roda sozinha — e está fora do alcance da tripulação** |
| `GEMINI.md`, `.gemini/` (gitignorados) · `.windsurf/` (versionado) | Gemini / Windsurf | **ignorar (provisório)** | `.windsurf/rules/doc-flutter.md` é `trigger: manual`, mas prega docstring **em tudo, em inglês** — contrário ao `CLAUDE.md`. É o único aparelho **versionado** que prega o oposto |
| CI / bot de PR | — | **NÃO ENCONTRADO** | Sem `.github/`, `Jenkinsfile`, `.gitlab-ci.yml`. `QUALITY_WIKI.md:40` afirma que o Docker "simula exatamente" um Jenkins que **não está no repositório** |

---

## Documentos normativos

| Documento | Cobre | Vale para a tripulação como |
|---|---|---|
| `CLAUDE.md` (raiz, **gitignorado**) | Convenções, arquitetura, manifesto, tripulação, piso de severidade, formato de roadmap | **Norma máxima.** Vence `AI_GUIDELINES` e `QUALITY_WIKI` onde divergem (piso não desce) |
| `docs/roadmap/<tema>/NN-slug/quality.md` | Escopo, arquivos, orçamentos, testes obrigatórios, DoD, classificação de achados, gate | **A régua que julga a entrega**, e a **fronteira de conhecimento dos inspetores** |
| `docs/roadmap/<tema>/README.md` (7 temas) | Decisões travadas, regras normativas **do tema** | Normativo **só dentro do tema** — tratar regra de tema como global é achado inventado |
| `docs/roadmap/retornos-schema.md` | Formato dos 3 JSON, máquina de 7 status, gate de encerramento | Norma de formato. Não improvisar |
| `docs/historico-correcoes/README.md` | 8 padrões recorrentes "não reinventar" + convenção de registro | Norma de código, nascida de bug real |
| `docs/orientacoes_implementacao/*.md` (13) | Contratos de API do backend | Normativo dentro do roadmap que os cita. ⚠️ A cópia local do handoff misc está **declarada desatualizada** |
| `.specforce/docs/governance.md` (**comitado**) | Owner, proibições de commit/push/versão/dependência, protocolo de recusa | **Reforça** a tripulação; é a única governança sob controle de versão |
| `docs/AI_GUIDELINES.md`, `QUALITY_WIKI.md` (comitados) | Husky, SAST, Docker/Jenkins, teste obrigatório por bugfix | **Parcialmente superados** (`dart format .`, "warnings permitidos"). A regra "todo bugfix/feature acompanhado de teste" **vale** |
| `AGENTS.md` / `AGENT.md` (comitados) | Protocolo SDD / mandatos de husky | Ver "Aparelho de IA" — precedência **pendente do dev** |
| `docs/sugestao_melhoria_arquitetura.md` e `..._tecnologias_e_processos.md` | — | ⚠️ **ARQUIVOS VAZIOS (0 linhas)**, apesar de o `CLAUDE.md` os listar (e citar um com o nome errado) |
| ADR / RFC / `CONTRIBUTING.md` | — | **NÃO EXISTEM.** O análogo de ADR são as tabelas de *Decisões travadas*, que são de **produto e por tema** |

---

## Decisões do dev registradas aqui

| Decisão | Valor | Quando |
|---|---|---|
| Quem comita | `dev`. E **na prática nada sai deste repositório**: a identidade git local foi removida e não há identidade global — **um commit aqui falha por falta de identidade**. A entrega termina em relatório e os arquivos ficam `modified` | 2026-09-14 (despacho + fatia 05) |
| Onde mora o roadmap | `no-repo:docs/roadmap` — o projeto já usa esse caminho, com `retornos-schema.md` já copiado | despacho |
| Git proibido no reconhecimento | **Nenhum comando git**, nem de leitura, nas 7 fatias. O dev não faz mais parte da empresa que mantém o projeto | 2026-09-14 (despacho) |
| Aprovação da ficha | `aprovado_pelo_dev: nao` — rascunho até o dev responder as perguntas travantes | 2026-09-14 |
| Máximo de rodadas de revisão | **3**; sem convergir, parar e escalar | `CLAUDE.md`; `_TEMPLATE/quality.md:37` (fatia 03) |
| Retrocompatibilidade de API | Mudança **aditiva**; campo antigo só sai com aval do mobile (inclusive o typo `vehicle_liscense`) | memória do dev (fatia 03) |

---

## Divergências entre fatias (não resolvidas por escolha minha)

1. **`format_changed.sh`:** a fatia 04 o recomenda como **primeira escolha** para formatar
   ("ferramenta da casa, recorte ao diff, já versionada e segura"); a fatia 01 registra que ele
   **formata in-place** (corrige, não reprova) e **depende de `git diff`** — inexecutável numa
   sessão que proíbe git. As duas leituras valem; a decisão é do dev.
2. **Volume da suíte:** `CLAUDE.md` diz "~400 testes"; a fatia 02 conta **~653** blocos por grep;
   a fatia 03 cita um retorno de revisão real com **671**. Nenhuma é medição de execução.
3. **Contagem de áreas sensíveis:** fatia 03 diz "as sete áreas", fatia 05 diz "as seis"; o
   enunciado literal tem 6 itens.
4. **Peso do conflito Specforce:** a fatia 04 classifica `AGENTS.md` como "conflita (forte)"; a
   fatia 05 conclui que "nos pontos load-bearing os dois coincidem" e isola **um** atrito real
   (a proibição de editar código sem spec). Mesma substância, ênfase oposta.
5. **Remote:** a fatia 00 declarou `NÃO ENCONTRADO` (exigiria git); a 05 leu `.git/config` como
   arquivo e obteve `git@bitbucket.org:autem_developers/veniti_mobile_app.git`. A 05 é mais
   completa — não é contradição.

---

## O que ficou NÃO ENCONTRADO (e para o que cega a tripulação)

- **Tudo que só o git responde:** data do último commit, arquivos de fato *tracked*, se
  `pubspec.lock` foi comitado antes da regra, se `lib/utils/env.g.dart` é versionado, quantas
  mãos tocam o repo, histórico de mensagens de commit. → Cega a detecção de **código gerado
  versionado por descuido** e a checagem "o clone limpo roda o manifesto?".
- **Definição real do CI (Jenkins).** Não está no repositório. → Sem ela **não existe "o CI
  manda"**: a régua executável passa a ser `.husky/pre-commit` + `review_pipeline.dart`.
- **`.specforce/docs/engineering.md`** (coding standards + testing strategy, **comitado**) — a
  lacuna mais cara. → Os Conflitos #2 e #8 estão sendo arbitrados com meio quadro.
- **`.specforce/docs/security.md` (parcial), `principles`, `architecture`, `ui-ux`, `memorial/`**
  → podem definir **outra** lista de áreas sensíveis.
- **`~/.claude/agents/*.md` (os 4 papéis) e `~/.claude/settings*.json`** → sem abri-los, não dá
  para afirmar se a doutrina instalada coincide com a do pacote, nem se há **hooks globais** que
  se somem aos do projeto. **Abrir antes de instalar qualquer gate.**
- **`GEMINI.md` (18 KB)** classificado "ignorar" **por metadado, não por conteúdo**.
- **Integridade do vendorado vs. upstream 10.5.1** → a checagem canônica da classe "vendorado"
  está em aberto.
- **Nenhum comando de verificação foi executado** em nenhuma fatia: todos os manifestos, tempos
  e resultados aqui são **registrados, não medidos**.

---

## Perguntas abertas

<!-- O que nenhuma fatia respondeu e só o dev responde. Enquanto houver pergunta aberta que
     afete um fato operacional do frontmatter, a ficha não está aprovada. -->

Todas as 59 perguntas das sete fatias, **verbatim**. 🔒 = **trava um campo do frontmatter** (são
essas que impedem `aprovado_pelo_dev: sim`). ⛔ = trava a decisão de instalação.

### 🔒 As que travam a aprovação (responda estas primeiro)

- 🔒 **[05.5 → `nivel_de_rigor`]** Nível de rigor desejado para começar: `observador`, `consultivo` ou `normativo`? A leitura do repositório sugere fortemente **normativo** (gate mecânico que bloqueia fim de turno, piso de severidade escrito, quality.md imutável, máximo de 3 rodadas), mas quem decide é você.
- 🔒 **[03.1 → `idioma_dos_retornos`]** **Idioma dos retornos da tripulação.** O `retornos-schema.md` normatiza chaves e enums (pt-BR), mas **não diz nada sobre o idioma da prosa** (`descricao`, `cenario_de_falha`, `nota_verificacao`, `limite_da_revisao`, `adequacao_de_teste`). Na prática os retornos reais estão em pt-BR. **Confirma pt-BR como regra — inclusive para o relatório final ao dev?** Há chance de outra pessoa (backend, auditoria) precisar ler esses JSON em inglês?
- 🔒 **[05.6 → `quem_comita`]** **Confirma `quem_comita: dev`, com a consequência prática?** Como não há identidade git configurada, a entrega termina em relatório e os arquivos ficam **modified** na árvore — nada é commitado, nada é empurrado, e o trabalho só persiste enquanto a árvore de trabalho existir. Quer algum outro mecanismo de persistência de entrega (patch, diff arquivado), ou está certo assim?
- 🔒 **[00.5 → `quem_comita`]** **Quem comita?** As instruções locais dizem que a sessão nunca roda `git add/commit/push`. Isso vale também para as fatias seguintes deste reconhecimento e para qualquer implementação futura?
- 🔒 **[01.1 → `manifesto_rapido`]** **O `all_tasks_check.sh` pula os testes quando o diff não toca um `*_test.dart` (`:58-63`). Isso é intencional?** Se for, o nível "rápido" não serve como pré-veredito da tripulação e a régua é sempre o manifesto completo — quero confirmar antes de a tripulação passar a aceitá-lo.
- 🔒 **[04.2 → `manifesto_rapido`/`manifesto_completo`]** **Escopo de teste (Conflito #8) — a pergunta que mais muda o custo por rodada.** Ciente de que `all_tasks_check.sh:58-64` **pula os testes inteiros** quando nenhum `_test.dart` mudou, e de que o `flutter test` completo só roda no `git commit` (que a sessão nunca executa), confirma `fvm flutter test` **completo** como parte do manifesto da tripulação?
- 🔒 **[01.2 → `manifesto_completo`]** **Warning e info de lint: o time trata como erro na prática?** Três configurações do projeto dizem que não (`--no-fatal-*`) e o `QUALITY_WIKI.md:28` diz "permitidos por enquanto"; o manifesto da tripulação diz que sim (`--fatal-infos --fatal-warnings`). Confirma que a composição fica no nível severo, ou o projeto quer subir também os sensores próprios?
- 🔒 **[04.3 → `manifesto_completo`]** **O piso de severidade vale mesmo (Conflito #2)?** `QUALITY_WIKI.md:28` diz "warnings são permitidos por enquanto" e os **quatro** gates versionados rodam `--no-fatal-*`, enquanto o manifesto exige `--fatal-infos --fatal-warnings`. Assumi o mais rigoroso (o piso não desce). Confirma, mesmo significando reprovar entrega que o gate do time aprovaria?
- 🔒 **[02.8 → `manifesto_completo`]** **Divergência de rigor no `analyze`:** husky roda `--no-fatal-warnings --no-fatal-infos` (`.husky/pre-commit:32`), o manifesto roda `--fatal-infos --fatal-warnings`. Confirmo que o piso é o manifesto (mais rígido) e que o husky é só rede de segurança mais frouxa?
- 🔒 **[01.6 → `manifesto_completo`]** **O semgrep deve entrar no manifesto da tripulação?** Hoje ele está fora, e no caminho nativo **pula em silêncio** se não estiver instalado (`.husky/pre-commit:38-40`) — é possível commitar sem SAST algum sem que nada reclame de forma ruidosa.
- 🔒 **[03.5 → `manifesto_completo`]** **O pre-commit do Husky ainda roda?** O `semgrep` aparece em dois documentos como etapa do gate, mas não está no manifesto de 3 comandos do `CLAUDE.md`. **A tripulação deve considerar o SAST parte do critério de pronto**, ou ele é responsabilidade exclusiva do hook/CI?
- 🔒 **[01.5 → manifesto executável]** **Um clone limpo roda `fvm flutter test` sem `.env`?** Ou seja: `lib/utils/env.g.dart` está versionado, ou é obrigatório pedir o `.env` e rodar `./tools/refresh_env.sh` antes de qualquer verificação? (Não pude checar — git proibido nesta execução.)

### ⛔ As que travam a instalação do pacote

- ⛔ **[04.4]** **Os 4 agentes em `~/.claude/agents/` são a tripulação do pacote, ou uma versão local divergente?** Disso depende tudo: se divergirem, instalar o pacote **sobrescreve silenciosamente** o aparelho que este projeto usa hoje (6 retornos JSON provam o uso).
- ⛔ **[04.1]** **Specforce está vivo ou morto?** `AGENTS.md` manda, em maiúsculas, **não editar código sem spec aprovada** — o que proíbe literalmente o modo de trabalho por roadmap. As specs estão todas arquivadas desde maio/2026, mas `AGENTS.md` e `.specforce/` têm mtime de 19/08. Se estiver morto, a tripulação precisa de precedência **escrita** no `CLAUDE.md`, senão uma sessão futura vai ler `AGENTS.md` e se recusar a implementar. **Alternativa conciliadora:** declarar `brief.md`+`quality.md` como "approved specification" equivalente (Conflito #1).
- ⛔ **[05.1]** **Specforce está vivo ou é sedimento?** `AGENTS.md` e `.specforce/**` são **comitados** (não estão no `.gitignore`) e impõem um regime de spec-driven development — inclusive `AGENTS.md:22`: *"You are STRICTLY FORBIDDEN from using mutation tools to modify the codebase unless a valid, approved specification exists"*. O `CLAUDE.md` não menciona Specforce e opera por roadmap. **Um item de roadmap com `quality.md` comitado satisfaz a exigência de "approved specification", ou o regime Specforce está morto e deve ser ignorado?** É a única contradição operacional real entre as duas réguas.
- ⛔ **[00.1]** **`.specforce/` versus `.claude/`**: os dois automatizam qualidade e só um está commitado. Qual é o vivo hoje e qual é legado que ninguém toca?

### As demais, por fatia

**Fatia 00 — Perímetro**

2. **`AGENTS.md` (versionado) versus `CLAUDE.md` (gitignorado)**: quando divergirem, qual manda? O `CLAUDE.md` é pessoal seu ou é a política real do projeto que só não pôde ser commitada?
3. **`status_and_steps/` está vazio** e `docs/temp/` existe — são restos abandonados ou têm dono?
4. **`mocktail` e `envied_generator` estão em `dependencies`, não em `dev_dependencies`** — é intencional (algo em runtime depende deles) ou é um deslize que a fatia de dependências pode registrar como dívida?
6. **Nível de rigor desejado no reconhecimento**: as outras sete fatias devem respeitar a mesma proibição total de git (o que degrada history, blame e detecção de código gerado), ou a proibição vale só para esta máquina/momento?

**Fatia 01 — Manifesto e sensores**

3. **O `QUALITY_WIKI.md` promete um passo de formatação no pre-commit que o hook não tem.** É regressão a corrigir no hook, ou documentação a corrigir no wiki? (Não toquei em nenhum dos dois — reconhecimento é só leitura.)
4. **Existe Jenkinsfile em outro lugar?** Sem ele não há "o CI manda": a régua executável do projeto passa a ser o `.husky/pre-commit` + o `review_pipeline.dart`.
7. **Os sensores do projeto rodam sem `fvm`** (Flutter do PATH / imagem `:stable`), enquanto o `.fvmrc` fixa 3.44.8. É deliberado, ou os scripts deveriam ser prefixados com `fvm`?

**Fatia 02 — Testes**

1. **O padrão que levantei é o desejado, ou só o recente?** As três referências vêm do lote de 2026-08, produzidas por itens de roadmap que escreveram "Testes obrigatórios" antes do código. Os arquivos mais antigos são ordens de grandeza menores (`checklist_photos_item_cubit_test.dart`, 751 B; `checklist_detail_cubit_test.dart`, 853 B). O piso para teste **novo** é o padrão recente (erro primeiro, matriz de bordas, comentário do porquê), ou o histórico ainda é aceitável?
2. **`mocktail: ^1.0.4` está em `dependencies`, não em `dev_dependencies`** (`pubspec.yaml:102`). É intencional (algum uso em `lib/`?) ou dívida? Importa para a regra "dependência nova exige dossiê": mover de seção mexe no `pubspec.yaml` e cairia nessa regra.
3. **Áreas sensíveis sem teste nenhum** — `workers`, `foreground_task`, `preferences`, `widgets`: decisão consciente (difícil sem device) ou vão a fechar? A resposta muda o que o revisor pode exigir de um item que toque foreground service ou geolocalização.
4. **Fábrica de dados de teste:** hoje `User(1, 'Nome', 'user', 'a@b.com', 1, '', '', '', 0, 0, 0)` — construtor posicional de 11 argumentos — é remontado à mão, e cada teste de API tem seu `xJson()` local. Um `test/helpers/model_factories.dart` seria bem-vindo, ou bate de frente com "não abstrair prematuramente / não criar helper para uso único"?
5. **Widget test: qual dos dois sub-estilos vale para código novo?** Atravessar a pilha com adapter fake (`professional_list_test.dart`) ou semear o cubit no estado terminal (`user_management_list_test.dart`)? Há regra, ou é escolha caso a caso?
6. **Nome de caso de teste conta como "texto" (pt-BR) ou como "identificador" (inglês)?** A prática é pt-BR com resíduo legado em inglês. Confirmar, para a revisão parar de julgar pelos dois critérios.
7. **Quem mantém `api_test_helpers.dart`?** Ele já arma 5 method channels e é importado por 20 arquivos — cada plugin novo com channel exige editá-lo, e um erro ali derruba um terço da suíte. Alterá-lo dentro de um item de roadmap é permitido, ou é sempre commit próprio (como o `quality.md`)?
9. **O E2E é 100% manual** (`ROTEIRO-QA.md`, item `06-verificacao-e2e`). Quem executa, contra qual ambiente, e é pré-requisito da entrega, ou roda depois em lote?
10. **Existe convenção não escrita cobrada em revisão** que não dá para ver nos arquivos? (limite de `expect` por caso, proibição de dublê em alguma camada, obrigatoriedade do comentário-do-porquê, exigência de assertar rota+header e não só o corpo)

**Fatia 03 — Padrões e decisões**

2. **`docs/AI_GUIDELINES.md` está superado — atualizo o entendimento ou o documento?** Ele manda `dart format .` (que o `CLAUDE.md` diz que quebra neste repo) e o `QUALITY_WIKI.md` diz que "warnings são permitidos por enquanto" (contra `--fatal-warnings`). Assumi que o `CLAUDE.md` vence nos dois. **Confirma?** E os dois continuam sendo fonte de norma para a tripulação, ou viraram documentos históricos?
3. **`AGENT.md` é normativo?** O `AI_GUIDELINES.md:39` o chama de "foundational mandates". Como o repositório tem `AGENT.md`, `AGENTS.md`, `GEMINI.md` e `CLAUDE.md` convivendo — mais `.gemini/`, `.windsurf/`, `.specforce/`, `.vscode/`, `.idea/` — **qual deles a tripulação deve obedecer e qual é só configuração de outro harness?**
4. **Os dois `docs/sugestao_melhoria_*.md` estão VAZIOS (0 bytes), mas o `CLAUDE.md` os lista como documentação.** Foram esvaziados de propósito, o conteúdo se perdeu, ou migrou para os roadmaps? (O `CLAUDE.md` ainda cita um deles pelo nome errado — falta o `e_` em `tecnologias_e_processos`.)
6. **Regra que você cobra em revisão e que não está escrita em lugar nenhum?** Os 8 padrões de `docs/historico-correcoes/README.md` parecem ser exatamente isso, já escritos. **Sobrou alguma que ainda não virou texto?**
7. **Escopo das "Regras normativas" dos roadmaps.** Cada README diz valer "para o tema". Mas várias dessas regras (`ApiResult<T>` para toda função de requisição, ramificar por slug e nunca por `message`, `GoApiClient.i.run` para endpoint Go, `ApiErrorMessages.localize` para texto de usuário) **parecem ser norma de projeto**, não de tema. **Alguma já graduou para regra global, mesmo sem Skill formalizada?** Tratei todas como escopo-de-tema por conservadorismo — se alguma for global, ela deve entrar nas lentes dos inspetores.
8. **Validade temporal de decisão travada.** O `endpoints-residuais-v2` registra "Tomadas com o dev em 2026-08-19". Uma decisão travada de meses atrás, sobre uma área que mudou desde então, **ainda vale sem reconfirmação?** Existe critério de expiração?
9. **Quem hoje mantém `QUALITY_WIKI.md`?** O arquivo assina "Mantido pelo time de Engenharia Veniti" (`QUALITY_WIKI.md:50`). Se esse time não é mais o interlocutor, o documento vira histórico — e isso muda o desfecho da pergunta 2.
10. **A skill `roadmap-driven-development` mora fora do repositório** (`C:\Users\thoma\.claude\skills\`, não em `.claude/skills/`, que **não existe** no projeto). Ela é a régua do método de roadmap e o `CLAUDE.md` manda carregá-la antes de criar ou executar qualquer roadmap. **Confirma que ela é pré-requisito de máquina** — isto é, que uma sessão noutra máquina sem essa skill não deve criar nem executar roadmap?

**Fatia 04 — Aparelho de IA**

5. **`.claude/INSTALL.md:13` deve ser corrigido** para apontar `~/.claude/agents/`? Do jeito que está, o backup documentado não leva os agentes.
6. **`AI_GUIDELINES.md:21` e `QUALITY_WIKI.md:45` mandam `dart format .`, que o `CLAUDE.md` diz que quebra** — e que o próprio `.husky/pre-commit` nem executa. Quer corrigir os dois arquivos versionados, ou fica como está e a tripulação apenas ignora? (Não toquei em nada.)
7. **Scripts versionados usam `flutter` nu, sem `fvm` (Conflito #9)** — e sua memória registra que o symlink do fvm já apontou para a versão errada. Dívida conhecida e tolerada, ou vale abrir item para prefixar `fvm` em `.husky/pre-commit` e nos 3 scripts do `.specforce`?
8. **Existe bot de revisão no PR, ou o Jenkins já analisa?** Se sim, o `coder-reviewer` pode estar repetindo trabalho de graça — a `QUALITY_WIKI.md` sugere que o Jenkins roda o mesmo gate.
9. **`.specforce/docs/governance.md:18` nomeia "Allan Salles" como Owner** e exige aprovação dele para decisões Major e para dependência nova. Essa cadeia ainda se aplica, ou quem aprova agora é você? Afeta diretamente a regra de "escalar ao dev" da tripulação.
10. **`AGENT.md` vs `AGENTS.md`:** fundir, renomear ou deixar? Um caractere separa dois normativos diferentes na mesma pasta.
11. **Windsurf e Gemini ainda são usados por alguém no time?** Se não, `.windsurf/` é o único aparelho de IA **versionado** que sobrou e pode induzir outro dev a doutrina contrária à do `CLAUDE.md` (docstring em tudo, em inglês).
12. **Adotar o `Conflict Resolution Protocol` do `governance.md:39-43`** (recusar → citar o documento e a regra violada → propor alternativa → aguardar aprovação) como forma padrão do `software-engineer` escalar? É mais explícito que o "para e escala ao dev" atual, e é a convenção da casa.

**Fatia 05 — Fronteiras e risco**

2. **Allan Salles ainda é a autoridade de aprovação?** `.specforce/docs/governance.md:18` o nomeia Owner e exige aprovação dele para decisão Major, commit, push, PR e bump de versão. Dado que **o dev não faz mais parte da empresa que mantém este projeto**, presumo que toda aprovação dessas passe a ser **sua**. Confirma? Se sim, vale registrar isso em algum lugar, porque a régua comitada continua apontando para outra pessoa.
3. **Chat/WebSocket e upload de mídia entram no piso de severidade?** São as duas áreas com incidente registrado (três dos oito registros de `historico-correcoes/`) que **nenhuma regra escrita** inclui nas áreas sensíveis. Pela minha régua, histórico é a segunda evidência mais forte — mas impressão minha não basta e a lista canônica não as cita. Promover a MÉDIO-bloqueia?
4. **O `pre-commit` do husky é para valer, ou o manifesto do `CLAUDE.md` o substituiu na prática?** Ele checa menos que o manifesto (analyze permissivo, sem format), chama `flutter` fora do `fvm`, e `QUALITY_WIKI.md:27` descreve uma etapa de formatação que **não existe no script**. Se o husky está de fato inerte — e sem identidade git nada commita, então ele nunca dispara —, a tripulação deve tratá-lo como documentação histórica, não como gate.
7. **Geolocalização e foreground service estão na lista de áreas sensíveis mas praticamente sem teste** (nenhum arquivo de teste em `test/workers` ou `test/foreground_task`). Mexer ali exige verificação manual em dispositivo, ou há algum roteiro de QA que eu não encontrei?

**Fatia 06 — Classes de arquivo**

1. **`pubspec.lock` está mesmo fora do versionamento?** O `.gitignore` o lista duas vezes, e `ios/Podfile.lock` também. Se sim, nenhuma revisão deste projeto enxerga resolução de dependência transitiva num diff — foi decisão consciente, e a compensação é a regra de "dossiê para dependência nova" do `CLAUDE.md`?
2. **O vendorado `fonts/font_awesome_flutter` tem edição local proposital?** Não há registro em `README.md`, `docs/`, `AGENTS.md` nem `QUALITY_WIKI.md` (grep por `font_awesome|vendor|fork` não retornou nada). Se houver patch local, onde ele está anotado?
3. **Por que o manifesto raiz pede `font_awesome_flutter: ^10.12.0` se o `dependency_overrides` aponta para uma cópia que declara `version: 10.5.1`?** O override vence e o app roda 10.5.1; a constraint declarada nunca é satisfeita pelo que está no disco. Intencional?
4. **`lib/utils/env.g.dart` é versionado mas sua fonte (`.env`) não.** Ao revisar um diff que mexe nele, contra o que se confere — só `lib/utils/env.dart` e `.env.exemple`? Ou existe um `.env` canônico fora do repo (cofre, CI) que é a verdade?
5. **A exclusão de `lib/firebase_options.dart` no semgrep existe no `.husky/pre-commit` mas não no `quality/entrypoint.sh`** (Docker/Jenkins). Divergência intencional, ou o pre-commit local silencia um achado que o pipeline ainda levanta?
6. **Existe caminho que o time trata como "não revisar" sem nada declarar?** `android/` e `ios/` são excluídos do SAST nos dois pipelines, e `fonts/**` do analyzer — isso é "não revisar" na prática, ou só "não escanear automaticamente"?
7. **Os dois arquivos de 135 mil linhas do vendorado não se anunciam como gerados.** Quem entra novo no projeto tem como saber disso, ou é conhecimento tácito?

---

## Ponteiro pronto para o dev colar

**Alvo único: `CLAUDE.md` na raiz** (gitignorado — preserva a pegada zero). **Eu não colei nada.**
Não colar em `AGENTS.md` (gerido pelo Specforce, cercado por marcadores `SPECFORCE_AGENTS_*`),
nem em `AGENT.md` / `docs/AI_GUIDELINES.md` / `QUALITY_WIKI.md` / `.windsurf/` (**versionados** —
vazariam o método para o repositório da empresa).

```markdown
## Pacote de desenvolvimento

O método de planejamento e revisão usado neste projeto mora **fora do repositório**, em
`C:\Users\thoma\Documents\my_cave\crew`. Nada dele é comitado aqui.

- **Método e papéis:** `metodo/` — comece por `LEIA-ME.md`.
- **Ficha deste projeto:** `projetos/veniti_mobile_app/indice.md` — os fatos operacionais
  (comandos de verificação, convenção de teste, áreas sensíveis, quem comita). **Leia antes de
  implementar; não a adivinhe.**
- **Roadmaps:** `docs/roadmap/` (no próprio repositório).

Regra de precedência: este documento e os normativos do projeto **vencem** o método em caso de
conflito. O método agrega processo; ele não substitui a convenção daqui.
```

**Se — e só se — o dev decidir que o time herda o método**, dois toques versionados, em commit
próprio dele: (1) três linhas em `AGENTS.md` **abaixo da linha 64** (fora dos marcadores);
(2) uma linha de **precedência explícita** em `AGENT.md`, que já se declara precedente sobre
workflows gerais, resolvendo os Conflitos #1, #2 e #8.

---

## Fatias

| # | Fatia | Arquivo | Estado |
|---|---|---|---|
| 00 | Perímetro | `ficha/00-perimetro.md` | entregue — teto 10/10 · sem git |
| 01 | Manifesto e sensores | `ficha/01-manifesto-e-sensores.md` | entregue — teto 15/15 · sem git · nada executado |
| 02 | Testes | `ficha/02-testes.md` | entregue — teto 12/12 · sem git · suíte não rodada |
| 03 | Padrões e decisões | `ficha/03-padroes-e-decisoes.md` | entregue — teto 10/12 · sem git |
| 04 | Aparelho de IA existente | `ficha/04-aparelho-de-ia.md` | entregue — **duas passadas** de 12/12 · sem git |
| 05 | Fronteiras e risco | `ficha/05-fronteiras-e-risco.md` | entregue — teto 12/12 · sem git |
| 06 | Classes de arquivo | `ficha/06-classes-de-arquivo.md` | entregue — teto 8/8 · sem git |
| 07 | Consolidação | este arquivo (`indice.md`) | entregue — **sem abrir o projeto**; universo = as 7 fatias |
