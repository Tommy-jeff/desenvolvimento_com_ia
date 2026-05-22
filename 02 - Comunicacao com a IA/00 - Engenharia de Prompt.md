# Engenharia de Prompt

> [!abstract] Pré-requisitos
> [[01 - Como a IA enxerga seu projeto]]

## O que é

**Engenharia de prompt** é a prática de estruturar suas instruções para que a IA produza a saída que você quer, de forma consistente. "Prompt" é a mensagem que você envia. Engenharia de prompt é tratar essa mensagem como uma especificação — não como um chute.

> [!note] Prompt vs. Contexto
> Prompt é *como você pede*. Contexto é *o que a IA tem diante dela* (arquivos, histórico, regras). Os dois andam juntos: o melhor prompt do mundo falha sem o contexto certo. Esta nota cobre o "como pedir"; o "o que está vendo" está em [[01 - Engenharia de Contexto]].

## Anatomia de um bom prompt

Um prompt forte costuma ter estas peças (nem sempre todas):

1. **Papel / objetivo** — quem a IA deve ser e o que entregar. *"Você é um dev Flutter sênior. Implemente X."*
2. **Contexto** — arquivos, restrições, stack, padrões a seguir.
3. **Tarefa específica** — o que fazer, em passos claros e fatiados.
4. **Restrições** — o que NÃO fazer, limites, convenções (null-safety, sem libs novas, etc.).
5. **Formato de saída** — código completo? só o diff? explicação antes ou depois?
6. **Critério de aceite** — como saber que ficou pronto (ex.: "os testes devem passar").

## Como usar da melhor maneira

> [!tip] Princípios que mais movem o ponteiro
> 1. **Seja específico.** "Melhore este código" é vago. "Extraia a lógica de rede deste widget para um repositório e injete via construtor" é acionável.
> 2. **Dê exemplos (few-shot).** Mostrar 1 exemplo do estilo que você quer vale mais que 3 parágrafos descrevendo.
> 3. **Peça um plano antes do código** em tarefas grandes. Você revisa o plano (barato) antes de gerar 300 linhas (caro de revisar).
> 4. **Itere.** O 1º resultado é um rascunho. Refine: "bom, mas use `sealed class` para os estados e adicione o caso de loading."
> 5. **Restrinja explicitamente.** "Não adicione dependências", "mantenha o padrão BLoC já usado", "null-safety sempre".
> 6. **Diga o formato.** "Só o código alterado, sem reescrever o arquivo inteiro" economiza revisão.

### Técnicas úteis
- **Zero-shot:** pedir direto, sem exemplo (tarefas simples).
- **Few-shot:** dar 1–3 exemplos do formato desejado (padroniza saída).
- **Chain-of-thought:** "pense passo a passo antes de responder" (bom para lógica/debug).
- **Role prompting:** definir um papel ("revisor de segurança", "QA").
- **Decomposição:** quebrar uma tarefa grande em uma sequência de prompts menores.

## Qual o melhor lugar para usar

- **Chat/IDE para tarefas pontuais:** prompts ricos e diretos.
- **Tarefas recorrentes:** se você reescreve o mesmo prompt sempre, **promova-o** a um arquivo reutilizável — uma Skill ou um comando ([[01 - Skills]]). Prompt bom que se repete vira configuração.
- **Regras que valem para todo o projeto:** não as repita em cada prompt; coloque em Rules ([[00 - Rules e Arquivos de Instrucao]]).

## Comparação entre ferramentas

A engenharia de prompt é **universal** — a habilidade é a mesma em qualquer ferramenta. O que muda é onde você "salva" prompts bons:

| Ferramenta | Prompt pontual | Prompt reutilizável |
|---|---|---|
| **Claude Code** | mensagem no terminal | Skills (`SKILL.md`) e slash commands |
| **Cursor** | chat / Cmd-K inline | "Notepads" / prompts salvos, regras |
| **GitHub Copilot** | Copilot Chat | prompts salvos, `/` commands no chat |

O princípio é idêntico nos três: especificidade + contexto + restrições + formato.

## Cenário de exemplo (Flutter / Dart)

❌ **Prompt fraco:**
> "faz um login pra mim"

✅ **Prompt de engenheiro:**
> "Você é um dev Flutter sênior. Crie a feature de login seguindo o padrão BLoC já usado em `lib/features/`.
> - **Entrada:** email e senha, com validação (email válido, senha ≥ 8).
> - **Estados:** use `sealed class LoginState` com `Initial`, `Loading`, `Success`, `Failure(message)`.
> - **Camadas:** `LoginBloc` chama `AuthRepository.login(email, password)` que retorna `Either<Failure, User>` (já uso `dartz`).
> - **Restrições:** null-safety; não adicione dependências novas; não monte a UI ainda.
> - **Saída:** primeiro um plano em bullets; depois o código do bloc, dos eventos e estados; depois os testes do bloc cobrindo sucesso e falha.
> - **Aceite:** os testes devem passar com `flutter test`."

Você revisa o plano, aprova, recebe código alinhado ao seu projeto — e testável.

## Armadilhas comuns

> [!warning]
> - **Vago demais** → resultado genérico que você descarta.
> - **Tudo de uma vez** → difícil de revisar; fatie.
> - **Não dizer as restrições** → a IA "inventa" libs e padrões fora do seu projeto.
> - **Repetir as mesmas regras em todo prompt** em vez de movê-las para Rules.
> - **Aceitar o 1º rascunho** sem iterar.

## Resumo

Trate o prompt como uma mini-spec: papel, contexto, tarefa fatiada, restrições, formato e critério de aceite. E quando um bom prompt se repete, ele deixa de ser prompt e vira configuração.

---
**Próximo passo:** o outro lado da moeda — gerenciar o que a IA vê → [[01 - Engenharia de Contexto]]
