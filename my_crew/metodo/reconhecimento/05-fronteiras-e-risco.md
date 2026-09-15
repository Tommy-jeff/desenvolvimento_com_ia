# Reconhecimento 05 — Fronteiras e risco

> **Papel:** `metodo/papeis/harness-scout.md` — leia-o inteiro antes de começar.
> **Só leitura.** Sem tripulação, sem gate. **Teto de leitura: 12 arquivos · teto de saída: 250 linhas.**
> **Saída:** `<PACOTE>/projetos/<slug>/ficha/05-fronteiras-e-risco.md`

## O que esta fatia responde

Onde o erro custa caro, onde a decisão não é sua, e como o trabalho sai daqui para o mundo. Em
projeto que não é seu, esta é a fatia que evita o constrangimento: mexer no que tinha dono,
instalar o que não podia, ou comitar no lugar de quem devia.

## As quatro perguntas

### 1. Áreas sensíveis — onde MÉDIO bloqueia como ALTO

Caminhos em que um defeito de severidade média tem consequência desproporcional. Procure por:
autenticação e sessão · migração de schema e escrita de dados · permissões e superfícies
públicas · dinheiro, cobrança e cálculo fiscal · integrações com sistema crítico · o próprio
aparato de build, release e assinatura.

Evidência de que uma área é sensível, em ordem de força: regra escrita > histórico de incidente
no repositório > densidade de teste muito acima da média > só a sua impressão (que **não**
basta — vira pergunta ao dev).

### 2. Fronteiras humanas — onde a aprovação é de gente

Donos de código declarados, times terceiros, superfícies com política própria. O efeito na
tripulação é direto: **tocar essas áreas sem aprovação registrada é achado ALTO do auditor de
entrega** — e descobrir isso na integração custa muito mais do que descobrir no planejamento.

### 3. Dependências e licenças

Como se adiciona dependência aqui: existe lista aprovada, registro interno, política de
licença, processo de segurança? A tripulação já proíbe dependência nova sem aprovação; esta
linha diz **de quem** é a aprovação e **como** se pede.

### 4. Quem comita, e como o trabalho sai

Política de branch, formato de mensagem de commit, exigências de PR, hooks de commit. E o fato
operacional mais importante: **`quem_comita` é `dev` ou `sessao`?**

⚠️ **Na dúvida, `dev`.** É o default seguro: a sessão que não comita nunca causa dano
irreversível, e o custo de errar para o outro lado é um commit indesejado no repositório de
outra pessoa.

## Onde procurar

Arquivo de donos de código · configuração de proteção de branch, se visível · modelo de PR ·
hooks de commit e sua configuração · política de dependências, quando documentada · histórico:
`git log --format='%an' | sort | uniq -c | sort -rn | head` revela se o repositório tem um dono
de fato ou muitas mãos.

## Estrutura da saída

```markdown
# Ficha — 05. Fronteiras e risco

> Levantado em <data> · teto: 12 arquivos (<usados>)

## Já em contexto (não relido)

## Áreas sensíveis (MÉDIO bloqueia como ALTO)
| Caminho / área | Por quê | Força da evidência | Fonte |
|---|---|---|---|

## Fronteiras humanas
| Caminho / área | Quem aprova | Fonte |
|---|---|---|

## Dependências e licenças
- Como se adiciona: <...> · Quem aprova: <...> · Política de licença: <...> · Fonte: <...>

## Saída do trabalho
- Branch: <padrão> · Mensagem de commit: <formato> · PR: <exigências>
- Hooks de commit: <o que roda e o que bloqueia>
- **quem_comita:** <dev | sessao> — <justificativa>

## Correspondência (para o índice)
| Diretriz | Desfecho | Instrumento | Justificativa |
|---|---|---|---|

## Não coberto
## Perguntas ao dev
```

## Perguntas que costumam sobrar

- Existe área que todo mundo sabe que é perigosa e que nenhum arquivo declara?
- Qual é o nível de rigor desejado para começar: `observador`, `consultivo` ou `normativo`?
- A sessão pode comitar, ou o dev quer a entrega parando no relatório?
