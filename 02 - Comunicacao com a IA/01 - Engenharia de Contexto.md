# Engenharia de Contexto

> [!abstract] Pré-requisitos
> [[01 - Como a IA enxerga seu projeto]] · [[00 - Engenharia de Prompt]]

## O que é

**Engenharia de contexto** é a disciplina de gerenciar *tudo o que está na janela de contexto* da IA durante uma tarefa: quais arquivos, qual histórico, quais regras, quais ferramentas. Se a engenharia de prompt é *como você pede*, a engenharia de contexto é **curar o ambiente de informação** em que o pedido acontece.

> [!important] A virada de chave da indústria
> À medida que os modelos ficaram melhores em seguir instruções, o gargalo deixou de ser "achar as palavras mágicas" e passou a ser **dar a informação certa, na quantidade certa, no momento certo**. Hoje, engenharia de contexto importa mais que prompt rebuscado. É por isso que ela tem seu próprio módulo.

## Por que importa tanto

Do [[01 - Como a IA enxerga seu projeto]]: a janela é **finita** e encher demais **piora** o resultado ("context rot"). Logo, contexto é um recurso a ser **orçado**, não empilhado.

- **Pouco contexto** → a IA chuta, alucina, ignora seus padrões.
- **Contexto demais / irrelevante** → ela se distrai, mistura sinais, perde o foco e fica mais lenta e cara.
- **Contexto certo** → respostas precisas, alinhadas ao seu projeto.

O objetivo: **o menor conjunto de informação de alto sinal** que resolve a tarefa.

## Como usar da melhor maneira

> [!tip] Táticas práticas
> 1. **Curar, não despejar.** Traga os 2–3 arquivos que importam, não a pasta inteira.
> 2. **Aponte caminhos e símbolos.** "Veja `AuthRepository` em `lib/data/auth_repository.dart`" foca a busca da IA.
> 3. **Materialize o que é estável.** Convenções, arquitetura e do/don't do projeto vão para **Rules** ([[00 - Rules e Arquivos de Instrucao]]) — assim entram no contexto sem você repetir.
> 4. **Carregue sob demanda.** Conhecimento de um procedimento específico vive em **Skills** ([[01 - Skills]]), que só entram quando relevantes.
> 5. **Isole tarefas pesadas.** Delegue uma sub-tarefa "barulhenta" (ex.: investigar o repo todo) a um **Subagent** com contexto próprio, e receba só a conclusão ([[02 - Agents e Subagents]]).
> 6. **Limpe quando azedar.** Conversa longa e confusa → comece outra com um resumo enxuto do estado atual.
> 7. **Traga dados externos via MCP** em vez de colar manualmente (issues, docs, schema do banco) ([[03 - MCPs]]).

## As "fontes" de contexto (e quem as controla)

| Fonte | Entra como | Quem controla |
|---|---|---|
| Seu prompt | texto que você digita | você, a cada mensagem |
| Histórico da conversa | reinjetado a cada turno | a ferramenta (com compactação) |
| Arquivos lidos/abertos | conteúdo injetado | você (citando) ou o agente (buscando) |
| Rules (`CLAUDE.md` etc.) | sempre carregado | você (Módulo 04) |
| Skills | carregado quando relevante | você + a IA (Módulo 04) |
| MCP | dados de sistemas externos | você (Módulo 04) |

Repare: **quase tudo no Módulo 04 é, no fundo, engenharia de contexto automatizada.**

## Qual o melhor lugar para usar

- **Toda tarefa não-trivial.** Antes de pedir, pergunte-se: *"a IA tem na frente dela tudo o que precisa — e nada além disso?"*
- Especialmente crítico em **bases grandes** (como apps Flutter maduros), onde o repo não cabe na janela.

## Cenário de exemplo (Flutter / Dart)

Tarefa: *adicionar paginação à lista de produtos.*

❌ **Contexto ruim:** abrir 20 arquivos "por garantia" e pedir "adiciona paginação".

✅ **Contexto curado:**
1. Traga só o relevante: `product_list_bloc.dart`, `product_repository.dart` e o widget `ProductListView`.
2. Garanta que o padrão está nas Rules: *"paginação usa `ScrollController` + evento `LoadMore`; repositórios retornam `Either<Failure, Page<T>>`."*
3. Prompt: *"Adicione paginação à lista de produtos seguindo o padrão do projeto. Aqui estão os 3 arquivos relevantes. Mantenha o estilo BLoC e gere os testes do novo evento `LoadMore`."*

A IA tem sinal alto, ruído baixo — e segue **suas** convenções sem você reexplicá-las.

## Armadilhas comuns

> [!warning]
> - **"Mais contexto é melhor"** — não é. Contexto irrelevante degrada a saída.
> - **Reexplicar convenções a cada prompt** em vez de movê-las para Rules.
> - **Deixar a conversa virar um depósito** de tentativas falhas — recomece limpo.
> - **Colar manualmente o que um MCP traria automaticamente** (e desatualizado).

## Resumo

Engenharia de contexto é curadoria: o menor conjunto de informação de alto sinal que resolve a tarefa. Boa parte do Módulo 04 existe para automatizar essa curadoria — agora você verá *com quais ferramentas*.

---
**Próximo passo:** conhecer o ferramental atual → [[00 - Panorama de Ferramentas]]
