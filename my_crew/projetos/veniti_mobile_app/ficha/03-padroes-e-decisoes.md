# Ficha — 03. Padrões e decisões

> Levantado em 2026-09-14 · fontes citadas por linha · teto de leitura: 12 arquivos (10 usados)
>
> ⛔ **Restrição desta execução:** nenhum comando `git`. Onde a resposta só viria de git, a linha
> diz isso explicitamente.

## Já em contexto (não relido)

- `CLAUDE.md` (raiz do projeto) — é de longe o documento mais denso e o mais normativo. Responde:
  convenções de desenvolvimento, idioma, arquitetura por camadas, manifesto de qualidade,
  tripulação de revisão, piso de severidade, formato dos roadmaps, regra de não-commit.
- `C:\Users\thoma\.claude\projects\C--Users-thoma-StudioProjects-veniti-mobile-app\memory\MEMORY.md`
  — índice de memórias do dev. Responde: idioma de identificadores, proibição de operações git,
  convenção de `docs/historico-correcoes/`, regra de retrocompatibilidade de API, DoD antes dos
  inspetores.

⚠️ Nenhum dos dois foi relido do disco. Toda linha abaixo marcada `contexto` vem daí.

---

## Documentos normativos

| Documento | Cobre | Imperativo? | Estado | Fonte |
|---|---|---|---|---|
| `CLAUDE.md` (raiz) | Convenções de dev, idioma, arquitetura, manifesto, tripulação de revisão, piso de severidade, formato de roadmap, proibição de commit | **Sim, forte** — "Sempre", "Não adicionar", "Nunca", "A SESSÃO NÃO RODA git add/commit/push" (caixa alta no original) | Vivo e mantido; é a referência que os outros documentos citam | `contexto` |
| `docs/AI_GUIDELINES.md` | Hooks Husky, quality gate do pre-commit, gestão de dependências, obrigação de teste por bugfix/feature | **Sim** — "DO NOT REMOVE", "DO NOT IGNORE", "DO NOT ATTEMPT", "must be accompanied by unit or widget tests" | ⚠️ **Vivo mas parcialmente superado** — ver *Conflitos normativos* abaixo | `docs/AI_GUIDELINES.md:9-11`, `:30`, `:35-36`, `:39` |
| `docs/roadmap/<tema>/README.md` (7 temas) | Decisões travadas, tensão central, regras normativas **daquele tema**, status dos itens | **Sim, mas de escopo limitado ao tema** — cada um se autodeclara "o documento normativo do tema" | Vivos. 6 legados (item em arquivo único), 1 no formato de pasta | `docs/roadmap/fotos-de-usuario/README.md:7`; `docs/roadmap/tratamento-erros-api/README.md:9`; `docs/roadmap/login-sessao-v2/README.md:15`; `docs/roadmap/atendimento-ciclo-vida-v2/README.md:15`; `docs/roadmap/checklist-endpoints-v2/README.md:15`; `docs/roadmap/endpoints-residuais-v2/README.md:18-21` |
| `docs/roadmap/<tema>/NN-slug/quality.md` | Escopo fechado, lista fechada de arquivos, orçamentos, testes obrigatórios, DoD, **classificação de achados**, gate de encerramento | **Sim — e é a régua que julga a entrega** | Vivo, **imutável por construção**: "Editá-lo de dentro da unidade que ele governa é achado **crítico** (forja de contrato)" | `docs/roadmap/endpoints-residuais-v2/_TEMPLATE/quality.md:3-8` |
| `docs/roadmap/retornos-schema.md` | Formato dos 3 arquivos de `retornos/`, máquina de estados dos achados, quem escreve o quê, gate de encerramento | **Sim** — "Cada agente escreve SOMENTE no próprio arquivo", "nunca reescrevendo o arquivo inteiro" | Vivo. **Cópia** da skill `roadmap-driven-development` feita no bootstrap | `docs/roadmap/retornos-schema.md:3-8`, `:24-37` |
| `docs/historico-correcoes/README.md` | 8 padrões recorrentes de código + convenção para novas entradas | **Sim** — "Padrões recorrentes já estabelecidos (**não reinventar**) … devem ser reutilizados em código novo" | Vivo, 9 rodadas registradas (2026-06 a 2026-08) | `docs/historico-correcoes/README.md:25-27`, `:59-64` |
| `docs/orientacoes_implementacao/*.md` (13 arquivos) | Contratos de API do backend (handoff), dúvidas e respostas por frente de migração | **Sim, dentro do roadmap que os cita** — o README do tema manda "ler **inteiro** antes de qualquer item" | Vivos, mas ⚠️ **a cópia local do handoff misc está DESATUALIZADA** e o README declara qual fonte vence | `docs/roadmap/endpoints-residuais-v2/README.md:25-42` |
| `QUALITY_WIKI.md` | Ferramentas do pipeline (Husky, Semgrep, Docker/Jenkins), setup local | **Majoritariamente descritivo**, com um imperativo fraco ("Corrija os testes quebrados antes de commitar") | ⚠️ **Desatualizado num ponto** — ver *Conflitos normativos* | `QUALITY_WIKI.md:25-30`, `:42-47`, `:50` |
| `docs/sugestao_melhoria_arquitetura.md` | — | **Não** | ⚠️ **ARQUIVO VAZIO (0 linhas)**, apesar de o `CLAUDE.md` listá-lo em "Documentação Adicional" | `wc -l` → `0 docs/sugestao_melhoria_arquitetura.md` |
| `docs/sugestao_melhoria_tecnologias_e_processos.md` | — | **Não** | ⚠️ **ARQUIVO VAZIO (0 linhas)**. Além disso o `CLAUDE.md` o cita com o nome errado (`..._tecnologias_processos.md`, sem o `e_`) | `wc -l` → `0`; `ls docs/` |
| `README.md` (raiz, 80 linhas) | — | NÃO ABERTO — teto | — | `wc -l README.md` → 80 |
| `AGENT.md` (18), `AGENTS.md` (64), `GEMINI.md` (403) | Mandatos para agentes de IA (harnesses concorrentes) | NÃO ABERTOS — **pertencem à fatia 04 (aparelho de IA)** | — | `ls` da raiz |

