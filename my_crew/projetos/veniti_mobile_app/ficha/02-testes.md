# Ficha — 02. Testes

> Levantado em 2026-09-14 · fontes citadas por linha · teto de leitura: 12 arquivos (12 usados)
> Projeto: `C:\Users\thoma\StudioProjects\veniti_mobile_app` · slug `veniti_mobile_app`
> ⛔ Execução feita **sem nenhum comando git** (restrição do dev). Onde o método pede `git log -1`,
> usei `mtime` — e ele mentiu; ver *Não coberto*.
> ⛔ A suíte **não** foi executada. O comando está registrado, o resultado não.

## Já em contexto (não relido)

- `CLAUDE.md` (instruções de projeto, carregado pelo harness) — ferramental declarado
  (`flutter_test` + `mocktail` + `bloc_test` + `sqflite_common_ffi`); manifesto de qualidade
  (`fvm dart format --output=none --set-exit-if-changed lib test` ·
  `fvm flutter analyze --fatal-infos --fatal-warnings` · `fvm flutter test`); o aviso de que
  `dart format .` na raiz quebra; a afirmação "~400 testes em `test/`" (**desatualizada** — ver *Volume real*).
- `MEMORY.md` (auto-memória do usuário) — identificadores em inglês, comentários/UI em pt-BR;
  "sem operações git"; DoD antes dos inspetores. Nada mais específico de teste.
- Snapshot de `git status` do despacho — **usado como proxy de recência no lugar de `git log`**: os
  commits do topo do branch tocam `user-list` (lista vazia), `alerts`, `search/users` e
  `search/professionals/{attendanceId}`.
- Fatos repassados pela fatia 01 — 342 `.dart` em `lib/`, 60 em `test/` (58 `*_test.dart`),
  Flutter 3.44.8 via fvm, `fonts/font_awesome_flutter/` é fork vendorado (fora do escopo de teste).

**Os 12 arquivos do teto:** `test/interface/api_test_helpers.dart` · `test/helpers/db_test_setup.dart` ·
`test/interface/professional_api_test.dart` ·
`test/ui/manage_professional_users/delete_user/delete_user_cubit_test.dart` ·
`test/ui/tasks/widgets/professional_list_test.dart` ·
`test/ui/manage_professional_users/user_list/user_management_list_test.dart` ·
`test/ui/checklist/checklist_attached/use_cases/checklist_attached_use_cases_test.dart` ·
`pubspec.yaml` · `docs/roadmap/endpoints-residuais-v2/_TEMPLATE/quality.md` · `QUALITY_WIKI.md` (grep) ·
`docs/AI_GUIDELINES.md` (grep) · `.husky/pre-commit` (grep).

---

## Convenção

- **Framework / runner:** `flutter_test` (SDK) + `bloc_test ^10.0.0` + `sqflite_common_ffi ^2.3.3`;
  dublês com `mocktail ^1.0.4`. · Fonte: `pubspec.yaml` `dev_dependencies` + `pubspec.yaml:102`;
  `grep -rh "^import" test | sort | uniq -c` → 59× `flutter_test`, 16× `mocktail`, 4× `bloc_test`.
  ⚠️ **`mocktail` está em `dependencies`, não em `dev_dependencies`** (`pubspec.yaml:102`, no meio do
  bloco de produção, entre `calendar_date_picker2` e `envied`). Registro como é — ver *Perguntas ao dev*.
- **Comando da suíte:** `fvm flutter test`. · Fonte: `CLAUDE.md` (contexto);
  `docs/roadmap/endpoints-residuais-v2/_TEMPLATE/quality.md:67-69`; `.husky/pre-commit:44`.
- **Configuração do runner:** **NÃO ENCONTRADO** — procurei com
  `find . -name "dart_test*" -not -path "./build/*"` e `find . -name "flutter_test_config.dart"`:
  zero resultados. Sem `dart_test.yaml`, sem tags, sem `flutter_test_config.dart`, **sem setup global
  automático**. Todo setup é explícito no `main()` de cada arquivo.
