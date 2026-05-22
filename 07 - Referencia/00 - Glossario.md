# Glossário

> [!abstract] Como usar
> Consulta rápida dos termos do curso. Cada verba aponta para o módulo onde o assunto é aprofundado. Volte ao [[00 - Mapa do Curso]] a qualquer momento.

## Fundamentos

**LLM (Large Language Model)** — o "motor" de IA por trás de Claude, GPT, Gemini. Prevê texto a partir de texto. Não acessa seu disco nem a internet sozinho. → [[01 - Como a IA enxerga seu projeto]]

**Token** — unidade de texto que o modelo processa (~4 caracteres em inglês; um pouco mais "caro" em português). Tudo vira tokens: código, prompt e resposta. → [[01 - Como a IA enxerga seu projeto]]

**Janela de contexto (context window)** — limite de tokens que cabem por vez (entrada + saída). É a "mesa de trabalho" finita da IA. → [[01 - Como a IA enxerga seu projeto]]

**Statelessness (sem estado)** — cada requisição é independente; a "memória" da conversa é o histórico sendo reenviado a cada turno. → [[01 - Como a IA enxerga seu projeto]]

**Context rot** — degradação da qualidade quando a janela é enchida com informação irrelevante. Mais contexto ≠ melhor. → [[01 - Engenharia de Contexto]]

**Alucinação** — quando a IA afirma algo falso com confiança. Por isso: confiar, mas verificar. → [[00 - Por que usar IA no desenvolvimento]]

**Compactação (compaction)** — resumo automático do histórico quando ele fica grande; detalhes podem se perder. → [[01 - Como a IA enxerga seu projeto]]

## Comunicação

**Prompt** — a mensagem/instrução que você envia à IA. *Como você pede.* → [[00 - Engenharia de Prompt]]

**Engenharia de prompt** — estruturar instruções (papel, contexto, tarefa, restrições, formato, aceite) para resultados consistentes. → [[00 - Engenharia de Prompt]]

**Engenharia de contexto** — curar *o que* está na janela da IA (arquivos, histórico, regras). Hoje importa mais que prompt rebuscado. → [[01 - Engenharia de Contexto]]

**Few-shot / Zero-shot** — pedir com exemplos (few-shot) ou sem exemplos (zero-shot). → [[00 - Engenharia de Prompt]]

**Chain-of-thought** — pedir que a IA "pense passo a passo"; útil para lógica e debug. → [[00 - Engenharia de Prompt]]

## Ferramentas e ambiente

**Autocomplete** — IA que completa o que você digita, linha a linha (Copilot, Cursor Tab). → [[00 - Panorama de Ferramentas]]

**Agente (agent)** — IA que age em loop: lê, edita, executa, observa e decide o próximo passo (ex.: Claude Code). → [[00 - Panorama de Ferramentas]] · [[02 - Agents e Subagents]]

**Agente CLI** — agente que roda no terminal, sobre os arquivos do projeto; convive com o Android Studio. → [[01 - IDEs e Setup]]

**Stack de desenvolvimento (IA)** — combinação de editor/IDE + autocomplete + agente CLI + revisão + Rules/Skills/MCP. O "pacote atual". → [[00 - Panorama de Ferramentas]] · [[01 - IDEs e Setup]]

## Configurando o agente

**Rules / arquivos de instrução** — instruções permanentes do projeto, **sempre** carregadas (`CLAUDE.md`, `.cursor/rules`, `AGENTS.md`, `copilot-instructions.md`). Devem ser curtas. → [[00 - Rules e Arquivos de Instrucao]]

**`CLAUDE.md` / `AGENTS.md`** — arquivos de Rules. `AGENTS.md` é um formato aberto lido por várias ferramentas. → [[00 - Rules e Arquivos de Instrucao]]

**Skill** — pacote de procedimento (`SKILL.md`) carregado **sob demanda**, quando relevante. Pode ser extenso/numeroso sem pesar. A `description` é o gatilho. → [[01 - Skills]]

**Slash command** — comando reutilizável (`/comando`) que dispara um prompt/procedimento salvo. → [[01 - Skills]]

**Subagente (subagent)** — agente filho especializado, com **contexto próprio**, a quem se delega uma sub-tarefa; devolve só a conclusão. Dá isolamento, especialização e paralelismo. → [[02 - Agents e Subagents]]

**MCP (Model Context Protocol)** — padrão aberto ("USB-C da IA") para conectar a IA a sistemas externos (banco, GitHub, docs). → [[03 - MCPs]]

**Servidor MCP / Cliente MCP** — o adaptador que expõe um sistema (servidor) e a ferramenta de IA que o consome (cliente). → [[03 - MCPs]]

**Tools / Resources (MCP)** — ações que a IA pode executar (tools) e dados que pode ler (resources) via um servidor MCP. → [[03 - MCPs]]

**Prompt injection** — instrução maliciosa escondida em dados externos (issue, página) que tenta sequestrar o comportamento da IA. Risco a vigiar ao usar MCP. → [[03 - MCPs]]

## Fluxos de trabalho

**SDD (Spec-Driven Development)** — metodologia em que a especificação é a fonte da verdade e o código é saída regenerável. → [[00 - Spec Driven Development (SDD)]]

**spec-kit** — toolkit CLI open-source da GitHub para SDD, multi-agente e portável (`/speckit.specify`, `/plan`, `/tasks`, `/implement`...). → [[00 - Spec Driven Development (SDD)]]

**Kiro** — IDE agêntica (AWS) construída em torno de SDD; usa requisitos estruturados (notação EARS). → [[00 - Spec Driven Development (SDD)]]

**OpenSpec** — ferramenta SDD open-source com foco em projetos brownfield e fonte única da verdade. → [[00 - Spec Driven Development (SDD)]]

**EARS** — notação estruturada para escrever requisitos, usada no Kiro. → [[00 - Spec Driven Development (SDD)]]

**Loop de orquestração** — explorar → planejar → implementar → verificar → commitar, iterando. → [[01 - Orquestrando Workflows]]

**Quality gate** — portão automático (format + analyze + test + SAST) que valida também o código gerado por IA. → [[00 - Estruturando um Projeto Flutter para IA]]

**Vibe coding** — gerar código por prompting solto sem revisão/disciplina; aceitável em protótipos, arriscado em produção. → [[00 - Por que usar IA no desenvolvimento]] · [[00 - Spec Driven Development (SDD)]]

---
**Voltar ao mapa:** [[00 - Mapa do Curso]]