### Conflitos normativos detectados (a tripulação precisa saber qual vence)

Dois documentos do repositório contradizem o `CLAUDE.md`. Pela regra de composição (**o piso nunca
desce**), em ambos os casos vence a versão mais estrita:

| # | O que o doc do projeto diz | O que o `CLAUDE.md` diz | Quem vence (piso não desce) |
|---|---|---|---|
| C-1 | `dart format .` — formatar a raiz inteira (`docs/AI_GUIDELINES.md:21`, `QUALITY_WIKI.md:27`, `:45`) | "`dart format .` na raiz **quebra** (varre `build/`) e formataria `fonts/` vendorado — use sempre os alvos `lib test`" (`contexto`) | **`CLAUDE.md`**. O comando do AI_GUIDELINES está factualmente quebrado neste repositório; não é escolha de rigor, é defeito de documento. Confirmado por `analysis_options.yaml:4-6`, que exclui `fonts/**` e `build/**` do *analyzer* — mas o `dart format` **não** lê esse exclude |
| C-2 | "Análise Estática: … **warnings são permitidos por enquanto**" (`QUALITY_WIKI.md:28`) | Manifesto roda `flutter analyze --fatal-infos --fatal-warnings` (`contexto`) | **`CLAUDE.md`** — piso mais alto. Warning **bloqueia**, e info também |

⚠️ Há ainda uma divergência de **superfície**, não de rigor: o `QUALITY_WIKI`/`AI_GUIDELINES`
descrevem um pre-commit com **4 etapas** (format, analyze, **semgrep SAST**, test), enquanto o
manifesto do `CLAUDE.md` tem **3** (sem semgrep). Não são o mesmo sensor — um é hook de git, o
outro é o gate da tripulação. Ver *Perguntas ao dev*.

---

## Regras já automatizadas

As mais confiáveis desta ficha: são executadas, não lembradas.

| Regra | Onde está codificada | Sensor que a executa | Observação |
|---|---|---|---|
| Conjunto de lints = **`flutter_lints` padrão, sem customização** | `analysis_options.yaml:1` — `include: package:flutter_lints/flutter.yaml` | `fvm flutter analyze --fatal-infos --fatal-warnings` | ⚠️ **Não há bloco `linter: rules:`, nenhuma regra ligada/desligada à mão, nenhuma fronteira de import, nenhuma restrição de dependência entre módulos.** O arquivo inteiro tem **6 linhas**. Toda a arquitetura em camadas do `CLAUDE.md` é **não-automatizada** |
| Exclusão de `fonts/**` e `build/**` da análise | `analysis_options.yaml:3-6` | `flutter analyze` | Só o *analyzer*. O `dart format` ignora esse exclude — origem do conflito C-1 |
| Formatação canônica de `lib/` e `test/` | — | `fvm dart format --output=none --set-exit-if-changed lib test` | `contexto`. Ordem de grandeza real, de um retorno de revisão: **400 arquivos** varridos (`04-alerts/retornos/coder-reviewer.json`, `meta.manifesto`) |
| Suíte de testes verde | — | `fvm flutter test` | `contexto`. Ordem de grandeza real: **671 testes** (mesma fonte) |
| Pre-commit: format + analyze + **semgrep (SAST)** + test | `.husky/` + seção `husky:` do `pubspec.yaml` | git hook (`core.hooksPath` → `.husky`) | `docs/AI_GUIDELINES.md:7-16`, `:20-26`; `QUALITY_WIKI.md:20-30`. ⚠️ **Não abri `.husky/` nem o `pubspec.yaml`** (teto) — não confirmei o conteúdo do hook |
| Réplica do pipeline Jenkins | `docker-compose.yml` | `docker-compose up --build quality-gate` | `QUALITY_WIKI.md:32-40` |
| Gate de revisão: bloqueia fim de turno sem 2 vereditos frescos; bloqueia `git add`/`commit`/`push` **sempre** | `.claude/tool/review_pipeline.dart` + hooks em `.claude/settings.json`, binário `.claude/bin/review_pipeline.exe` | hooks do Claude Code (~60 ms/chamada) | `contexto`. **Gitignorado — pegada zero no git.** Detalhes pertencem à fatia 04 |
| `set review approved` **roda o manifesto ele mesmo** e recusa registro vermelho | idem | idem | `contexto` — auto-relato é tratado como forjável |
| Veredito `APROVADO` é **derivável**, não declarado | `docs/roadmap/retornos-schema.md:70-73`; `_TEMPLATE/quality.md:290-292` | conferência contra os `itens` do próprio JSON | "Veredito que diverge do estado dos itens é auto-relato quebrado — e vale como tal" |

---

## Decisões travadas (não se re-decide)

**Não copio as tabelas** — elas são por tema e somam centenas de linhas. Registro **onde vivem** e
**qual é o padrão delas**, que é o que a tripulação precisa para achar a decisão certa.

### Onde vivem

Todo roadmap, sem exceção, tem uma seção `## Decisões de produto já travadas`:

