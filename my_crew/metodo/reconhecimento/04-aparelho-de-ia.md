# Reconhecimento 04 — Aparelho de IA existente

> **Papel:** `metodo/papeis/harness-scout.md` — leia-o inteiro antes de começar.
> **Só leitura.** Sem tripulação, sem gate. **Teto de leitura: 12 arquivos · teto de saída: 250 linhas.**
> **Saída:** `<PACOTE>/projetos/<slug>/ficha/04-aparelho-de-ia.md`

## O que esta fatia responde

O que o projeto **já instalou** de instrução para assistentes — regras, agentes, prompts,
documentos de instrução — e **como a tripulação convive com isso**.

É a fatia que impede o pior desfecho possível da adoção: duas doutrinas de revisão rodando ao
mesmo tempo, discordando uma da outra, e ninguém sabendo qual vale.

## Onde procurar

Varra os locais convencionados de cada ecossistema, sem supor qual está em uso:

- instruções de projeto na raiz (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, e equivalentes);
- diretórios de configuração de assistente (`.claude/`, `.cursor/`, `.github/` e semelhantes) —
  **inclusive os que o `.gitignore` esconde**, porque instrução local de outro dev revela
  convenção viva;
- agentes, papéis, skills e prompts versionados em qualquer pasta;
- configuração de hook ou gate já instalada;
- assistente de revisão configurado no lado do servidor (bot de PR, revisor automático).

⚠️ **Um arquivo ignorado pelo git é fato, não segredo.** Registre que existe e o que
determina. Não copie conteúdo pessoal de ninguém para a ficha — resuma o que é normativo.

## A classificação — é isto que o dev vai decidir

Cada artefato encontrado recebe um desfecho **proposto** por você, com justificativa. Quem
decide é o dev:

| Desfecho | Quando | Consequência |
|---|---|---|
| **complementa** | cobre algo que a tripulação não cobre, ou cobre melhor | vira ferramenta citada durante a execução: o papel correspondente é instruído a carregá-lo |
| **conflita** | manda o oposto de um papel da tripulação | **precisa de regra de precedência explícita**, decidida pelo dev |
| **ignorar** | obsoleto, experimental, ou fora do escopo | registrado e não usado |

⚠️ **Viés obrigatório em caso de conflito: a convenção da casa ganha.** Se o projeto manda
escrever teste de um jeito e o método sugere outro, vale o do projeto. A tripulação agrega
processo — ela não reforma a cultura de um projeto que não é seu.

⚠️ **Nome colidindo é conflito, mesmo quando a doutrina não é.** Um agente do projeto chamado
`code-reviewer` e o papel `coder-reviewer` da tripulação convivem mal: alguém vai chamar o
errado. Registre a colisão explicitamente e proponha qual dos dois é renomeado na instalação.

## Estrutura da saída

```markdown
# Ficha — 04. Aparelho de IA existente

> Levantado em <data> · teto: 12 arquivos (<usados>)

## Já em contexto (não relido)

## Inventário
| Artefato | Ferramenta | Versionado? | O que determina | Desfecho proposto | Justificativa |
|---|---|---|---|---|---|

## Conflitos
| Artefato | Conflita com | Natureza | Precedência proposta |
|---|---|---|---|

## Colisões de nome
| Nome do projeto | Papel da tripulação | Renomear qual? |
|---|---|---|

## Hooks e gates já instalados
<o que já intercepta ação de assistente, e o que ele bloqueia — importa para não instalar
um segundo gate que brigue com o primeiro>

## Onde o ponteiro do pacote deve ser colado
<quais documentos de instrução este projeto de fato usa>

## Não coberto
## Perguntas ao dev
```

## Perguntas que costumam sobrar

- Qual destas instruções o time **de fato** segue, e qual ficou para trás?
- Em conflito, o que vence: a regra do projeto ou o papel da tripulação?
- Há bot de revisão no PR cujo trabalho a tripulação estaria repetindo de graça?