- **Local:** **árvore espelho** em `test/`, refletindo `lib/` até o subnível de feature. Ex.:
  `lib/ui/manage_professional_users/delete_user/use_case/` ↔
  `test/ui/manage_professional_users/delete_user/use_case/`. · Fonte: `find test -type d` (38 diretórios);
  a regra está escrita em `_TEMPLATE/quality.md:46` ("`test/` espelha `lib/`").
  Única exceção: `test/helpers/` não espelha nada — é diretório só de auxiliar.
- **Nome:** `<unidade>_test.dart`, **um arquivo por unidade** (API/cubit/use case/widget), não por feature.
  Auxiliares deliberadamente **sem** o sufixo, para ficarem fora da coleta do runner
  (`api_test_helpers.dart`, `db_test_setup.dart`). · Fonte: listagem de `test/` — 58 de 60 com `_test`.
- **Estilo de asserção:** `expect(actual, matcher)` do `flutter_test`, **vários `expect` por caso** é
  normal (`professional_api_test.dart:87-93`, `:132-144`). Nos cubits, o idioma é
  `isA<State>().having((s) => s.campo, 'campo', valor)` encadeado (`delete_user_cubit_test.dart:61-71`).
  `verify(() => ...).called(1)` aparece em **10** arquivos
  (`grep -rc "verify(" test --include=*_test.dart | grep -v ":0" | wc -l`) — é marca da camada de use case,
  não da de API. `group()` organiza por método público / endpoint
  (`professional_api_test.dart:85`, `:147`).
- **Idioma dos nomes de caso:** **pt-BR, descrevendo comportamento** é o padrão dominante
  ("200 com distance 0 e duration 0 preserva os zeros"; "429 emite failure com o texto de rate limit").
  Sobrevive resíduo legado em inglês ("should return 0 when repository throws an exception").
  Coerente com a regra do projeto: identificador em inglês, **texto** em pt-BR.
  · Fonte: amostra de 30 nomes via `grep -rhoE "(group|test|testWidgets|blocTest<[^>]*>)\(\s*'[^']{5,70}'"`.
- **Comentário do porquê:** nos arquivos recentes, quase todo caso não óbvio carrega um comentário em
  pt-BR explicando **qual regressão ele tranca** — não o que a linha faz
  (`professional_api_test.dart:86`, `:101`, `:121`, `:172`; `delete_user_cubit_test.dart:84-85`,
  `:108-113`, `:132-134`; `professional_list_test.dart:97-98`, `:121-122`). É o traço estilístico mais
  visível da suíte recente.
- **Binding:** `TestWidgetsFlutterBinding.ensureInitialized()` na primeira linha do `main()` sempre que o
  teste toca method channel ou SharedPreferences (`professional_api_test.dart:18`,
  `professional_list_test.dart:18`, `user_management_list_test.dart:14`).
- **Volume real:** ~**653** blocos executáveis — 596 `test(`, 33 `blocTest`, 24 `testWidgets` —, mais os
  gerados dentro de loop (`delete_user_cubit_test.dart:159-183` produz 4 de um `for`).
  · Fonte: `grep -rhoE "^\s*(test|testWidgets|blocTest)" test --include=*_test.dart | sort | uniq -c`.
  Contagem **estática**, não conferida contra execução. A "~400" do `CLAUDE.md` está defasada para baixo.

### Camadas com estilo distinto (são cinco, e diferem de verdade)