| Tema | Seção em | Regras normativas em |
|---|---|---|
| `fotos-de-usuario` | `README.md:9` | `README.md:102` |
| `tratamento-erros-api` | `README.md:11` | `README.md:125` |
| `atendimento-ciclo-vida-v2` | `README.md:17` | `README.md:143` |
| `checklist-endpoints-v2` | `README.md:17` | `README.md:122` |
| `login-sessao-v2` | `README.md:33` | `README.md:179` |
| `usuario-telemetria-v2` | `README.md:74` | `README.md:285` |
| `endpoints-residuais-v2` | `README.md:44` | `README.md:230` |

(todos sob `docs/roadmap/<tema>/`; linhas de `grep -n "^## " docs/roadmap/*/README.md`)

### O padrão delas (uniforme nos 7)

1. **Formato**: tabela de 3 colunas `| Decisão | Valor | Observação |`, com a Observação carregando
   a justificativa técnica. `docs/roadmap/endpoints-residuais-v2/README.md:49-59`.
2. **Procedência datada e atribuída**: "Tomadas com o dev em **2026-08-19**".
   `docs/roadmap/endpoints-residuais-v2/README.md:46`.
3. **Cláusula de não-re-decisão, sempre presente e sempre com o mesmo desfecho**: "se houver motivo,
   **parar, perguntar ao dev e registrar a mudança nesta tabela**"
   (`endpoints-residuais-v2/README.md:46-47`; repetida como último item numerado das Regras
   normativas em `atendimento-ciclo-vida-v2/README.md:155`, `checklist-endpoints-v2/README.md:131`,
   `fotos-de-usuario/README.md:108`, `login-sessao-v2/README.md:196`,
   `endpoints-residuais-v2/README.md:249-250`).
4. **Escopo é o tema, não o projeto.** Cada README se autodeclara "o documento normativo **do
   tema**" e prevê a própria promoção a Skill se amadurecer
   (`fotos-de-usuario/README.md:7`; `endpoints-residuais-v2/README.md:18-21`).
   ⚠️ Consequência para a tripulação: **uma regra normativa de um roadmap não vale automaticamente
   fora dele**. Tratá-la como norma global é achado inventado.
5. **A decisão travada vale como dossiê de aprovação.** Quando a decisão registra aprovação
   explícita do dev, ela substitui o dossiê que o `CLAUDE.md` exige para elemento visual novo:
   "Aprovado explicitamente pelo dev — vale como o dossiê de elemento visual que o `CLAUDE.md`
   exige" (`endpoints-residuais-v2/README.md:52`); e o `delivery-inspector` é instruído a aceitar
   "a aprovação vale como dossiê quando está nas *Decisões travadas* do README — cite onde"
   (`_TEMPLATE/quality.md:195-198`).
6. **Uma nota do README pode ser declarada normativa por si**, fora da tabela: "Enquanto não
   chegar, **este aviso é normativo**" (`endpoints-residuais-v2/README.md:41-42`, sobre qual
   documento vence quando o handoff local diverge). Ou seja, procurar decisão travada **só** na
   tabela é insuficiente.
7. **Tipos recorrentes de decisão travada** (padrão observado, não lista exaustiva): mecanismo de
   rollback (flags compile-time em `lib/utils/const.dart` + patch Shorebird), tipo de retorno das
   funções de requisição (`ApiResult<T>`), cliente HTTP do caminho novo (`GoApiClient.i.run`),
   preservação dos caminhos v1 em métodos sufixados `…V1` marcados `@visibleForTesting`, política
   de dependência nova (quase sempre "**Nenhuma**"), e o que fica explicitamente fora de escopo.
   `endpoints-residuais-v2/README.md:51-59`.

### Uma decisão de escopo global que vale citar literalmente

| Decisão | Valor | Onde está registrada |
|---|---|---|
| Quem comita | **A sessão nunca comita.** "A SESSÃO NÃO RODA `git add`, `git commit` NEM `git push` — A ENTREGA TERMINA EM RELATÓRIO." Nem com o gate verde, nem "para facilitar" | `contexto` (`CLAUDE.md`, Tripulação de revisão); repetido em `endpoints-residuais-v2/README.md:145`; memória `no-git-operations.md` |
| Máximo de rodadas de revisão | **3**; sem convergir, parar e escalar ao dev | `contexto`; `_TEMPLATE/quality.md:37` |
| Retrocompatibilidade de contrato de API | Mudança é **aditiva**; campo antigo só sai com aval do mobile. Concretização: "Preservar `vehicle_liscense` com o typo" | memória `api-retrocompat-nunca-block-version.md` (`contexto`); `endpoints-residuais-v2/README.md:245-246` |
| Dependência nova | Exige **dossiê + aprovação explícita do dev**; sem isso é **achado crítico automático**. Vale para `pubspec.yaml` incl. `dev_dependencies` e `dependency_overrides`, Gradle e CocoaPods | `contexto`; `endpoints-residuais-v2/README.md:137-139`; `_TEMPLATE/quality.md:127-128` |
| Elemento visual / tela nova | Mesma regra de aprovação | `contexto`; `endpoints-residuais-v2/README.md:140-141` |
| `quality.md` é imutável de dentro da unidade | Editá-lo lá é **forja de contrato** = achado crítico. Emenda legítima: decisão do dev, em commit próprio, **antes** | `contexto`; `_TEMPLATE/quality.md:3-8` |
| Roadmaps legados não são migrados retroativamente | Itens em arquivo único `NN-slug.md` sem `quality.md` continuam válidos; só itens novos nascem em pasta | `contexto` |

---

## Implementação canônica de referência

A informação mais útil desta fatia. Os paths marcados ✅ foram **confirmados no disco** (`ls`); o
**conteúdo** deles não foi aberto (teto de leitura) — a descrição vem dos documentos que os citam.

