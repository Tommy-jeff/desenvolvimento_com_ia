# Rules e Arquivos de Instrução

> [!abstract] Pré-requisitos
> [[01 - Engenharia de Contexto]] · [[01 - IDEs e Setup]]

Esta nota abre o módulo que responde à sua dúvida central: *"como a IA enxerga essas pastas de `.md`? como eu estruturo isso?"*. Comece por aqui — Rules é o conceito-base do qual Skills, Subagents e MCPs derivam.

## O que é

**Rules** (ou arquivos de instrução) são arquivos de texto, geralmente Markdown, versionados no repositório, que carregam **instruções permanentes** sobre o projeto: convenções de código, arquitetura, do's & don'ts, comandos importantes. O agente lê esses arquivos **automaticamente** e os trata como contexto sempre presente.

> [!important] Por que isso existe (ligando ao Módulo 01)
> Do [[01 - Como a IA enxerga seu projeto]]: a IA só sabe o que está no contexto. Rules são a forma de **injetar suas convenções no contexto automaticamente**, sem você reescrevê-las a cada prompt. É engenharia de contexto materializada em arquivo.

### Como a IA "enxerga" esses arquivos
Não há mágica: ao iniciar uma sessão, a ferramenta **lê o arquivo de rules e cola o conteúdo no início do contexto**. Para o modelo, é como se você tivesse digitado aquelas instruções no topo de toda conversa. Por isso eles funcionam — e por isso **não podem ser gigantes** (ocupam contexto o tempo todo).

## Os arquivos, por ferramenta

| Ferramenta | Arquivo(s) de rules | Carregamento |
|---|---|---|
| **Claude Code** | `CLAUDE.md` (raiz e/ou subpastas); `AGENTS.md` também suportado | sempre carregado |
| **Cursor** | `.cursor/rules/*.mdc` (e o legado `.cursorrules`) | por regra: sempre, por glob, ou sob demanda |
| **GitHub Copilot** | `.github/copilot-instructions.md` | sempre carregado no chat |
| **Padrão emergente** | **`AGENTS.md`** — formato aberto que várias ferramentas leem | varia |

> [!tip] Dica de portabilidade
> O `AGENTS.md` virou um formato comum que várias ferramentas reconhecem. Se você quer que suas regras valham em mais de uma ferramenta, concentre o essencial nele e deixe que cada ferramenta o leia. Você já tem um exemplo real desse espírito no seu projeto.

## Como usar da melhor maneira

> [!tip] O que colocar (e o que não)
> **Coloque** (instruções estáveis e de alto valor):
> - Stack e versões (Flutter X, gerência de estado BLoC/Riverpod, etc.).
> - Arquitetura e camadas (onde mora cada coisa).
> - Convenções (nomes, null-safety, tratamento de erro com `Either`, etc.).
> - Comandos do projeto (`flutter test`, `dart format`, lint, hooks).
> - **Proibições** explícitas (não burlar hooks, não adicionar deps sem aprovar).
>
> **Não coloque:**
> - Detalhes de uma tarefa pontual (isso é prompt).
> - Documentação extensa (isso pesa no contexto sempre — vire Skill, carregada sob demanda).
> - Segredos/credenciais.

**Princípios:**
1. **Curto e denso.** Cada linha custa contexto em toda sessão. Bullets > parágrafos.
2. **Específico e acionável.** "Use bom código" não ajuda; "repositórios retornam `Either<Failure, T>`" ajuda.
3. **Hierárquico.** Um `CLAUDE.md` na raiz para o geral; arquivos por subpasta para regras locais de um módulo.
4. **Versionado.** Fica no Git, evolui com o projeto, é revisado em PR como código.
5. **Vivo.** Quando a IA erra repetidamente o mesmo padrão, **adicione uma regra** em vez de corrigir toda vez.

## Qual o melhor lugar para usar

- **Tudo que vale para o projeto inteiro e raramente muda.** Se você se pega repetindo a mesma orientação, ela deveria estar nas Rules.
- **Não** use para procedimentos longos e ocasionais (→ [[01 - Skills]]) nem para acessar sistemas externos (→ [[03 - MCPs]]).

## Cenário de exemplo (Flutter / Dart)

Um `CLAUDE.md` enxuto na raiz de um app Flutter:

```markdown
# Projeto: App de Tarefas (Flutter)

## Stack
- Flutter 3.x, Dart null-safety obrigatório.
- Estado: BLoC (flutter_bloc). NÃO introduzir outra solução de estado.
- Rede: Dio. Erros mapeados para `Either<Failure, T>` (dartz).

## Arquitetura (Clean simplificada)
- lib/features/<feature>/ : presentation (bloc, pages, widgets), domain, data.
- Nada de lógica de negócio dentro de Widgets.

## Convenções
- Estados de bloc com `sealed class`.
- Todo bugfix/feature acompanha teste (unit ou widget).
- Nomes em inglês; arquivos em snake_case.

## Comandos
- Formatar: `dart format .`
- Analisar: `flutter analyze`
- Testar: `flutter test`

## Proibições
- NÃO commitar burlando hooks (`--no-verify`).
- NÃO adicionar dependências sem justificar.
```

A partir daí, todo prompt já "herda" essas regras — você para de repeti-las.

## Armadilhas comuns

> [!warning]
> - **Arquivo gigante** → consome contexto em toda sessão e dilui o que importa. Mantenha enxuto; jogue o resto em Skills.
> - **Regras vagas** → não mudam o comportamento. Seja concreto.
> - **Esquecer de manter** → regras desatualizadas confundem mais que ajudam.
> - **Misturar tarefa com regra** → tarefa é prompt; regra é permanente.

## Resumo

Rules são suas convenções injetadas automaticamente no contexto — enxutas, específicas, versionadas e vivas. São a base do Módulo 04. A seguir, o que fazer quando o conhecimento é grande demais para ficar sempre carregado: Skills.

---
**Próximo passo:** conhecimento sob demanda → [[01 - Skills]]
