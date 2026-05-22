# Casos de Uso de Ponta a Ponta

> [!abstract] Pré-requisitos
> [[00 - Estruturando um Projeto Flutter para IA]] e o loop de [[01 - Orquestrando Workflows]].

Esta nota fecha o curso mostrando **tudo junto** em situações reais de um dev Flutter. Cada caso indica quais peças do curso entram. Use como receituário.

---

## Caso 1 — Boilerplate confiável (nível: fácil)

**Situação:** preciso de um model `Product` imutável com serialização e testes.

**Fluxo:**
- **Prompt** ([[00 - Engenharia de Prompt]]) específico: campos, imutabilidade, `fromJson/toJson`, `copyWith`, igualdade, e testes.
- As **Rules** já dizem "null-safety, snake_case nos arquivos, todo código tem teste".
- **Verificar:** rodar `flutter test`.

**O que aprender aqui:** o ganho imediato e de baixo risco. Comece por aqui se ainda está inseguro com IA.

---

## Caso 2 — Entender e refatorar código legado (nível: fácil/médio)

**Situação:** herdei uma `HomePage` de 600 linhas e preciso mexer nela sem quebrar.

**Fluxo:**
1. **Explorar:** *"explique o que esta `HomePage` faz, liste responsabilidades e dependências."* (Contexto curado: só o arquivo.)
2. **Planejar:** *"proponha um plano para extrair a lógica de rede para um repositório e o estado para um Cubit, sem mudar comportamento."* Você revisa.
3. **Proteger:** peça **testes de caracterização** do comportamento atual antes de refatorar.
4. **Implementar** em fatias; **verificar** que os testes seguem verdes.

**Peças:** [[01 - Engenharia de Contexto]], plano antes de código, testes como contrato.

---

## Caso 3 — Feature média com fonte externa (nível: médio)

**Situação:** implementar a tela descrita na **issue #142**, que consome a tabela `products`.

**Fluxo:**
1. **MCP** ([[03 - MCPs]]) do GitHub traz a issue; MCP do banco (só-leitura) confirma os campos reais de `products`.
2. **Planejar:** model + repositório + Cubit + UI + testes; você ajusta o escopo.
3. **Implementar** com a **Skill** `criar-feature-bloc` garantindo a estrutura padrão.
4. **Verificar:** quality gate + rodar no emulador.

**Peças:** MCP, Skills, Rules, loop completo. O destaque é a IA usar **dados reais e atualizados**, não o que você lembrou de colar.

---

## Caso 4 — Feature grande com SDD (nível: avançado)

**Situação:** notificações push de ponta a ponta.

**Fluxo (SDD — [[00 - Spec Driven Development (SDD)]]):**
1. **Especificar:** `docs/specs/push.md` — o quê/porquê, regras, escopo da v1.
2. **Planejar:** integração FCM, serviço, permissões iOS/Android, deep link, pontos de teste. Você corta escopo.
3. **Tarefas:** 6 tarefas ordenadas com dependências.
4. **Implementar:** tarefa a tarefa, **commit por tarefa**.
5. **Verificar:** **subagente revisor** ([[02 - Agents e Subagents]]) lê o diff; quality gate; teste manual de uma push.

**Peças:** SDD + subagents + todo o Módulo 04 + orquestração. Aqui o rigor evita a deriva típica de features grandes.

---

## Caso 5 — Revisão e qualidade antes do PR (nível: médio)

**Situação:** terminei uma feature e quero uma segunda opinião antes do merge.

**Fluxo:**
- **Subagente revisor** (só-leitura) avalia null-safety, rebuilds, aderência ao padrão BLoC e segurança.
- Roda em **paralelo** com outro subagente que checa strings sem i18n.
- Você recebe duas listas priorizadas e decide o que aplicar.

**Peças:** [[02 - Agents e Subagents]], isolamento de contexto, paralelismo.

---

## Caso 6 — Testes para código existente (nível: médio)

**Situação:** um `CartCubit` sem testes.

**Fluxo:**
- **Skill** `gerar-testes-bloc` com template `blocTest` + `mocktail`.
- *"gere testes do `CartCubit` cobrindo adicionar/remover item, recalcular total e falha de persistência."*
- **Verificar:** cobertura e `flutter test`.

**Peças:** Skills, prompt específico, testes como contrato.

---

## Tabela-resumo: que peça usar quando

| Quero... | Peça principal |
|---|---|
| Gerar boilerplate/testes rápidos | Prompt + Rules |
| Entender/refatorar código existente | Contexto curado + plano + testes |
| Padronizar um procedimento repetido | Skill |
| Delegar revisão/investigação | Subagent |
| Usar dados externos (issue, banco) | MCP |
| Tocar uma feature grande sem deriva | SDD + loop completo |

## Próximos passos sugeridos (sua prática)

> [!tip] Plano de adoção gradual
> 1. **Semana 1:** escreva o `CLAUDE.md`/`AGENTS.md` do seu projeto e use a IA só para boilerplate e testes (Casos 1 e 6).
> 2. **Semana 2:** adote o loop **planejar antes de implementar** numa feature média (Caso 3).
> 3. **Semana 3:** crie 1–2 Skills dos seus procedimentos repetidos.
> 4. **Semana 4:** experimente um subagente revisor (Caso 5) e, numa feature grande, o SDD leve (Caso 4).
>
> Suba a régua só quando a anterior virar hábito. A meta não é usar tudo — é usar **com intenção**.

## Resumo

Os conceitos do curso não vivem isolados: cada caso real combina algumas peças. Comece pelos casos fáceis e de baixo risco, suba a régua conforme a confiança cresce, e mantenha sempre o humano no comando da revisão. Você saiu da resistência para a **orquestração intencional** — que era o objetivo.

---
**Voltar ao mapa:** [[00 - Mapa do Curso]] · **Consulta rápida:** [[00 - Glossario]]
