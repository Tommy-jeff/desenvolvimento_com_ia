# Panorama de Ferramentas

> [!abstract] Pré-requisitos
> [[01 - Engenharia de Contexto]]

## O que é

Este módulo é um **mapa do território**: as categorias de ferramentas de IA para desenvolvimento e o que cada uma faz de melhor. O objetivo não é decorar nomes (eles mudam rápido), mas entender **as categorias** — porque a categoria define o tipo de trabalho que a ferramenta resolve.

> [!note] As ferramentas mudam, as categorias não
> Versões e nomes envelhecem em meses. Em vez de "qual é a melhor", pense "que **tipo** de ferramenta resolve este problema". Esse vocabulário você leva para qualquer ferramenta futura.

## As categorias

### 1. Autocomplete / "tab" inline
Completa o que você está digitando, dentro do editor.
- **Exemplos:** GitHub Copilot (autocomplete), Cursor Tab, Codeium/Windsurf.
- **Brilha em:** fluxo de digitação, boilerplate linha a linha, padrões repetitivos.
- **Limite:** não raciocina sobre o projeto inteiro nem executa tarefas multi-arquivo sozinho.

### 2. Chat assistido na IDE
Um painel de chat que enxerga arquivos abertos / o repo e edita com sua aprovação.
- **Exemplos:** Copilot Chat, Cursor (chat + Cmd-K), Windsurf.
- **Brilha em:** "explique isto", "refatore esta classe", mudanças localizadas com humano no comando.

### 3. Agentes de codificação (CLI / autônomos)
Recebem uma tarefa e **executam vários passos**: leem arquivos, editam, rodam comandos, testam — em loop, com sua supervisão.
- **Exemplos:** **Claude Code** (CLI/terminal — o que você já usa), Gemini CLI, agentes do Cursor/Windsurf, Aider.
- **Brilha em:** tarefas de ponta a ponta ("implemente a feature X com testes"), refactors amplos, investigação de bugs.
- **É aqui que vivem** Rules, Skills, Subagents e MCPs (Módulo 04).

### 4. Plataformas de revisão / automação
Atuam no fluxo de PR/CI, não no seu editor.
- **Exemplos:** revisão automática de PR, agentes que rodam em CI.
- **Brilha em:** segunda opinião antes do merge, checagens repetíveis.

### 5. IDEs "spec-first" e frameworks de SDD
Organizam o trabalho em torno de uma especificação. Veja o Módulo 05.
- **Exemplos:** Kiro, spec-kit, OpenSpec ([[00 - Spec Driven Development (SDD)]]).

## Como usar da melhor maneira

> [!tip]
> - **Combine categorias.** O padrão atual não é "uma ferramenta", é um **stack**: autocomplete enquanto digita + um agente CLI para tarefas grandes + revisão no PR.
> - **Escolha pela tarefa.** Linha a linha → autocomplete. Refactor de uma classe → chat. Feature inteira → agente. Antes do merge → revisão.
> - **Aprenda profundamente UMA ferramenta agente** (no seu caso, Claude Code) antes de espalhar atenção. A proficiência vale mais que a variedade.
> - **Não pague pela mesma capacidade duas vezes** sem motivo — veja o que se sobrepõe.

## Qual o melhor lugar para usar (resumo)

| Preciso de... | Categoria |
|---|---|
| Completar a linha que estou digitando | Autocomplete |
| Entender / refatorar um trecho aberto | Chat na IDE |
| Implementar uma feature ponta a ponta | Agente CLI |
| Segunda opinião antes do merge | Revisão/CI |
| Disciplinar o "o quê" antes do "como" | SDD (Módulo 05) |

## Cenário de exemplo (Flutter / Dart)

Você vai implementar **dark mode** no app:

1. **Agente CLI (Claude Code):** "implemente o `ThemeCubit` com persistência via `shared_preferences`, troque o `MaterialApp` para usar o tema dinâmico e gere os testes." — tarefa multi-arquivo.
2. **Autocomplete:** enquanto você ajusta manualmente cores no `AppTheme`, ele completa as entradas repetitivas do `ColorScheme`.
3. **Chat na IDE:** "explique por que este `Text` não respeita o `textTheme`."
4. **Revisão de PR:** uma checagem automática aponta um widget que ficou com cor fixa.

Quatro categorias, um fluxo só.

## O "pacote de desenvolvimento atual"

A pergunta das suas anotações ("quais ferramentas fazem parte do pacote atual?") tem uma resposta de **stack**, não de produto único. Hoje, um setup típico é: **editor/IDE + autocomplete + 1 agente CLI + (opcional) revisão automática + Rules/Skills/MCP versionados no repo**. O detalhe de *como montar isso sem largar o Android Studio* está em [[01 - IDEs e Setup]].

## Armadilhas comuns

> [!warning]
> - **Trocar de ferramenta toda semana** — você nunca fica bom em nenhuma.
> - **Usar um martelo para tudo** — autocomplete não faz refactor de feature; agente é exagero para completar uma linha.
> - **Confundir hype com adequação** — escolha pela tarefa, não pelo barulho.

## Resumo

Pense em **categorias** e monte um **stack** que combine autocomplete, um agente CLI e revisão. Aprofunde em uma ferramenta-agente. A próxima nota mostra como encaixar isso no seu ambiente real.

---
**Próximo passo:** montar o ambiente sem abrir mão do Android Studio → [[01 - IDEs e Setup]]