| Camada | Estilo | Dublê | Fonte |
|---|---|---|---|
| `test/interface/` (API REST) | classes **estáticas** exercitadas de fora; asserção sobre **path, header e corpo** da requisição capturada, não só sobre o retorno | `FakeHttpClient` (p/ `http`) e `FakeHttpClientAdapter` (p/ o `Dio` do `GoApiClient`) — **sem mocktail** | `professional_api_test.dart:74-93` |
| `test/ui/**/cubit`, `test/blocs/cubits/` | `blocTest<Cubit, State>` com `build`/`setUp`/`act`/`expect`; `seed:` para partir de estado intermediário; `skip: 1` para pular o `loading` | `mocktail` mockando o **use case** | `delete_user_cubit_test.dart:45-73`, `:114-130` |
| `test/ui/**/use_case/` | `test()` puro, arrange-act-assert curto, fechando com `verify(...).called(1)` | `mocktail` mockando o **repository** | `checklist_attached_use_cases_test.dart:19-32` |
| `test/ui/**` (widget) | `testWidgets` + helper `pump*` local; **dois sub-estilos**, ver abaixo | adapter fake de `Dio`, ou nenhum | `professional_list_test.dart:46-77`; `user_management_list_test.dart:19-37` |
| `test/database/` | SQLite **real em memória** via FFI, banco novo por teste | `sqflite_common_ffi` | `test/helpers/db_test_setup.dart:8-25` |

**Os dois sub-estilos de widget test** (ambos vivos, escolha por autor — ver *Perguntas ao dev*):
- **Atravessando a pilha:** monta o widget de verdade, deixa o cubit interno buscar, e responde pelo
  adapter fake de `Dio`; `pumpAndSettle()`. Cobre a renderização E o parse.
  `professional_list_test.dart:23-55`.
- **Estado semeado:** monta `MultiBlocProvider` com o cubit já em `loaded`, um `tester.pump()`, nunca
  toca API. `user_management_list_test.dart:19-37`.

### A armadilha que o próprio projeto documentou

