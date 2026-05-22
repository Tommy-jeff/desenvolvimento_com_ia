# Orquestrando Workflows

> [!abstract] Pré-requisitos
> Todo o Módulo 04 ([[00 - Rules e Arquivos de Instrucao]], [[01 - Skills]], [[02 - Agents e Subagents]], [[03 - MCPs]]) e [[00 - Spec Driven Development (SDD)]].

## O que é

Até aqui você viu as peças isoladas. **Orquestrar um workflow** é combiná-las num **fluxo repetível** do início ao fim de uma tarefa — de "tenho uma ideia" a "código revisado e mergeado". É aqui que a postura de **orquestrador** ([[00 - Por que usar IA no desenvolvimento]]) se concretiza.

> [!important] A ideia central
> Nenhuma peça resolve sozinha. Rules dão as convenções, contexto dá o material, prompt dá a direção, skills dão o procedimento, subagents isolam o trabalho pesado, MCP traz dados externos, e o SDD dá a espinha dorsal. **Orquestrar é saber qual peça entra em cada momento.**

## O loop fundamental

Independente de ferramenta, todo bom fluxo com IA segue este ciclo:

```
EXPLORAR → PLANEJAR → IMPLEMENTAR → VERIFICAR → COMMITAR
   ↑                                              │
   └──────────────── iterar ──────────────────────┘
```

1. **Explorar** — entender o terreno. (Leitura de arquivos, subagente de busca.)
2. **Planejar** — propor um plano e **você revisa** antes de gerar código. (SDD, "peça o plano primeiro".)
3. **Implementar** — gerar o código em fatias pequenas. (Prompt + Skills + Rules guiando.)
4. **Verificar** — rodar testes, analisar, revisar o diff. (Subagente revisor, quality gate.)
5. **Commitar** — pequeno e frequente, com mensagem clara. (Sua rede de segurança.)

> [!tip] Por que "planejar antes de implementar" é a regra mais valiosa
> Revisar um plano de 15 linhas é barato; revisar 400 linhas de código gerado é caro e você tende a aprovar no automático. Forçar o plano antes economiza retrabalho e mantém **você** no comando das decisões.

## Como as peças se encaixam no loop

| Fase | Peças que entram |
|---|---|
| Explorar | Subagent de busca, MCP (issue/banco), leitura curada de arquivos |
| Planejar | SDD (spec/plano), prompt pedindo plano, Rules como restrições |
| Implementar | Prompt fatiado, Skills (procedimentos), Rules (convenções) |
| Verificar | Subagent revisor (só-leitura), quality gate (testes/analyze) |
| Commitar | Git; você como revisor final |

## Como usar da melhor maneira

> [!tip]
> 1. **Tenha as Rules prontas antes** de começar a sessão — elas guiam todas as fases.
> 2. **Separe planejamento de execução.** Muitos agentes têm um "modo plano" — use-o.
> 3. **Fatie.** Uma tarefa = um loop curto. Tarefa grande = vários loops encadeados (é o que o SDD faz com "tasks").
> 4. **Delegue o ruído.** Investigação e revisão vão para subagentes; sua janela principal fica para decisões.
> 5. **Commits pequenos** entre os loops — assim qualquer passo ruim é trivial de reverter.
> 6. **Feche o loop com verificação real**, não com "parece certo": rode os testes e o app.

## Qual o melhor lugar para usar

- **Toda tarefa não-trivial** se beneficia do loop, mesmo sem ferramenta de SDD.
- O **rigor escala com o tamanho**: bugfix pequeno = loop mental rápido; feature grande = SDD formal com tasks.

## Cenário de exemplo (Flutter / Dart) — fluxo completo

Tarefa: **"adicionar notificações push"** (feature grande).

1. **Explorar:** subagente investiga onde inicializar serviços e como o app trata permissões hoje; MCP do GitHub traz os critérios da issue.
2. **Planejar:** *"com base na issue e no que achamos, proponha o plano: integração FCM, serviço de notificação, permissões iOS/Android, deep link ao tocar, pontos de teste."* Você revisa e corta o escopo da v1.
3. **Tarefas:** quebra em 6 tarefas ordenadas.
4. **Implementar:** tarefa a tarefa. As **Rules** garantem o padrão BLoC; uma **Skill** `criar-feature-bloc` padroniza a estrutura. Você revisa cada diff.
5. **Verificar:** quality gate (`dart format`, `flutter analyze`, `flutter test`); subagente revisor aponta um `late` arriscado; você roda no emulador e dispara uma push de teste.
6. **Commitar:** um commit por tarefa concluída.

Todas as peças do curso, num fluxo só — com você dirigindo.

## Anti-padrões de orquestração

> [!warning]
> - **Pular o plano** e mandar implementar uma feature grande de uma vez.
> - **Mega-sessão** que acumula 10 tarefas e estoura o contexto (ver [[01 - Engenharia de Contexto]]).
> - **Confiar sem verificar** — fechar o loop sem rodar testes/app.
> - **Não commitar** entre passos — perde a rede de segurança.
> - **Tudo na janela principal** — sem delegar o ruído, a IA perde o foco.

## Resumo

Orquestrar é rodar o loop **explorar → planejar → implementar → verificar → commitar**, encaixando a peça certa (Rules, Skill, Subagent, MCP, SDD) em cada fase, sempre com você no comando das decisões e da verificação. A seguir, aterrissamos tudo num projeto Flutter de verdade.

---
**Próximo passo:** preparar um projeto Flutter para esse fluxo → [[00 - Estruturando um Projeto Flutter para IA]]