| Espelho | Onde | O que exemplifica |
|---|---|---|
| **Template de item de roadmap** | ✅ `docs/roadmap/endpoints-residuais-v2/_TEMPLATE/{brief.md, quality.md}` | O formato canônico de item novo. "Use a pasta `_TEMPLATE/` para novos itens" (`endpoints-residuais-v2/README.md:297`) |
| **Roadmap canônico** | ✅ `docs/roadmap/endpoints-residuais-v2/` | O único no formato de pasta por item (`contexto`). Estrutura confirmada por `ls -R`: 7 itens `NN-slug/` com `brief.md` + `quality.md` + `retornos/` |
| **Camada de erro de API** | ✅ `lib/core/api/` — exatamente 4 arquivos: `api_result.dart`, `api_error.dart`, `api_error_messages.dart`, `go_api_client.dart` | Canônico para **toda** função de requisição nova: "Toda função de requisição retorna `ApiResult<T>`. Nada de `bool`/`http.Response` crus" e "**não** reinventar parsing de erro". `endpoints-residuais-v2/README.md:56`, `:160-161`, `:235-239`. Roadmap `tratamento-erros-api` = done |
| **Helpers de teste** | ✅ `test/interface/api_test_helpers.dart` (fakes de SharedPreferences/Database + `FakeHttpClient` para `http.runWithClient`) | Ponto de partida de teste de interface. `_TEMPLATE/quality.md:45-48` |
| **Teste com adapter fake de Dio** | ✅ `test/interface/info_api_test.dart` | O padrão para o caminho Go. ⚠️ Armadilha registrada: "o `http.runWithClient` **NÃO** intercepta o dio do `GoApiClient`". `_TEMPLATE/quality.md:47-49` |
| **Guard de ciclo de vida em Cubit** | `ChecklistAttachedCubit`, `ChecklistPhotosItemCubit` (paths não resolvidos) | Override central de `emit` com `if (isClosed) return; super.emit(state);` — uma vez, cobrindo todos os emits. `docs/historico-correcoes/README.md:29-32` |
| **Classificador de exceção de rede** | ✅ `lib/interface/network_exceptions.dart` → `isNetworkConnectivityException(Object)` | Único ponto de decisão "isto é falha de rede?". Cobre `HandshakeException` e `DioException`. `docs/historico-correcoes/README.md:35-40` |
| **Parse tolerante** | ✅ `lib/utils/parse_utils.dart` → `parseIntOrDefault` / `parseIntOrNull` | "nunca `int.parse`/cast cru em dados de API/DB". `docs/historico-correcoes/README.md:48-49` |
| **Re-inscrição de canal Pusher** | ✅ `lib/interface/web_socket_api.dart` | Re-`subscribe()` em `onConnectionEstablished`, nunca só após `connect()`. `docs/historico-correcoes/README.md:52-54` |
| **Carga inicial que distingue falha de rede de "já feito"** | `InitialTaskSyncService` + APIs de carga inicial em `task_api.dart` retornando `bool` (paths não resolvidos) | `docs/historico-correcoes/README.md:41-44` |
| **Serviço com cache/dedupe/teto de concorrência** | ✅ `lib/services/user_photo_service.dart` (cache em disco permanente, dedupe, teto de 3 downloads simultâneos, `_filenameOf` em `:208`) | `endpoints-residuais-v2/README.md:195-200` |
| **Retorno de revisão exemplar** | ✅ `docs/roadmap/endpoints-residuais-v2/04-alerts/retornos/coder-reviewer.json` | O melhor espelho de **como preencher `meta`**: `manifesto` com os 3 comandos e exit codes, `adequacao_de_teste` por **mutação mental nomeada** (inclusive uma mutação SOBREVIVENTE registrada como achado), `limite_da_revisao` enumerando arquivos lidos e não lidos |
| **Telas responsivas já migradas** | `login`, `intro_carousel`, `splash_screen`, `header_bar`, `footer_bar`, `task_card`, `location_request` | Espelho do padrão `context.sizes` / `context.isTablet` (`contexto`) |
| **Arquitetura por camadas** | `UI → Cubit → Service → Interface → Database/Preferences` | Descrita no `CLAUDE.md`; a única frase imperativa é "**Manter** o padrão Cubit + Service + Interface já estabelecido" (`contexto`). **Não automatizada** — ver *Regras já automatizadas* |

---

## Idioma

