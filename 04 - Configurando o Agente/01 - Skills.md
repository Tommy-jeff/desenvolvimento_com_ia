# Skills

> [!abstract] Pré-requisitos
> [[00 - Rules e Arquivos de Instrucao]]

## O que é

Uma **Skill** é um pacote de conhecimento/procedimento que a IA carrega **sob demanda** — só quando a tarefa atual é relevante para ela. Pense numa Skill como um "manual de como fazer X" que fica guardado na estante e a IA pega quando precisa.

> [!important] Rules vs. Skills (a distinção que importa)
> - **Rules** estão **sempre** no contexto → custam tokens em toda sessão → devem ser curtas.
> - **Skills** entram **só quando relevantes** → podem ser **extensas e numerosas** sem pesar no dia a dia.
>
> É por isso que um `CLAUDE.md` de 5.000 linhas deixa a IA lenta, mas uma biblioteca de 50 skills não: a skill só ocupa contexto no momento em que é usada.

### Como a IA decide carregar uma Skill
Cada Skill tem uma **descrição** (um resumo curto do que ela faz e quando usar). O agente mantém só essas descrições à vista; quando seu pedido casa com uma descrição, ele **carrega o conteúdo completo** daquela Skill. Daí a regra de ouro: **a descrição é a parte mais importante** — é o gatilho.

## Anatomia (formato Claude Code)

Uma Skill é uma pasta com um arquivo `SKILL.md`:

```
.claude/skills/
  criar-feature-bloc/
    SKILL.md
    (opcional) exemplos, templates, scripts...
```

```markdown
---
name: criar-feature-bloc
description: Cria uma nova feature seguindo o padrão BLoC do projeto
  (estados sealed, repositório com Either, testes). Use quando o usuário
  pedir uma nova tela/feature.
---

# Como criar uma feature com BLoC

1. Crie a pasta lib/features/<nome>/ com presentation/domain/data.
2. Defina os eventos e estados (sealed class)...
3. ... (passos detalhados, exemplos, checklist)
```

O `description` no frontmatter é o que a IA "vê" o tempo todo; o corpo só entra quando acionada.

## Como usar da melhor maneira

> [!tip]
> 1. **Uma Skill = um procedimento.** Coesa e focada ("rodar a suíte de testes", "criar feature BLoC"), não um manual genérico.
> 2. **Capriche na `description`.** Diga claramente *o que faz* e *quando usar* — é o gatilho de carregamento.
> 3. **Promova prompts repetidos.** Se você cola o mesmo passo a passo toda semana ([[00 - Engenharia de Prompt]]), ele deveria ser uma Skill.
> 4. **Inclua exemplos e templates** na pasta da skill — a IA pode lê-los quando precisar.
> 5. **Versione no repo.** Skills no Git = todo o time (e a IA de todos) seguem o mesmo procedimento.

## Qual o melhor lugar para usar

✅ Procedimentos **repetíveis, específicos e ocasionais**:
- "Criar uma feature no padrão do projeto."
- "Gerar a tradução/i18n de uma string nova em todos os locales."
- "Preparar uma release (bump de versão, changelog, build)."
- Conhecimento extenso que não vale manter sempre no contexto.

❌ Não use para:
- Regras universais e curtas que valem sempre → **Rules** ([[00 - Rules e Arquivos de Instrucao]]).
- Acessar sistemas externos → **MCP** ([[03 - MCPs]]).
- Delegar uma tarefa a um executor isolado → **Subagent** ([[02 - Agents e Subagents]]).

## Comparação entre ferramentas

| Ferramenta | Equivalente a "Skill" |
|---|---|
| **Claude Code** | **Skills** (`SKILL.md`) e **slash commands** (`.claude/commands/*.md`) |
| **Cursor** | regras sob demanda (`.mdc` acionadas) / prompts salvos ("Notepads") |
| **GitHub Copilot** | "prompt files" / comandos de chat reutilizáveis |

O conceito é o mesmo: **procedimento reutilizável carregado quando relevante**. Os nomes e formatos variam.

## Cenário de exemplo (Flutter / Dart)

Você cria a Skill `gerar-testes-bloc`:

- **`description`:** *"Gera testes para um BLoC/Cubit usando bloc_test, cobrindo estados de loading, sucesso e falha. Use quando pedirem testes de um bloc."*
- **Corpo:** o passo a passo + um template de teste com `blocTest`, mocks com `mocktail`, padrão de `setUp`.

Depois, basta dizer: *"gera os testes do `LoginBloc`"*. A IA reconhece pela descrição, carrega a skill e produz testes **no seu padrão** — sem você reexplicar a estrutura toda vez.

## Armadilhas comuns

> [!warning]
> - **Descrição fraca** → a Skill nunca é acionada (a IA não sabe quando usá-la).
> - **Skill genérica demais** ("ajudar com Flutter") → não foca em nada.
> - **Colocar na Skill o que deveria ser Rule** (e vice-versa) → revise a distinção sempre-carregado vs. sob-demanda.
> - **Esquecer de versionar** → o conhecimento fica só na sua máquina.

## Resumo

Skills empacotam procedimentos reutilizáveis que entram no contexto só quando relevantes — por isso podem ser muitas e detalhadas. A boa descrição é o gatilho. A seguir: quando você quer não só um procedimento, mas **delegar a tarefa inteira** a um executor próprio.

---
**Próximo passo:** delegar a especialistas isolados → [[02 - Agents e Subagents]]
