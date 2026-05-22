# Como a IA enxerga seu projeto

> [!abstract] Pré-requisitos
> [[00 - Por que usar IA no desenvolvimento]]

Esta nota responde diretamente à pergunta central das suas anotações ([[Noções básicas]]): *"como a IA enxerga tudo isso, todas essas pastas com arquivos .md?"*. Entender isto é o que separa quem briga com a IA de quem a comanda.

## O que é: o modelo mental correto

Um LLM (Large Language Model, o "motor" por trás do Claude, GPT, Gemini) **não tem acesso ao seu disco**. Ele não "abre" seu projeto como uma IDE. Ele só consegue raciocinar sobre o **texto que entra na sua janela de contexto** naquele momento.

> [!important] A regra de ouro
> A IA só sabe o que está **no contexto** agora. Ela não "lembra" do seu projeto, do que você falou ontem, nem lê um arquivo que ninguém colocou na frente dela. Tudo que parece "memória" é, na verdade, **texto sendo reinjetado** no contexto.

### Os 3 conceitos que explicam tudo

**1. Token** — a unidade de texto que o modelo processa. Não é exatamente uma palavra: ~1 token ≈ 4 caracteres em inglês (em português costuma ser um pouco mais "caro"). `"Flutter"` pode ser 1–2 tokens; `BuildContext` pode ser 3. Tudo vira tokens: seu código, seus prompts, a resposta.

**2. Janela de contexto (context window)** — o limite de tokens que cabem por vez (entrada + saída). É a "mesa de trabalho" da IA. Modelos atuais têm janelas grandes (centenas de milhares de tokens), mas **finitas**. O projeto inteiro raramente cabe — e mesmo que coubesse, encher a janela piora o foco (veja "Context rot" abaixo).

**3. Statelessness (sem estado)** — cada requisição é, no fundo, independente. A "conversa" continua porque a ferramenta **reenvia o histórico** a cada mensagem. Quando o histórico fica grande demais, ele é **resumido/compactado** — e detalhes podem se perder.

## Como as ferramentas "dão olhos" para a IA

Se o modelo só vê texto, como o Claude Code/Cursor parecem conhecer seu repo? Porque a **ferramenta em volta do modelo** monta o contexto para ele. Os mecanismos:

| Mecanismo | Como funciona | Exemplo |
|---|---|---|
| **Leitura sob demanda** | A IA pede para a ferramenta "ler tal arquivo" e o conteúdo é injetado no contexto. | Você cita `lib/auth/login_bloc.dart` e o agente lê o arquivo. |
| **Busca (grep/glob)** | A ferramenta procura no repo e devolve só os trechos relevantes. | "Onde uso `Dio`?" → ela busca e lê os matches. |
| **Arquivos sempre carregados** | Certos `.md` entram no contexto automaticamente no início. | `CLAUDE.md`, `.cursorrules`, `AGENTS.md` (ver [[00 - Rules e Arquivos de Instrucao]]). |
| **Carregamento por relevância** | Instruções carregadas só quando o tema surge. | Skills (ver [[01 - Skills]]). |
| **Embeddings / indexação** | Algumas IDEs indexam o repo para busca semântica. | Cursor indexando o projeto. |

> [!tip] Por que os arquivos .md "funcionam"
> Não há mágica: aquelas pastas de `.md` (rules, skills, etc.) **funcionam porque viram texto no contexto**. Um `CLAUDE.md` é injetado sempre; uma skill é injetada quando relevante. A IA "enxerga" sua estrutura na medida em que **alguém — a ferramenta ou você — coloca esse texto na janela**. Configurar a IA = controlar *o que entra no contexto e quando*.

## Como usar isso a seu favor

1. **Pense em "orçamento de contexto".** Cada arquivo aberto/lido gasta tokens. Traga o **relevante**, não o repositório inteiro.
2. **Aponte os caminhos.** Em vez de "arruma o login", diga "veja `lib/features/auth/` e ajuste o `LoginBloc`". Você economiza buscas e reduz erro.
3. **Sessões curtas e focadas.** Uma tarefa por sessão evita o histórico inchar e a IA "esquecer" o começo.
4. **Materialize o conhecimento estável em arquivos.** Convenções do projeto não devem ser repetidas a cada prompt — viram Rules (Módulo 04).
5. **Recomece quando o contexto "azedar".** Sessão longa e confusa? Abra uma nova com um resumo limpo. É mais rápido que insistir.

## Qual o melhor lugar para aplicar

- **Sempre.** Esse modelo mental vale para qualquer ferramenta e qualquer linguagem. É a base de [[00 - Engenharia de Prompt]] e [[01 - Engenharia de Contexto]].

## Cenário de exemplo (Flutter / Dart)

Você pede: *"Por que meu `FutureBuilder` na `HomePage` mostra erro?"* — sem mais nada.

- A IA **não vê** sua `HomePage`. Ela vai chutar causas genéricas, ou gastar tempo buscando o arquivo.

Versão consciente do contexto:
> "No arquivo `lib/features/home/home_page.dart`, o `FutureBuilder` (linha ~40) usa `repository.fetchItems()`. Em produção mostra 'Something went wrong'. Aqui está o trecho: [cola]. O `fetchItems` retorna `Future<List<Item>>` e pode lançar `DioException`. Por que o `snapshot.hasError` dispara mesmo com internet?"

Você colocou na janela exatamente o que importa — a resposta vem certeira.

## Armadilhas comuns

> [!warning]
> - **Assumir que ela "lembra" do projeto** entre sessões — não lembra; só lembra o que está no contexto agora.
> - **Context rot:** encher a janela com arquivos irrelevantes degrada a qualidade. Mais contexto ≠ melhor; **contexto certo** é melhor.
> - **Confiar em detalhes após uma compactação** de conversa longa — reconfirme dados críticos.
> - **Esperar que ela leia um arquivo que você nunca citou nem deixou acessível.**

## Resumo

A IA enxerga **texto numa janela finita**, não seu disco. Toda a "configuração" do Módulo 04 é, no fundo, engenharia de *o que entra nessa janela e quando*. Dominar isso é dominar a IA.

---
**Próximo passo:** agora que você sabe o que a IA vê, aprenda a falar com ela → [[00 - Engenharia de Prompt]]