| Elemento | Idioma | Fonte |
|---|---|---|
| Identificadores de código (métodos, variáveis, classes, typedefs, parâmetros) | **Inglês** | `contexto` (`CLAUDE.md`, Convenções); `docs/roadmap/endpoints-residuais-v2/README.md:142`; `_TEMPLATE/quality.md:100-101`; memória `code-naming-english.md` |
| Comentários / docstrings | **pt-BR** | mesmas fontes |
| Textos de interface (UI) | **pt-BR** | mesmas fontes. Reforço: "Texto exibido ao usuário sai de `ApiErrorMessages.localize`" (`endpoints-residuais-v2/README.md:239`) |
| Mensagens de commit | **pt-BR na prática**, formato Conventional Commits `<tipo>(<escopo>): <descrição>` | ⚠️ **Não há norma escrita de idioma de commit.** O formato vem do `CLAUDE.md` ("Sugestão de mensagem de commit … `<tipo>(<escopo>): <descrição>`", `contexto`). O idioma pt-BR é inferido dos títulos de commit recentes visíveis no `gitStatus` da sessão (ex.: `fix(user-list): exibe 'Nenhum registro encontrado' quando a lista de usuários carrega vazia`) — **confirmar no histórico exigiria comando git, proibido nesta execução**. De todo modo a sessão nunca comita |
| Documentação em `docs/` e roadmaps | **pt-BR** | observado em 100% dos arquivos abertos |
| **Exceção documentada** | `docs/AI_GUIDELINES.md` está **inteiramente em inglês** | `docs/AI_GUIDELINES.md:1-39` |
| **Retornos da tripulação** (`retornos/*.json`) | **pt-BR na prática — mas NÃO normatizado** | ⚠️ Dois níveis distintos: <br>• **Chaves e enums: normatizados, em pt-BR** — `veredito`, `severidade`, `evidencia`, `cenario_de_falha`, `criterio_da_tabela`, `fora_do_escopo`, `criterios_de_pronto_tocados`; status `aberto`/`registrado`/`resolvido`/`recusa_aceita`/`debito`/`escalado`/`encerrado_pelo_dev`; engenheiro `corrigido`/`recusado`/`debito`/`escalado_ao_dev`. Únicos em caixa-alta inglesa-neutra: `"APROVADO"`/`"REPROVADO"`. `retornos-schema.md:41-67`, `:86-94`, `:127`. <br>• **Prosa: NÃO normatizada.** O schema não menciona idioma em lugar nenhum. **Verificado empiricamente**: um retorno real (`04-alerts/retornos/coder-reviewer.json`) traz `manifesto`, `adequacao_de_teste` e `limite_da_revisao` inteiramente em **pt-BR**. É prática consolidada, não regra escrita — **ver Perguntas ao dev** |

⚠️ Nota de composição: a regra de idioma tem uma válvula explícita — "Código legado em pt-BR **não
precisa ser renomeado em massa** — aplica-se a código novo e alterado" (`contexto`). Achado de
idioma em código **não tocado** pelo diff é inválido.

---

## Severidade / classificação de defeito do projeto

**O projeto tem escala própria, e ela é nominalmente idêntica à do método: CRÍTICO / ALTO / MÉDIO /
BAIXO.** Mapeamento 1:1, sem tradução necessária. O que muda são os **pisos** e os **critérios
acrescentados**.

### Onde a escala vive

Não num documento central: **na seção `CLASSIFICAÇÃO DE ACHADOS (OBRIGATÓRIO)` do `quality.md` de
cada item**, personalizada por item a partir do `_TEMPLATE/quality.md:81-236`. A instrução de
personalização é explícita e tem uma trava de sentido único:

> "Os inspetores leem SÓ esta pasta: **regra do `CLAUDE.md` que não estiver aqui NÃO EXISTE para
> eles.** A personalização só pode **SUBIR** um piso ou **ACRESCENTAR** critério — nunca rebaixar
> nem remover." — `_TEMPLATE/quality.md:84-87`

⚠️ Isto é a peça mais importante desta seção para a tripulação: o `quality.md` do item é a
**fronteira de conhecimento** dos inspetores. Norma de projeto que não foi copiada para lá não
gera achado.

### Piso de severidade (o que bloqueia)

- Só **CRÍTICO** e **ALTO** reprovam. `contexto`; `_TEMPLATE/quality.md:285-287`;
  `retornos-schema.md:141-147`.
- **MÉDIO bloqueia como ALTO em área sensível.** As sete áreas, literais: autenticação/sessão ·
  SQLite e migrações · permissões, platform channels, foreground service e geolocalização · ações
  FCM · assinatura e release · o próprio pipeline de revisão. `contexto`;
  `_TEMPLATE/quality.md:152-155`.
  O template exige nomear os **paths concretos** do item que caem nessas áreas, ou declarar
  explicitamente "este item não toca área sensível" — **apagar o bullet não é permitido**
  (`_TEMPLATE/quality.md:156-158`).
- **BAIXO nunca bloqueia e nunca gera rodada.** `_TEMPLATE/quality.md:160-167`.
- **`escalado` não dispara rodada, mas BLOQUEIA o fecho** do item até o dev responder.
  `_TEMPLATE/quality.md:288-289`; `retornos-schema.md:93`, `:145-146`.

### Anti-forra (regra explícita contra rebaixamento)

Aparece **três vezes** em documentos distintos, sempre com a mesma força:

- "Rebaixar severidade para caber no piso é **falha de revisão**." `contexto`.
- "O desempate vale para **dúvida genuína**. Rebaixar um achado cujo cenário você demonstrou, para
  caber num nível que não bloqueia, é falha de revisão." `_TEMPLATE/quality.md:175-176` e `:235-236`.

Contrapeso igualmente explícito, nos dois inspetores: "**Ausência de achados é um resultado válido
e desejável.** Seu trabalho não é encontrar o máximo de problemas, é verificar o escopo definido."
`_TEMPLATE/quality.md:114-116`, `:184-185`.

### Critérios que este projeto ACRESCENTA aos níveis genéricos

| Nível | Critério do projeto | Fonte |
|---|---|---|
| CRÍTICO (`coder-reviewer`) | Dependência nova (`pubspec.yaml` incl. `dev_dependencies`/`dependency_overrides`, Gradle, CocoaPods) sem dossiê e aprovação explícita do dev | `_TEMPLATE/quality.md:127-128` |
| CRÍTICO (`delivery-inspector`) | Qualquer **arquivo tocado fora da lista fechada** de *Arquivos a tocar*; dependência nova sem dossiê; **tela/elemento visual novo** sem aprovação registrada | `_TEMPLATE/quality.md:195-198`, `:29` |
| CRÍTICO (implícito, do `CLAUDE.md`) | Editar o `quality.md` de dentro da unidade que ele governa (**forja de contrato**) | `contexto`; `_TEMPLATE/quality.md:3-8` |
| ALTO (`coder-reviewer`) | **Perda silenciosa de cobertura** — asserção de teste pré-existente removida, renomeada para menos ou afrouxada. "O manifesto continua verde e nada acusa" | `_TEMPLATE/quality.md:140-141` |
| ALTO (`delivery-inspector`) | Teste obrigatório da régua ausente; `depende_de`/`bloqueia` que não fecham nos dois sentidos; **frontmatter (`status`, `commit`) ou tabela "Status atual" do README não atualizados** | `_TEMPLATE/quality.md:209-211`; memória `dod-bookkeeping-antes-dos-inspetores.md` |
| BAIXO | Idioma (identificadores/comentários/UI) — **salvo texto exibido ao usuário fora do padrão** | `_TEMPLATE/quality.md:100-101` |

