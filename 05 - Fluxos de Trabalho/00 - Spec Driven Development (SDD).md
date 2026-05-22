# Spec Driven Development (SDD)

> [!abstract] Pré-requisitos
> [[00 - Engenharia de Prompt]] · [[00 - Rules e Arquivos de Instrucao]] · [[03 - MCPs]]

Este é um dos tópicos que você marcou para pesquisar ([[Noções básicas]]): SDD e as ferramentas **kiro**, **open-spec** e **spec-kit**.

## O que é

**Spec-Driven Development (SDD)** é uma metodologia em que a **especificação escrita** é o artefato central e durável do projeto, e o **código é uma saída regenerável** produzida a partir dela — por você, pela IA, ou pelos dois. Em vez de "ir conversando com a IA e ver no que dá" (prompting iterativo e caótico), você **formaliza a intenção primeiro** e só então gera o código.

> [!important] O problema que o SDD resolve
> Prompting solto funciona para tarefas pequenas, mas em features grandes vira um telefone-sem-fio: a IA esquece decisões, você re-explica, o resultado deriva. O SDD ataca isso colocando a **spec como fonte da verdade**: a intenção fica registrada, revisável e reaproveitável — exatamente o tipo de contexto estável que o [[01 - Engenharia de Contexto]] valoriza.

## O fluxo mental do SDD

Quase todas as ferramentas seguem variações deste ciclo:

```
1. Princípios/regras  →  2. Especificar (o quê e porquê)  →
3. Planejar (o como, stack, arquitetura)  →
4. Quebrar em tarefas  →  5. Implementar  →  6. Revisar/validar
```

A diferença para o "vibe coding": as fases 1–4 acontecem **antes** de gerar código, são **documentos revisáveis** (baratos de corrigir) e guiam a fase 5.

## As ferramentas (panorama 2026)

> [!note] SDD não é uma coisa só
> As três ferramentas abaixo se dizem "SDD", mas são **bem diferentes**. Entenda a filosofia de cada uma antes de escolher.

### spec-kit (GitHub) — *o mais portável*
- **O que é:** toolkit open-source (CLI em Python, licença MIT) que estrutura o projeto em torno de specs. Funciona com **vários agentes** (Claude Code, Copilot, Gemini CLI, Cursor, Windsurf...). É o mais adotado pela comunidade.
- **Como funciona:** instala comandos no seu agente. Fluxo por fases via slash commands:
  - `/speckit.constitution` — define princípios/regras de governança do projeto (vira `.specify/memory/constitution.md`).
  - `/speckit.specify` — descreve **o quê** e **porquê** (requisitos, user stories), sem tecnologia.
  - `/speckit.clarify` *(opcional)* — perguntas estruturadas para resolver ambiguidades antes de planejar.
  - `/speckit.plan` — define **o como**: stack, arquitetura, plano técnico.
  - `/speckit.tasks` — quebra o plano em tarefas acionáveis com dependências.
  - `/speckit.implement` — executa as tarefas na ordem correta.
- **Para quem:** quer disciplina de spec **sem trocar de ferramenta** nem ficar preso a um fornecedor.

### Kiro (AWS) — *a IDE spec-first*
- **O que é:** uma **IDE agêntica** construída em torno do SDD. Em vez de você programar e pedir ajuda, o Kiro exige **formalizar a intenção primeiro**.
- **Como funciona:** trabalha com `requirements` (frequentemente em **notação EARS**, um formato estruturado de requisitos), `design` e `tasks`.
- **Trade-offs:** ótimo em projetos **greenfield** médios/grandes e forte integração com o ecossistema **AWS**. Quem não está na AWS sente atrito (lock-in) e a notação EARS pode ser overhead para mudanças pequenas.

### OpenSpec — *foco em brownfield*
- **O que é:** opção open-source voltada a projetos **brownfield** (já existentes), onde a fragmentação de specs costuma doer.
- **Como funciona:** filosofia de **fonte única da verdade** — concentra a especificação em vez de espalhá-la, endereçando uma fraqueza comum de Kiro e spec-kit (specs distribuídas/fragmentadas).
- **Para quem:** quer trazer disciplina de spec a uma base de código que **já existe**.

| Ferramenta | Tipo | Melhor cenário | Atenção |
|---|---|---|---|
| **spec-kit** | CLI open-source, multi-agente | portabilidade, sem lock-in | você monta a disciplina |
| **Kiro** | IDE agêntica (AWS) | greenfield + AWS | lock-in, overhead do EARS |
| **OpenSpec** | open-source, single-source | brownfield, anti-fragmentação | ecossistema mais novo |

## Como usar da melhor maneira

> [!tip]
> 1. **Comece leve.** Você não precisa de uma ferramenta para fazer SDD: escrever uma spec em Markdown e pedir um plano antes do código **já é** SDD.
> 2. **Spec foca no quê/porquê; plano foca no como.** Não misture — separar facilita revisar.
> 3. **Revise a spec e o plano** (barato) antes de gerar muito código (caro de revisar). Esse é o ganho central.
> 4. **A spec é viva e versionada.** Ela evolui com o projeto e mora no Git.
> 5. **Experimente o spec-kit primeiro** se você usa um agente CLI como o Claude Code — é o caminho mais portável para a sua stack.

## Qual o melhor lugar para usar

✅ **Vale muito** em:
- Features médias/grandes com várias telas/regras.
- Trabalho em equipe (a spec alinha todos + a IA).
- Quando você quer reduzir retrabalho e deriva.

❌ **Excesso** para:
- Um bugfix de uma linha ou um ajuste trivial (use prompt direto).
- Protótipos descartáveis onde a velocidade > rigor.

## Cenário de exemplo (Flutter / Dart) — SDD leve, sem ferramenta dedicada

Feature: **carrinho de compras**. Em vez de "faz um carrinho":

1. **Spec** (`docs/specs/carrinho.md`): o quê e porquê — adicionar/remover itens, atualizar quantidade, calcular total com desconto, persistir entre sessões. Regras de negócio explícitas.
2. **Plano:** peça à IA — *"com base nesta spec, proponha o plano técnico: BLoC do carrinho, modelo de dados, persistência com `hive`, pontos de teste."* Você **revisa e ajusta**.
3. **Tarefas:** *"quebre o plano em tarefas pequenas e ordenadas."*
4. **Implementar:** execute tarefa a tarefa, revisando cada diff.

Com spec-kit, os passos 1–4 viram `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement` — mas o **raciocínio é o mesmo**, e você pode começar manualmente hoje.

## Armadilhas comuns

> [!warning]
> - **Burocracia excessiva** em tarefas pequenas — SDD é para o que tem complexidade que justifique.
> - **Spec que vira código disfarçado** — a spec é o quê/porquê, não a implementação.
> - **Escrever a spec e nunca atualizá-la** — spec morta engana mais que ajuda.
> - **Adotar uma IDE/ferramenta nova antes de entender o conceito** — comece leve, em Markdown.

## Resumo

SDD coloca a especificação como fonte da verdade e o código como saída regenerável: especificar → planejar → tarefas → implementar, com revisão barata antes de gerar muito código. spec-kit (portável), Kiro (IDE/AWS) e OpenSpec (brownfield) são sabores diferentes — mas você pode praticar SDD hoje só com Markdown e bons prompts. A seguir: como amarrar tudo do curso num fluxo único.

---
**Próximo passo:** juntar prompt + contexto + rules + skills + agentes + SDD → [[01 - Orquestrando Workflows]]
