# 🗺️ Mapa do Curso — Desenvolvimento com IA

> [!info] O que é este espaço
> Uma trilha de estudo, no formato de roadmap, para sair do uso "tímido" e pontual da IA e chegar a um uso intencional, produtivo e seguro no dia a dia de desenvolvimento — com foco na stack **Flutter / Dart**.
>
> A trilha foi montada a partir das minhas anotações originais em [[Noções básicas]].

## Como usar esta trilha

- Os módulos são **progressivos**: cada um assume que você já leu os anteriores.
- Os números nos nomes (`00`, `01`, ...) definem a ordem de leitura.
- Cada nota tem no fim um **Próximo passo** com link para a seguinte.
- Use o **grafo do Obsidian** para ver como os conceitos se conectam.

## A trilha

### 🧱 Módulo 01 — Fundamentos
O alicerce mental. Por que mudar a postura e como uma IA realmente "lê" seu código.
- [[00 - Por que usar IA no desenvolvimento]]
- [[01 - Como a IA enxerga seu projeto]]

### 💬 Módulo 02 — Comunicação com a IA
Como falar com a IA e, mais importante, o que colocar na frente dela.
- [[00 - Engenharia de Prompt]]
- [[01 - Engenharia de Contexto]]

### 🛠️ Módulo 03 — Ferramentas e Ambiente
O panorama das ferramentas atuais e como montar seu setup sem abandonar o Android Studio.
- [[00 - Panorama de Ferramentas]]
- [[01 - IDEs e Setup]]

### ⚙️ Módulo 04 — Configurando o Agente
O coração das suas dúvidas: como a IA enxerga as pastas de `.md`, e como configurar Rules, Skills, Subagents e MCPs.
- [[00 - Rules e Arquivos de Instrucao]]
- [[01 - Skills]]
- [[02 - Agents e Subagents]]
- [[03 - MCPs]]

### 🔄 Módulo 05 — Fluxos de Trabalho
Metodologias que amarram tudo: Spec-Driven Development e orquestração de workflows.
- [[00 - Spec Driven Development (SDD)]]
- [[01 - Orquestrando Workflows]]

### 📱 Módulo 06 — Aplicação Prática em Flutter
Pondo tudo junto em um projeto Flutter real.
- [[00 - Estruturando um Projeto Flutter para IA]]
- [[01 - Casos de Uso de Ponta a Ponta]]

### 📚 Módulo 07 — Referência
- [[00 - Glossario]]

## Dependências entre módulos

```
01 Fundamentos
   └─> 02 Comunicação
          └─> 03 Ferramentas
                 └─> 04 Configurando o Agente
                        └─> 05 Fluxos de Trabalho
                               └─> 06 Aplicação Prática
01..06 ──> 07 Referência (consulta a qualquer momento)
```

## Mapa mental rápido (o vocabulário)

| Conceito | Pergunta que ele responde | Módulo |
|---|---|---|
| Prompt | *Como peço?* | 02 |
| Contexto | *O que a IA está vendo?* | 01, 02 |
| Rules | *Quais regras valem sempre neste projeto?* | 04 |
| Skill | *Como executo este procedimento?* | 04 |
| Subagent | *Para quem delego esta tarefa especializada?* | 04 |
| MCP | *Como a IA acessa sistemas externos?* | 04 |
| SDD | *Como transformo intenção em código de forma disciplinada?* | 05 |

---
**Comece por:** [[00 - Por que usar IA no desenvolvimento]]