### Validade de achado (as três âncoras)

Um achado só existe se apontar três coisas — e os dois inspetores têm âncoras **diferentes**:

- `coder-reviewer`: (1) arquivo e linha, (2) **o critério da tabela** que viola, (3) o cenário
  concreto de falha. Faltou um → rebaixa para BAIXO ou descarta. `_TEMPLATE/quality.md:111-116`.
- `delivery-inspector`: (1) **o trecho exato da régua** (`quality.md` ou `brief.md`), (2) a
  evidência no código entregue, (3) a distância entre pedido e entregue. "Achado sem referência à
  régua NÃO é achado". `_TEMPLATE/quality.md:181-185`. O campo `ref_brief` é **obrigatório** para
  ele e opcional para o `coder-reviewer` (`retornos-schema.md:79-80`).

### Máquina de estados dos achados (completa)

| Status | Quem escreve | Quando | Bloqueia? |
|---|---|---|---|
| `aberto` | inspetor, ao criar | CRÍTICO/ALTO/MÉDIO nascem assim | só CRÍTICO/ALTO dispara rodada |
| `registrado` | inspetor, ao criar | BAIXO nasce assim — **terminal**; o engenheiro não é obrigado a responder | não |
| `resolvido` | inspetor, rodada seguinte | verificou o diff da correção e ela resolve | não |
| `recusa_aceita` | inspetor, rodada seguinte | o engenheiro recusou com `fundamento`, e o fundamento convence | não |
| `debito` | inspetor, rodada seguinte | MÉDIO que o engenheiro registrou como débito; aceito | não |
| `escalado` | inspetor, rodada seguinte | espelha `escalado_ao_dev`, OU impasse (2ª reprovação / recusa não aceita) | **bloqueia o fecho**, sem gerar rodada |
| `encerrado_pelo_dev` | **sessão principal**, com a resposta do dev | terminal; a decisão do dev vai em `nota_verificacao` | não |

`retornos-schema.md:86-94`. **Toda mudança de status preenche `nota_verificacao`; manter `aberto`
numa rodada de verificação também exige** (`retornos-schema.md:96-98`).

Do lado do engenheiro (`software-engineer.json`, `retornos-schema.md:100-139`): status
`corrigido` | `recusado` | `debito` | `escalado_ao_dev`; **uma entrada por achado** (`origem_id`
singular — uma correção que resolve dois achados vira duas entradas); `fundamento` **obrigatório**
em `recusado` e `debito` ("recusa sem fundamento citável é recusa por conveniência");
`pergunta_ao_dev` **obrigatória** em `escalado_ao_dev`; `arquivos_tocados` vazio quando `recusado`
ou `escalado_ao_dev`.

⚠️ Armadilha de protocolo: **`criterios_de_pronto_tocados: []` é afirmação explícita ("nenhum");
campo AUSENTE é entrega incompleta e nunca vale como `[]`** — quem despacha a rodada seguinte
exige o campo antes de prosseguir (`retornos-schema.md:134-138`).

### Escopo por rodada

- **Rodada 1** analisa tudo: "A primeira rodada é a que importa". `_TEMPLATE/quality.md:246-250`.
- **Rodadas seguintes**: exclusivamente (a) os achados próprios com status `aberto` e (b)
  **somente o diff da correção**. Achado novo só é admissível dentro desse diff.
  `_TEMPLATE/quality.md:252-262`.
- Problema pré-existente notado agora → array `fora_do_escopo`: não bloqueia, não gera iteração.
  `_TEMPLATE/quality.md:263-264`; `retornos-schema.md:81-82`.
- **O `delivery-inspector` só volta** se tiver achado `aberto` **ou** se
  `criterios_de_pronto_tocados` não veio `[]`. O `coder-reviewer` volta **sempre**.
  `_TEMPLATE/quality.md:266-276`.
- **Anti-pingue-pongue**: reprovação pela 2ª vez ou recusa não aceita → `escalado`. "Impasse entre
  agentes nunca compra uma terceira rodada — compra uma pergunta ao dev."
  `_TEMPLATE/quality.md:278-281`.
- **Fecho do item**: zero CRÍTICO/ALTO `aberto` **e** zero `escalado` sem resposta.
  `retornos-schema.md:143-147`.

---

## Correspondência (para o índice)