`http.runWithClient` (usado em 10 arquivos) **não intercepta o `Dio` do `GoApiClient`**. Quem testa
endpoint v2 tem de trocar `GoApiClient.i.dio.httpClientAdapter` no `setUp` e **restaurar no `tearDown`**
— singleton global, senão vaza para o próximo arquivo.
Fonte: `_TEMPLATE/quality.md:47-49` (comentário normativo, em letras maiúsculas: "o `http.runWithClient`
NÃO intercepta o dio do `GoApiClient`"); padrão em `professional_api_test.dart:74-83` e
`professional_list_test.dart:23-34`. Já são **18** arquivos usando `httpClientAdapter`
(`grep -rl "httpClientAdapter" test --include=*.dart | wc -l`).

---

## Auxiliares disponíveis

| Auxiliar | Onde | Para quê |
|---|---|---|
| `setUpApiTestMocks()` | `test/interface/api_test_helpers.dart:180-278` | Uma chamada arma SharedPreferences (token `mocked_token` já válido, `user_logged: true`), `PackageInfo` e **5 method channels**: path_provider, flutter_broadcast_receiver, geolocator, device_info, battery. Devolve um `FakeHttpClient` limpo. Usado por **20** arquivos, inclusive fora de `test/interface/` (`grep -rl api_test_helpers test`) |
| `FakeHttpClient` | `test/interface/api_test_helpers.dart:126-175` | `http.BaseClient` fake: já roteia `/login`, `/reconnect`, `/oauth/token`, `/logout`, `/alerts` com respostas canônicas; `response` / `errorToThrow` configuráveis; captura `lastRequest` / `lastBody` para assertar rota e corpo |
| `FakeHttpClientAdapter` | `test/interface/api_test_helpers.dart:100-120` | `HttpClientAdapter` fake para o `Dio` do `GoApiClient` e para o Dio do S3. `responsePayload` fixo **ou** `router` por `RequestOptions` (quando vários endpoints passam pelo mesmo Dio); guarda tudo em `requests` / `lastRequest` |
| `DummyDatabase` | `test/interface/api_test_helpers.dart:13-93` | `Database` fake (tudo vazio/`0`) para não abrir o SQLite real; `noSuchMethod` responde `isOpen: true` |
| `initFfiDatabaseFactory()` | `test/helpers/db_test_setup.dart:8-11` | Troca o `databaseFactory` pelo FFI no `setUpAll` — sem isso não há sqflite no test VM |
| `openInMemoryDatabase({onCreate, version})` | `test/helpers/db_test_setup.dart:17-25` | Banco novo e vazio por teste (`inMemoryDatabasePath`); isolamento garantido. Usado por 3 arquivos (`db_ffi_smoke_test`, `notification_alert_helper_test`, `chat_message_strategy_test`) |
| Fábricas/closures locais | topo do `main()` de cada arquivo — ex. `professional_api_test.dart:24-72`, `professional_list_test.dart:36-87` | **Não existe factory/builder global.** O idioma é declarar closures no `main()`: `professionalJson()`, `searchExpectingSuccess()`, `searchExpectingFailure()`, `pumpSheet()`, `respondWith()`, `expectNoStrayEta()` |
| Sentinela `_absent` | `professional_api_test.dart:15`, `professional_list_test.dart:15` (const de arquivo) | Truque replicado nos dois: distinguir "chave ausente no JSON" de `0`/`null`, via `if (!identical(x, _absent))` no literal de mapa |
| Mocks | declarados **no próprio arquivo**: `class MockX extends Mock implements X {}` | 14 declarações distintas, todas de **use case** ou **repository** (`grep -rhoE "class (Mock\|Fake)\w+ extends \w+"`). Não há pasta de mocks, nem `mockito`, nem `build_runner` gerando dublê. `registerFallbackValue` no `setUpAll` em 7 arquivos |
| Fixtures em arquivo (JSON / golden) | **NÃO ENCONTRADO** | `find test -name "*.json" -o -name "fixture*" -o -name "mock*" -o -name "*factory*"` → zero; `find . -name "goldens" -o -name "*.golden"` → zero. **JSON é sempre literal Dart inline** |

---

## Testes de referência

Três, um por camada — escolhidos por representatividade da prática atual (todos ligados aos commits do
topo do branch), não por beleza.

### 1. `test/interface/professional_api_test.dart` — camada de interface/API. **Abra este primeiro.**

É a camada onde o trabalho está acontecendo (as migrações v1→v2 são o grosso dos roadmaps ativos) e a
mais densa da suíte: **17 dos 22** arquivos de `lib/interface/` têm teste. Exemplar porque:

- usa os dois auxiliares compartilhados no jeito canônico — `setUpApiTestMocks()` no `setUp` e troca do
  `GoApiClient.i.dio.httpClientAdapter` **com restauro no `tearDown`** (`:74-83`);
- fábricas locais tipadas em vez de JSON remontado caso a caso (`:24-72`), incluindo a sentinela
  `_absent` (`:15`) que separa "chave ausente" de `0` — a distinção que o item de roadmap existia para corrigir;
- **caminho de erro é maioria**: 400 `bad_request` sem `causes` (o campo opcional cuja leitura direta
  explodiria), 401 de middleware, 500 de banco (`:122-144`);
- cobre o **caminho de rollback** inteiro em `group` separado (`:147-187`), incluindo a esquisitice do
  legado: `204` **com corpo** é sucesso com lista vazia, não falha (`:173-178`);
- assere **contrato de transporte**, não só desserialização: path exato
  `/api/mobile/v2/search/professionals/4321` e header `Authorization: Bearer mocked_token` (`:91-92`, `:163-165`);
- comentários explicam por que o caso existe (`:86`, `:101`, `:121`, `:172`).

Recência: coberto pelo commit `ed7e67f4` (search/professionals) — antepenúltimo do branch (fonte: snapshot
de `git status` no contexto, não `git log`).

### 2. `test/ui/manage_professional_users/delete_user/delete_user_cubit_test.dart` — camada de estado (Cubit).

Referência do estilo `blocTest` + `mocktail`. Exemplar porque:

- traz o preâmbulo que todo cubit test do projeto repete: `registerFallbackValue` no `setUpAll` e builder
  `buildCubit()` (`:20-29`);
- usa `seed:` para partir de estado intermediário (`:138-142`, `:268-273`) e `skip: 1` quando o caso é
  sobre a falha e não sobre o `loading` (`:95`, `:123`);
- **cenários tabelados**: um `for (final scenario in <(String, int?)>[...])` gera 4 `blocTest` de
  `Retry-After` degenerado — ausente, `0`, negativo, absurdo (`:159-183`);
- assere **o que não deve acontecer**: janela de bloqueio não vaza para falha que não é 429 (`:187-214`);
  timestamp preservado no reenvio que falhou, senão o código na mão do usuário seria invalidado (`:135-155`);
  `user`/`timestamp` sobrevivem à falha da primeira chamada, senão a tela morre em null check (`:114-130`);
- mensagem de UI em pt-BR é asserida **literal** (`:102`, `:210`, `:258`) — a mensagem é contrato.

### 3. `test/ui/tasks/widgets/professional_list_test.dart` — camada de widget (sub-estilo "atravessa a pilha").

O widget test mais completo da suíte e o mais informativo sobre o padrão atual:

- monta o widget real e responde pelo adapter fake de `Dio`, com `pumpAndSettle()` (`:46-55`) — cobre
  parse **e** renderização de uma vez;
- prepara pré-condição de domínio no `setUp` (`UserPreferences.putString(userRole, '1')`, `:26`, porque a
  folha só busca profissionais para o master);
- **matriz de bordas completa**: 6 combinações de `distance`/`duration` (ausente, `0`, presente) mais a
  falha de API (`:89-149`);
- tem um **invariante reutilizado** — `expectNoStrayEta()` (`:81-87`) varre todos os `Text` da árvore e
  proíbe `'null min'` e `'0 min'` em **qualquer** cenário; é asserção negativa aplicada a toda a matriz;
- o caso de erro assere **a mensagem certa e a errada ao mesmo tempo** (`:137-149`): erro de API não pode
  virar "Não há profissionais conectados".

Para o sub-estilo leve (cubit semeado, sem API), a referência é
`test/ui/manage_professional_users/user_list/user_management_list_test.dart:19-57` — 57 linhas, helper
`pumpLoaded`, `find.text` + `findsNothing`, importando `setUpApiTestMocks` cruzando árvore
(`import '../../../interface/api_test_helpers.dart'`, `:11`). É o teste do commit mais recente do branch
(`0ea2335f`, lista vazia).

---

## O que o projeto NÃO testa (por convenção ou por omissão)

- **Nenhum teste de integração / E2E automatizado.** `ls integration_test` → não existe. A verificação
  ponta-a-ponta é **manual e roteirizada**: `docs/roadmap/endpoints-residuais-v2/ROTEIRO-QA.md` e o item
  `06-verificacao-e2e/` (listagem do diretório do roadmap).
- **Nenhum golden / screenshot test.** `find . -name "goldens" -o -name "*.golden"` → zero. A UI é
  verificada por `find.text` / `find.byType`, nunca por pixel.
- **Sem gate de cobertura.** O manifesto não tem `--coverage`; `QUALITY_WIKI.md` menciona teste em duas
  linhas apenas (`:30` "Execução de todos os testes unitários", `:47` "Corrija os testes quebrados antes
  de commitar").
- **Áreas de `lib/` com zero teste** (`find lib/<dir> -name "*.dart" | wc -l` vs diretório correspondente
  em `test/`): `workers` (4 arquivos → 0), `foreground_task` (3 → 0), `preferences` (2 → 0),
  `widgets` (3 → 0), `animations` (1 → 0).
  ⚠️ Ou seja: **background, foreground service e geolocalização — as áreas que o piso de severidade do
  projeto trata como sensíveis — não têm teste próprio.**
- **Distribuição da cobertura por diretório** (arquivos `.dart` em `lib/` → arquivos `*_test.dart` no
  diretório espelho): `interface` 22→17 · `core` 15→4 · `strategy` 13→4 · `database` 46→4 ·
  `services` 13→3 · `utils` 18→3 · `blocs` 56→2 · `extension` 6→1 · **`ui` 138→20**.
- **Suíte do gate de revisão fica fora da suíte padrão, de propósito:**
  `.claude/tool/review_pipeline_test.dart` roda à mão (`fvm flutter test .claude/tool/review_pipeline_test.dart`).
  Fonte: `CLAUDE.md` (contexto).
- **A regra escrita é curta:** "Every bugfix or new feature must be accompanied by unit or widget tests.
  Do not remove existing tests without a valid technical justification." (`docs/AI_GUIDELINES.md:35-36`).
  Todo o resto da régua está no `quality.md` de cada item de roadmap, não em documento global.

---

## Régua que o projeto aplica a teste novo (roadmap no formato de pasta)

Isto é o que os inspetores cobram — está escrito, não é folclore:

- Cada item comita, **antes do código**, uma seção "Testes obrigatórios" nomeando arquivo por arquivo e
  marcando **`Criar` (não existe)** ou **`Estender` (já existe)**, com o que cobrir: "caminho feliz, erros
  mapeados, ramos defensivos" (`_TEMPLATE/quality.md:43-57`).
- ⚠️ "**ANTES** de escrever 'Criar', confira no disco se o arquivo já existe (`ls test/<path>`) […]
  reescrever um arquivo de teste do zero **perde cobertura SEM deixar o manifesto vermelho**"
  (`_TEMPLATE/quality.md:51-52`).
- DoD: "Nenhuma asserção de teste pré-existente removida, renomeada para menos ou afrouxada"
  (`_TEMPLATE/quality.md:64`); "perda silenciosa de cobertura" é achado nominal do projeto (`:140`);
  "Um caminho crítico foi modificado sem nenhum teste cobrindo" é achado (`:151`).
- Quando o item quebra teste existente, o teste quebrado **entra na lista fechada de arquivos a tocar**
  (`_TEMPLATE/quality.md:53-55`) — e o item descreve nominalmente quais asserções sobrevivem
  (ex.: `03-search-professionals-distancia/quality.md:54`; `02-search-users/quality.md:42`).
- Onde há flag de rollback, o DoD exige: "Todos os testes novos passam, **nos dois estados da flag**"
  (`02-search-users/quality.md:95`; `03-.../quality.md:113`).
- Há itens que **contam** casos como critério objetivo: "`api_error_messages_test.dart` **cresceu**:
  contagem de `test(` maior que a da baseline" (`01-fundacao-flags-e-blindagem/quality.md:87`).

---

## Correspondência (para o índice)

| Diretriz | Desfecho | Instrumento do projeto | Fonte / Justificativa |
|---|---|---|---|
| Como se escreve teste | `PROJETO` | `flutter_test` + `bloc_test` + `mocktail` + `sqflite_common_ffi`; árvore espelho; sufixo `_test.dart`; nomes de caso em pt-BR; comentário do porquê | `pubspec.yaml`; `find test -type d`; `_TEMPLATE/quality.md:45-46`; referências acima |
| Onde mora o teste | `PROJETO` | espelho de `lib/` até o subnível de feature; auxiliares em `test/helpers/` e `test/interface/api_test_helpers.dart` | `find test -type d`; `_TEMPLATE/quality.md:46` |
| Dublês / mocks | `PROJETO` | `mocktail` inline nas camadas de cubit e use case; fakes escritos à mão na camada de interface (nunca mocktail lá) | `delete_user_cubit_test.dart:11`; `api_test_helpers.dart:100-175` |
| Fixture / factory de dados | `NATIVO` | não existe factory, builder nem fixture global — cada arquivo declara closures no `main()` | `find test -name "fixture*" -o -name "*factory*"` → zero |
| Banco em teste | `PROJETO` | `sqflite_common_ffi` em memória, banco novo por teste, via `test/helpers/db_test_setup.dart` | `db_test_setup.dart:8-25` |
| HTTP em teste | `PROJETO` | `FakeHttpClient` + `http.runWithClient` no legado; `FakeHttpClientAdapter` no `Dio` do `GoApiClient` (com restauro no `tearDown`) | `api_test_helpers.dart:100-175`; `_TEMPLATE/quality.md:47-49` |
| Comando da suíte | `PROJETO` | `fvm flutter test` (3ª etapa do manifesto) | `CLAUDE.md` (contexto); `_TEMPLATE/quality.md:67-69` |
| Configuração do runner | `NATIVO` | sem `dart_test.yaml` / `flutter_test_config.dart`; setup explícito por arquivo | `find . -name "dart_test*"` / `flutter_test_config.dart` → zero |
| Cobertura mínima | `NATIVO` | não há gate de cobertura; a régua é nominal por item (`quality.md` lista os arquivos e cenários) | manifesto sem `--coverage`; `_TEMPLATE/quality.md:43-57` |
| Proibição de afrouxar teste | `PROJETO` (piso alto) | DoD proíbe remover/renomear-para-menos/afrouxar asserção; reescrever arquivo de teste do zero é achado | `_TEMPLATE/quality.md:52`, `:64`, `:140`, `:151` |
| Teste de integração / golden | `NATIVO` | não existem; E2E é roteiro manual de QA | `ls integration_test` ausente; `ROTEIRO-QA.md` |
| Idioma dos nomes de caso | `COMPÕE` | regra do `CLAUDE.md` (identificador em inglês, texto em pt-BR) + prática observada (descrição do caso em pt-BR) somam sem se anular | `CLAUDE.md` (contexto) + amostra de nomes |
| Rigor do `analyze` sobre `test/` | `COMPÕE` (**piso = o mais rígido**) | husky roda `flutter analyze --no-fatal-warnings --no-fatal-infos` (`.husky/pre-commit:32`); o manifesto roda `--fatal-infos --fatal-warnings`. Compõe pelo **manifesto**: teste que só passa no husky reprova o gate | `.husky/pre-commit:32`, `:44`; `CLAUDE.md` (contexto) |
| Formatação do código de teste | `PROJETO` | `dart format --set-exit-if-changed lib test` — teste mal formatado **reprova o manifesto** | `_TEMPLATE/quality.md:67-69`; `CLAUDE.md` (contexto) |

---

## Não coberto

- **Recência real dos arquivos: não apurada.** `git` é proibido nesta execução e o `mtime` mentiu como
  previsto: **30 dos 60** arquivos carregam o carimbo idêntico `2026-08-20 20:14:01` — assinatura de
  checkout, não de edição —, e é justamente a faixa mais nova que fica embaralhada. Os buckets
  `2026-08-20 16:07`, `2026-08-19`, `2026-08-11`, `2026-08-05` e `2026-06-09` parecem preservados, mas
  não dá para confiar neles como "última edição". Usei como proxy os commits do topo do branch que já
  vieram no contexto. **Para confirmar, o dev roda `git log -1 --format=%cd -- <path>`.**
- **`test/interface/info_api_test.dart` (22 KB)** — não aberto. O `_TEMPLATE/quality.md:47-49` o aponta
  como **o** padrão canônico do adapter fake de `Dio`. Valeria abrir: se divergir do
  `professional_api_test.dart`, é ele que o template manda seguir.
- **`test/ui/tasks/task_detail/cubit/task_detail_cubit_test.dart` (27 KB)** e
  **`test/interface/authentication_api_test.dart` (32 KB)** — os dois maiores da suíte. Valeria abrir:
  em arquivo desse porte costuma morar convenção de organização (sub-`group`, helpers de arquivo) que os
  pequenos não mostram.
- **`test/database/helper/notification_alert_helper_test.dart`** — único consumidor real de
  `openInMemoryDatabase` com schema. Valeria abrir antes de escrever qualquer teste que toque SQLite ou migração.
- **`test/core/api/api_error_messages_test.dart` (17 KB)** — o roadmap o trata como régua dos slugs de
  erro e **proíbe reescrevê-lo** (`01-fundacao-flags-e-blindagem/quality.md:110`). Valeria abrir antes de
  mexer em mensagem de erro.
- **Resultado da suíte** — proibido rodar. Comando registrado: `fvm flutter test`. A contagem de ~653
  casos é **estática** (grep), não medição.
- **`QUALITY_WIKI.md` e `docs/AI_GUIDELINES.md` foram lidos só por grep** das linhas com "test"/"cobertura".
  Pode haver convenção em prosa fora dessas linhas — em `QUALITY_WIKI.md` o risco é baixo (2 ocorrências),
  em `AI_GUIDELINES.md` não medi o total.
- **Os seis roadmaps legados** (formato de arquivo único, sem `quality.md`) não foram inspecionados.
  Se há convenção de teste registrada neles, ficou de fora.
- **`analysis_options.yaml`** não foi inspecionado (é fatia de lint/manifesto). Só registro o efeito
  colateral: o manifesto analisa e formata `lib test` juntos, então lint em teste reprova o gate.

---

## Perguntas ao dev

1. **O padrão que levantei é o desejado, ou só o recente?** As três referências vêm do lote de 2026-08,
   produzidas por itens de roadmap que escreveram "Testes obrigatórios" antes do código. Os arquivos mais
   antigos são ordens de grandeza menores (`checklist_photos_item_cubit_test.dart`, 751 B;
   `checklist_detail_cubit_test.dart`, 853 B). O piso para teste **novo** é o padrão recente
   (erro primeiro, matriz de bordas, comentário do porquê), ou o histórico ainda é aceitável?
2. **`mocktail: ^1.0.4` está em `dependencies`, não em `dev_dependencies`** (`pubspec.yaml:102`).
   É intencional (algum uso em `lib/`?) ou dívida? Importa para a regra "dependência nova exige dossiê":
   mover de seção mexe no `pubspec.yaml` e cairia nessa regra.
3. **Áreas sensíveis sem teste nenhum** — `workers`, `foreground_task`, `preferences`, `widgets`: decisão
   consciente (difícil sem device) ou vão a fechar? A resposta muda o que o revisor pode exigir de um item
   que toque foreground service ou geolocalização.
4. **Fábrica de dados de teste:** hoje `User(1, 'Nome', 'user', 'a@b.com', 1, '', '', '', 0, 0, 0)` —
   construtor posicional de 11 argumentos — é remontado à mão, e cada teste de API tem seu `xJson()` local.
   Um `test/helpers/model_factories.dart` seria bem-vindo, ou bate de frente com "não abstrair
   prematuramente / não criar helper para uso único"?
5. **Widget test: qual dos dois sub-estilos vale para código novo?** Atravessar a pilha com adapter fake
   (`professional_list_test.dart`) ou semear o cubit no estado terminal (`user_management_list_test.dart`)?
   Há regra, ou é escolha caso a caso?
6. **Nome de caso de teste conta como "texto" (pt-BR) ou como "identificador" (inglês)?** A prática é
   pt-BR com resíduo legado em inglês. Confirmar, para a revisão parar de julgar pelos dois critérios.
7. **Quem mantém `api_test_helpers.dart`?** Ele já arma 5 method channels e é importado por 20 arquivos —
   cada plugin novo com channel exige editá-lo, e um erro ali derruba um terço da suíte. Alterá-lo dentro
   de um item de roadmap é permitido, ou é sempre commit próprio (como o `quality.md`)?
8. **Divergência de rigor no `analyze`:** husky roda `--no-fatal-warnings --no-fatal-infos`
   (`.husky/pre-commit:32`), o manifesto roda `--fatal-infos --fatal-warnings`. Confirmo que o piso é o
   manifesto (mais rígido) e que o husky é só rede de segurança mais frouxa?
9. **O E2E é 100% manual** (`ROTEIRO-QA.md`, item `06-verificacao-e2e`). Quem executa, contra qual
   ambiente, e é pré-requisito da entrega, ou roda depois em lote?
10. **Existe convenção não escrita cobrada em revisão** que não dá para ver nos arquivos? (limite de
    `expect` por caso, proibição de dublê em alguma camada, obrigatoriedade do comentário-do-porquê,
    exigência de assertar rota+header e não só o corpo)
