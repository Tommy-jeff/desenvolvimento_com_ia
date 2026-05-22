# Agents e Subagents

> [!abstract] Pré-requisitos
> [[01 - Skills]] · [[01 - Engenharia de Contexto]]

## O que é

Primeiro, desfazendo a confusão de nomes:

- **Agente (agent):** qualquer IA que não só responde, mas **age em loop** — lê arquivos, edita, roda comandos, observa o resultado e decide o próximo passo. O Claude Code é um agente. (Visto no [[00 - Panorama de Ferramentas]].)
- **Subagente (subagent):** um agente **filho**, especializado, que o agente principal **invoca para delegar** uma sub-tarefa. Ele roda com **contexto próprio** (uma janela separada), faz o trabalho e devolve só a **conclusão** ao agente principal.

> [!important] Por que subagentes existem (ligando ao Módulo 01-02)
> Lembre do "orçamento de contexto" ([[01 - Engenharia de Contexto]]). Tarefas barulhentas — ler 30 arquivos para achar algo, investigar um bug amplo — encheriam a janela principal de ruído. Um subagente faz esse trabalho sujo **na janela dele** e te entrega só o resultado limpo. É **isolamento de contexto**: o principal continua focado.

### Os 3 ganhos dos subagentes
1. **Isolamento de contexto** — o trabalho pesado não polui a conversa principal.
2. **Especialização** — cada subagente tem um papel, ferramentas e até modelo próprios (ex.: um revisor só-leitura; um pesquisador em modelo mais barato).
3. **Paralelismo** — vários subagentes podem rodar ao mesmo tempo (ex.: investigar 3 áreas do código de uma vez).

## Anatomia (formato Claude Code)

Subagentes são definidos por arquivos Markdown, tipicamente em `.claude/agents/`:

```
.claude/agents/
  revisor-flutter.md
```

```markdown
---
name: revisor-flutter
description: Revisa código Dart/Flutter buscando problemas de null-safety,
  rebuilds desnecessários e violações do padrão BLoC. Acesso somente leitura.
tools: Read, Grep, Glob
---

Você é um revisor de código Flutter sênior. Para o diff fornecido:
1. Aponte riscos de null/late.
2. Sinalize widgets que reconstroem demais.
3. Verifique aderência ao padrão BLoC do projeto.
Responda com uma lista priorizada; não edite arquivos.
```

A `description` diz ao agente principal **quando delegar** a este subagente; `tools` limita o que ele pode fazer (um revisor não precisa escrever).

## Como usar da melhor maneira

> [!tip]
> 1. **Delegue tarefas isoláveis e bem definidas.** "Investigar", "revisar", "pesquisar onde X é usado" são ideais.
> 2. **Dê o papel e limite as ferramentas.** Revisor → só leitura. Isso é segurança e foco.
> 3. **Escolha o modelo certo por tarefa.** Pesquisa/varredura → modelo rápido e barato; raciocínio difícil → modelo mais forte.
> 4. **Peça conclusões, não despejos.** O valor do subagente é te devolver o **resumo**, não 40 arquivos.
> 5. **Use paralelismo** quando as sub-tarefas são independentes.
> 6. **Não delegue o que precisa do seu julgamento contínuo** — decisões de arquitetura ficam com você (e com o agente principal sob sua supervisão).

## Qual o melhor lugar para usar

✅ Bom uso:
- Revisão de código antes do merge (subagente revisor só-leitura).
- "Onde e como `AuthService` é usado em todo o app?" (subagente de busca).
- Investigar um bug que exige varrer muitos arquivos.
- Rodar tarefas independentes em paralelo.

❌ Evite:
- Delegar uma tarefa minúscula (o overhead não compensa — faça direto).
- Esperar que o subagente "lembre" da sua conversa — ele começa **do zero**, com o contexto que você passar.

## Skill vs. Subagent (não confunda)

| | Skill | Subagent |
|---|---|---|
| O que é | um **procedimento** (como fazer X) | um **executor** (alguém que faz X) |
| Contexto | entra na **sua** janela | janela **própria**, isolada |
| Quando usar | "siga estes passos" | "delegue isto a um especialista" |
| Devolve | instruções aplicadas na conversa | uma **conclusão** resumida |

Eles se combinam: um subagente pode usar uma skill para executar seu trabalho.

## Comparação entre ferramentas

| Ferramenta | Equivalente |
|---|---|
| **Claude Code** | **Subagents** (`.claude/agents/*.md`), invocados pela Task tool |
| **Cursor** | modos/agentes customizados; execução em background |
| **GitHub Copilot** | "agent mode" / agentes de tarefa |

A ideia — **delegar a um executor isolado e especializado** — é comum; a maturidade e os formatos variam.

## Cenário de exemplo (Flutter / Dart)

Você terminou uma feature grande de checkout. Antes de abrir o PR:

1. Pede ao agente principal: *"revise o diff do checkout."*
2. Ele invoca o subagente **`revisor-flutter`** (só-leitura), que lê o diff **na janela dele**, sem encher a sua.
3. O subagente devolve: *"3 pontos: (a) `late` sem inicialização em `checkout_bloc.dart:22`; (b) `ListView` sem `key` causando rebuild; (c) chamada de rede sem mapear `DioException`."*
4. Você decide o que aplicar — a conversa principal ficou limpa e focada.

Em paralelo, você poderia disparar outro subagente para *"verificar se há strings sem i18n na feature"* — os dois rodando ao mesmo tempo.

## Armadilhas comuns

> [!warning]
> - **Achar que o subagente conhece sua conversa** — ele não conhece; passe o contexto necessário.
> - **Delegar tarefas triviais** — overhead maior que o ganho.
> - **Dar ferramentas demais** a um subagente de revisão (risco de ele editar/quebrar algo).
> - **Pedir o despejo** em vez da conclusão — perde-se o benefício do isolamento.

## Resumo

Subagentes são executores especializados com contexto próprio: isolam ruído, permitem especialização e paralelismo. Use-os para delegar trabalho isolável (revisar, investigar, buscar) e receber conclusões limpas. A seguir: como dar à IA acesso ao mundo externo — MCPs.

---
**Próximo passo:** conectar a IA a sistemas externos → [[03 - MCPs]]