| Diretriz | Desfecho | Instrumento | Justificativa |
|---|---|---|---|
| Escala de severidade | **PROJETO** | CRÍTICO/ALTO/MÉDIO/BAIXO na `CLASSIFICAÇÃO DE ACHADOS` do `quality.md` de cada item | Nomenclatura idêntica à do método, com pisos e critérios próprios. Usar a do projeto, integral |
| Piso do que bloqueia | **COMPÕE (piso do projeto é mais alto)** | crítico/alto + **médio em 7 áreas sensíveis** | O projeto sobe o piso em relação ao genérico; a composição adota o piso **mais alto** |
| Formato dos retornos de revisão | **PROJETO** | `docs/roadmap/retornos-schema.md` + `retornos/{coder-reviewer,delivery-inspector,software-engineer}.json` | Schema completo, com máquina de estados de 7 status. Não improvisar formato |
| Régua imutável por unidade de trabalho | **PROJETO** | `quality.md` comitado antes do código | O método não precisa impor a sua: esta é mais estrita (forja de contrato = crítico) |
| Gate mecânico / frescor de veredito | **PROJETO** | `.claude/tool/review_pipeline.dart` (`begin`/`set`/`check`/`gate`), hooks em `.claude/settings.json` | Detalhe operacional pertence à fatia 04 |
| Máximo de rodadas | **PROJETO** | 3 | `contexto`; `_TEMPLATE/quality.md:37` |
| Manifesto de qualidade | **PROJETO** | `fvm dart format --output=none --set-exit-if-changed lib test` · `fvm flutter analyze --fatal-infos --fatal-warnings` · `fvm flutter test` | Detalhe pertence à fatia 01 |
| Regras de lint customizadas | **NATIVO** | — | `analysis_options.yaml` tem 6 linhas e só faz `include` do `flutter_lints` padrão + 2 excludes. **Zero regra custom, zero fronteira de import, zero restrição entre módulos** |
| ADR / RFC / design docs com estado | **NATIVO** | — | **Não existe pasta de ADR.** Os dois documentos de "sugestão de melhoria de arquitetura" citados pelo `CLAUDE.md` estão **vazios** (0 linhas). O mais próximo são as tabelas de *Decisões travadas*, que são **de produto e de escopo por tema** — não ADR de arquitetura |
| Guia de contribuição | **NATIVO** | — | `ls` da raiz: não há `CONTRIBUTING.md` nem `.github/`. As obrigações de contribuição estão dispersas em `CLAUDE.md` + `AI_GUIDELINES.md` + `QUALITY_WIKI.md` |
| Idioma | **PROJETO** | inglês nos identificadores; pt-BR em comentários, docstrings e UI | Regra explícita e repetida em 4 fontes independentes |
| Padrões de código recorrentes | **PROJETO** | `docs/historico-correcoes/README.md:25-57` — 8 padrões "não reinventar" | Nascidos de bugs reais, com o Cubit/arquivo de referência em cada um |
| Convenção de registro de bugfix | **PROJETO** | `docs/historico-correcoes/AAAA-MM-DD-<tema>.md` com Motivo/Local/Correção + linha na tabela | `docs/historico-correcoes/README.md:59-64`; memória `bugfix-history-folder.md` |
| Rigor de `adequacao_de_teste` | **PROJETO** | mutação mental **nomeada** (arquivo:linha, o que trocar, qual teste morre) — e mutação **sobrevivente** vira achado | Observado em `04-alerts/retornos/coder-reviewer.json`; exigido por `retornos-schema.md:74-76` |
| Arquitetura em camadas | **COMPÕE (como contexto, não como critério)** | `CLAUDE.md` descreve `UI → Cubit → Service → Interface → DB` | ⚠️ Predominantemente **descritivo**. A única frase imperativa é "Manter o padrão … já estabelecido". Sem sensor automatizado. Só vira achado quando o `quality.md` do item o transformar em requisito |
| Contrato de API (retrocompat) | **PROJETO** | mudança aditiva; campo antigo só sai com aval do mobile; typo `vehicle_liscense` preservado | memória `api-retrocompat-nunca-block-version.md`; `endpoints-residuais-v2/README.md:245-246` |
| Autoridade sobre decisão travada | **PROJETO** | O engenheiro de correção **não tem autoridade**: para e escala ao dev | `contexto`; cláusula presente nos 7 roadmaps |
| Quem comita | **PROJETO** | ninguém além do dev, à mão | `contexto` + memória + reforço em README de roadmap |

---

## Não coberto

- **`README.md` da raiz (80 linhas)** — não aberto. Vale abrir: é a porta de entrada do repositório
  e pode conter norma de setup ou de contribuição que não está em nenhum dos três documentos de
  qualidade. Baixo risco de ser normativo, mas não confirmado.
- **`AGENT.md` (18 linhas), `AGENTS.md` (64), `GEMINI.md` (403)** — não abertos **de propósito**:
  são o aparelho de IA, território da **fatia 04**. ⚠️ Mas há um fio solto que cruza as duas
  fatias: `docs/AI_GUIDELINES.md:39` diz "Refer to `AGENT.md` in the root for **foundational
  mandates**" — ou seja, o `AGENT.md` é declarado **normativo** por um documento normativo. Se a
  fatia 04 não o tratar como fonte de norma, essa linha fica órfã.
- **`.husky/` e a seção `husky:` do `pubspec.yaml`** — não abertos. Valeria abrir para confirmar
  **o que o pre-commit realmente roda** (o semgrep está mesmo no hook? o `dart format` é de raiz ou
  de `lib test`?). É a diferença entre o conflito C-1 ser teórico ou ser um hook que quebra a cada
  commit do dev.
- **`docker-compose.yml`** — não aberto; o serviço `quality-gate` definiria o pipeline Jenkins real.
- **As 7 tabelas completas de *Decisões travadas*** — li só a de `endpoints-residuais-v2` (a mais
  nova e a mais longa, 9 linhas). As outras 6 estão **localizadas** nesta ficha (com número de
  linha) mas **não transcritas**. Valeria abrir a de `usuario-telemetria-v2` (README de 424 linhas,
  o maior) e a de `login-sessao-v2` — ambas mexem em **autenticação/sessão**, que é área sensível,
  e a de `login-sessao-v2` trava a troca de HMAC-SHA256 para HMAC-SHA1.
