# MCPs (Model Context Protocol)

> [!abstract] Pré-requisitos
> [[01 - Engenharia de Contexto]] · [[00 - Rules e Arquivos de Instrucao]]

## O que é

**MCP (Model Context Protocol)** é um **padrão aberto** que define como uma IA se conecta a **sistemas externos** — bancos de dados, APIs, serviços, ferramentas — de forma uniforme. Pense nele como uma "tomada padrão" (analogia comum: o "USB-C da IA"): em vez de cada ferramenta inventar sua própria integração com cada serviço, todos falam o mesmo protocolo.

> [!important] O problema que o MCP resolve
> Do Módulo 01: a IA só conhece o que está no contexto e **não acessa nada do mundo por conta própria**. Sem MCP, para a IA saber o conteúdo de uma issue ou o schema do seu banco, **você** copia e cola. Com MCP, a IA pede ao **servidor MCP** daquele sistema e recebe o dado — atualizado, estruturado, sob demanda. MCP é a ponte entre a IA e os sistemas que ela não vê.

### Os dois lados
- **Servidor MCP (MCP server):** um adaptador que expõe um sistema (ex.: GitHub, Postgres, Jira, sistema de arquivos) via o protocolo. Você instala/configura servidores.
- **Cliente MCP (MCP client):** a ferramenta de IA (Claude Code, Cursor, etc.) que se conecta a esses servidores e usa o que eles oferecem.

### O que um servidor MCP oferece
- **Tools (ferramentas):** ações que a IA pode executar (ex.: "rodar uma query", "criar uma issue").
- **Resources (recursos):** dados que a IA pode ler (ex.: o conteúdo de um arquivo, um registro).
- **Prompts:** modelos de interação pré-definidos pelo servidor.

## Como usar da melhor maneira

> [!tip]
> 1. **Adicione só os servidores que você usa.** Cada servidor adiciona ferramentas ao contexto; muitos = ruído e mais superfície de risco.
> 2. **Prefira escopo mínimo de permissão.** Um MCP de banco em produção deveria ser **somente leitura** salvo necessidade real.
> 3. **Cuidado com segredos.** Tokens/credenciais de MCP ficam na **config**, nunca dentro de Rules versionadas no Git.
> 4. **Confie na fonte do servidor.** Um servidor MCP roda com acesso ao que você concede; instale apenas servidores confiáveis (atenção a "prompt injection" vindo de dados externos).
> 5. **Documente nas Rules quando usar cada MCP** — assim a IA sabe que pode buscar a issue em vez de pedir que você cole.

## Qual o melhor lugar para usar

✅ Bom uso:
- **Banco de dados:** "descreva o schema da tabela `orders`" sem você colar DDL.
- **GitHub/GitLab:** ler/criar issues e PRs, consultar diffs.
- **Documentação/Design:** puxar specs de uma fonte (Notion, Figma, etc.).
- **Sistema de arquivos / serviços internos** sob protocolo padrão.

❌ Evite:
- Conectar tudo "por garantia" — cada conexão é contexto e risco.
- Dar acesso de escrita a sistemas críticos sem necessidade.
- Usar MCP onde um arquivo local (Rule/Skill) já resolve.

## Onde o MCP se encaixa entre os conceitos

| Conceito | Responde a... |
|---|---|
| Rules | quais regras valem sempre |
| Skills | como executar um procedimento |
| Subagents | a quem delegar uma tarefa isolada |
| **MCP** | **como acessar sistemas/dados externos** |

São complementares. Um subagente pode usar uma tool de MCP; uma skill pode instruir o uso de um MCP.

## Comparação entre ferramentas

A grande vantagem do MCP é justamente **não** ser específico de ferramenta:

| Ferramenta | Suporte a MCP |
|---|---|
| **Claude Code** | cliente MCP nativo; servidores configurados por projeto/usuário |
| **Cursor** | suporte a servidores MCP |
| **GitHub Copilot** | suporte a MCP em evolução |

Como o protocolo é aberto, **o mesmo servidor MCP** (ex.: o do Postgres) funciona em qualquer cliente compatível. Você configura o servidor uma vez e reaproveita.

## Cenário de exemplo (Flutter / Dart)

Seu app Flutter consome uma API cujo backend usa Postgres, e as tarefas vêm de issues no GitHub.

**Sem MCP:** você cola o schema da tabela e o texto da issue em cada prompt.

**Com MCP (servidor GitHub + servidor Postgres só-leitura):**
> "Implemente a tela descrita na **issue #142**. O endpoint retorna dados da tabela `products` — confira os campos reais no banco e gere o `Product` model e o parsing compatível."

A IA:
1. Lê a **issue #142** via MCP do GitHub (requisitos atualizados).
2. Consulta o **schema de `products`** via MCP do Postgres (campos e tipos reais).
3. Gera o `Product` model alinhado ao banco e à issue — sem você copiar nada manualmente, e sem risco de usar um schema desatualizado.

## Armadilhas comuns

> [!warning]
> - **Excesso de servidores** → muitas ferramentas no contexto, IA confusa e mais lenta.
> - **Permissões largas** (escrita em produção) → risco real; prefira leitura.
> - **Confiar cegamente em dados externos** → conteúdo de uma issue/página pode conter instruções maliciosas (prompt injection). Revise ações sensíveis.
> - **Segredos em arquivos versionados** → mantenha credenciais na config, fora do Git.

## Resumo

MCP é o padrão aberto que dá à IA acesso controlado a sistemas externos (bancos, GitHub, docs) via servidores reutilizáveis. Use poucos, com permissão mínima, e documente quando usá-los. Com Rules, Skills, Subagents e MCP entendidos, falta amarrar tudo num método — o próximo módulo.

---
**Próximo passo:** transformar tudo isso num fluxo disciplinado → [[00 - Spec Driven Development (SDD)]]