- **Os 6 roadmaps em formato legado** — não confirmei no disco que os itens deles são arquivos
  únicos `NN-slug.md` sem `quality.md`; isso vem do `CLAUDE.md` (`contexto`). Só inspecionei a
  estrutura de `endpoints-residuais-v2/`.
- **`docs/compat-erros-formato-antigo-validator-go.md`, `docs/go_api_error_return_structure.md`,
  `docs/solicitacao-api-slug-dispatch-already-accepted.md`** — não abertos. São contratos de erro
  de API; podem ser normativos para qualquer item que toque `lib/core/api/`.
- **`docs/orientacoes_implementacao/` (13 arquivos)** — só listados, nenhum aberto. São os
  contratos de backend; o README de cada roadmap manda lê-los "inteiros". Valeria abrir os que o
  roadmap **ativo** cita, e só eles.
- **`docs/temp/`** — diretório listado, não inspecionado.
- **Conteúdo dos arquivos canônicos de `lib/` e `test/`** — a **existência** foi confirmada por
  `ls`; nenhum foi aberto. A descrição de cada um vem dos documentos que os citam, não do código.
- **Histórico de mensagens de commit** —
  NÃO ENCONTRADO — a fonte exigiria comando git, proibido nesta execução.
- **Data das decisões travadas nos 6 roadmaps mais antigos** — só a de `endpoints-residuais-v2`
  (2026-08-19) foi lida.
- **Estado de "ADR substituída sem ninguém marcar"** — não aplicável: não há ADR. Mas o análogo
  existe e foi encontrado: **regra normativa superada sem ninguém marcar** (conflitos C-1 e C-2).

---

## Perguntas ao dev

1. **Idioma dos retornos da tripulação.** O `retornos-schema.md` normatiza chaves e enums (pt-BR),
   mas **não diz nada sobre o idioma da prosa** (`descricao`, `cenario_de_falha`,
   `nota_verificacao`, `limite_da_revisao`, `adequacao_de_teste`). Na prática os retornos reais
   estão em pt-BR. **Confirma pt-BR como regra — inclusive para o relatório final ao dev?** Há
   chance de outra pessoa (backend, auditoria) precisar ler esses JSON em inglês?
2. **`docs/AI_GUIDELINES.md` está superado — atualizo o entendimento ou o documento?** Ele manda
   `dart format .` (que o `CLAUDE.md` diz que quebra neste repo) e o `QUALITY_WIKI.md` diz que
   "warnings são permitidos por enquanto" (contra `--fatal-warnings`). Assumi que o `CLAUDE.md`
   vence nos dois. **Confirma?** E os dois continuam sendo fonte de norma para a tripulação, ou
   viraram documentos históricos?
3. **`AGENT.md` é normativo?** O `AI_GUIDELINES.md:39` o chama de "foundational mandates". Como o
   repositório tem `AGENT.md`, `AGENTS.md`, `GEMINI.md` e `CLAUDE.md` convivendo — mais `.gemini/`,
   `.windsurf/`, `.specforce/`, `.vscode/`, `.idea/` — **qual deles a tripulação deve obedecer e
   qual é só configuração de outro harness?**
4. **Os dois `docs/sugestao_melhoria_*.md` estão VAZIOS (0 bytes), mas o `CLAUDE.md` os lista como
   documentação.** Foram esvaziados de propósito, o conteúdo se perdeu, ou migrou para os
   roadmaps? (O `CLAUDE.md` ainda cita um deles pelo nome errado — falta o `e_` em
   `tecnologias_e_processos`.)
5. **O pre-commit do Husky ainda roda?** O `semgrep` aparece em dois documentos como etapa do gate,
   mas não está no manifesto de 3 comandos do `CLAUDE.md`. **A tripulação deve considerar o SAST
   parte do critério de pronto**, ou ele é responsabilidade exclusiva do hook/CI?
6. **Regra que você cobra em revisão e que não está escrita em lugar nenhum?** Os 8 padrões de
   `docs/historico-correcoes/README.md` parecem ser exatamente isso, já escritos. **Sobrou alguma
   que ainda não virou texto?**
7. **Escopo das "Regras normativas" dos roadmaps.** Cada README diz valer "para o tema". Mas várias
   dessas regras (`ApiResult<T>` para toda função de requisição, ramificar por slug e nunca por
   `message`, `GoApiClient.i.run` para endpoint Go, `ApiErrorMessages.localize` para texto de
   usuário) **parecem ser norma de projeto**, não de tema. **Alguma já graduou para regra global,
   mesmo sem Skill formalizada?** Tratei todas como escopo-de-tema por conservadorismo — se alguma
   for global, ela deve entrar nas lentes dos inspetores.
8. **Validade temporal de decisão travada.** O `endpoints-residuais-v2` registra "Tomadas com o dev
   em 2026-08-19". Uma decisão travada de meses atrás, sobre uma área que mudou desde então,
   **ainda vale sem reconfirmação?** Existe critério de expiração?
9. **Quem hoje mantém `QUALITY_WIKI.md`?** O arquivo assina "Mantido pelo time de Engenharia
   Veniti" (`QUALITY_WIKI.md:50`). Se esse time não é mais o interlocutor, o documento vira
   histórico — e isso muda o desfecho da pergunta 2.
10. **A skill `roadmap-driven-development` mora fora do repositório**
    (`C:\Users\thoma\.claude\skills\`, não em `.claude/skills/`, que **não existe** no projeto).
    Ela é a régua do método de roadmap e o `CLAUDE.md` manda carregá-la antes de criar ou executar
    qualquer roadmap. **Confirma que ela é pré-requisito de máquina** — isto é, que uma sessão
    noutra máquina sem essa skill não deve criar nem executar roadmap?
