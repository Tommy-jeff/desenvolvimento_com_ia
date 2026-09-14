# Quality — Item NN: <título>

> ⚠️ **Régua IMUTÁVEL da unidade de trabalho.** Este arquivo é escrito no planejamento e
> **comitado antes** de a implementação começar — é esse commit que dá aos inspetores uma
> baseline que a implementação não consegue mover. Editá-lo de dentro da unidade que ele
> governa é achado **crítico** (forja de contrato). Emenda legítima existe: decisão do
> dev, em commit próprio, **antes** de tocar o que ela autoriza. O contexto mutável (por
> quê, plano sugerido) mora no `brief.md` ao lado.

## Escopo

**DENTRO** (o estado final que o item entrega):

- <bullet>

**FORA** (pertence a outro trabalho — nomeie o item quando souber):

- <bullet>

## Arquivos a tocar (lista fechada)

| Arquivo | O que muda | Conta no teto de diff? |
|---|---|---|
| `<path>` | <descrição curta> | sim/não |

## Orçamentos

| Orçamento | Valor | Como se mede |
|---|---|---|
| Rodadas de revisão | <N — decisão do dev> | commits de rodada em `retornos/` (`git log`) |
| Teto de diff (inserções) | <N — decisão do dev> | `git diff --numstat <baseline>..HEAD -- <arquivos que contam>`, somando inserções |

Estourou qualquer um → **pare e escale ao dev**. Nunca amplie um orçamento de dentro da
unidade que ele governa.

## Testes obrigatórios

<!-- Conforme as regras de teste declaradas na ficha do projeto. -->

- `<path do teste>` — <o que cobrir: caminho feliz, erros mapeados, ramos defensivos>.

## Definition of Done

- [ ] `quality.md` **congelado antes** da implementação (comitado; ou, com o roadmap no
      pacote, com o hash registrado no índice da ficha) — é a baseline dos inspetores.
- [ ] Código implementado conforme o **Escopo**.
- [ ] Todos os testes novos passam.
- [ ] **`manifesto_completo` da ficha** passa sem regressão: `<comando>`. É aqui, no
      encerramento, que a suíte inteira roda — as rodadas de revisão usam o
      `manifesto_rapido`, e nenhuma delas basta para este item.
- [ ] **Gate de encerramento satisfeito**: zero achado CRÍTICO/ALTO `aberto` e zero
      `escalado` sem resposta em `retornos/` (ver *Gate de encerramento*, abaixo).
- [ ] Frontmatter do `brief.md` atualizado: `status: done` + `commit:`.
- [ ] Tabela de status do `README.md` do roadmap atualizada.

## Armadilhas (não faça)

- ❌ <anti-padrão específico deste item>

---

# CLASSIFICAÇÃO DE ACHADOS (OBRIGATÓRIO)

<!-- PERSONALIZE POR ITEM, no planejamento: acrescente aos níveis abaixo os critérios do
     projeto hospedeiro que se aplicam a ESTE item — ex.: "nunca inventar número
     financeiro" como CRÍTICO num item que toca cálculo; as áreas sensíveis do projeto
     onde MÉDIO bloqueia (se o a ficha do projeto as declarar). Os inspetores leem SÓ
     esta pasta: regra do projeto que não estiver aqui não existe para eles.
     A personalização só pode SUBIR um piso ou ACRESCENTAR critério — nunca rebaixar nem
     remover. -->

## Para o `coder-reviewer`

Todo achado DEVE ser classificado em exatamente um dos níveis abaixo.
Um achado só é válido se você puder apontar: (1) arquivo e linha, (2) o critério da
tabela que ele viola, (3) o cenário concreto de falha. Se não conseguir preencher os
três, rebaixe para BAIXO ou descarte. **Ausência de achados é um resultado válido e
desejável.** Seu trabalho não é encontrar o máximo de problemas, é verificar o escopo
definido.

### CRÍTICO — bloqueia a entrega, correção obrigatória

Classifique como CRÍTICO somente se o defeito:

- Quebra o fluxo principal da feature ou causa crash;
- Corrompe ou perde dados (ex.: migration destrutiva, escrita incorreta);
- Quebra o build ou faz testes existentes falharem;
- Introduz vulnerabilidade explorável (injeção, bypass de auth, segredo/credencial
  commitado, permissão ausente em dado sensível).
<!-- PERSONALIZE: critérios CRÍTICOS do projeto para este item. -->

### ALTO — bloqueia a entrega, correção obrigatória

Classifique como ALTO somente se o defeito:

- Produz resultado incorreto em condição comum ou alcançável do uso real;
- Omite tratamento de erro em operação de I/O, rede ou banco;
- Cria race condition provável ou vazamento de recurso (conexão, stream, listener não
  liberado);
- Causa regressão em comportamento existente fora do escopo da mudança.
<!-- PERSONALIZE: critérios ALTOS do projeto para este item. -->

### MÉDIO — corrigir se custo baixo; senão registrar como débito

Classifique como MÉDIO somente se:

- O defeito ocorre apenas em edge case raro, porém demonstrável;
- Há degradação de performance mensurável (N+1, query em loop, processamento
  desnecessário em coleção grande);
- Um caminho crítico foi modificado sem nenhum teste cobrindo.
<!-- PERSONALIZE: se este item toca área sensível declarada pelo projeto hospedeiro,
     nomeie os paths aqui e diga que MÉDIO neles BLOQUEIA como ALTO. -->

### BAIXO — apenas registrar; NUNCA bloqueia, NUNCA gera nova rodada

Classifique como BAIXO se for:

- Estilo, nomenclatura, duplicação, magic number;
- Oportunidade de refatoração;
- Comentário ou documentação ausente;
- Qualquer item que NÃO altera comportamento em runtime.

### REGRAS DE DESEMPATE

- Na dúvida entre dois níveis, escolha o MAIS BAIXO, a menos que consiga demonstrar o
  cenário de falha do nível superior.
- Impacto hipotético sem cenário demonstrável NÃO sobe severidade.
- Preferência pessoal de design/arquitetura é sempre BAIXO.
- ⚠️ O desempate vale para **dúvida genuína**. Rebaixar um achado cujo cenário você
  demonstrou, para caber num nível que não bloqueia, é falha de revisão.

## Para o `delivery-inspector`

Todo achado DEVE ser classificado em exatamente um dos níveis abaixo.
Um achado só é válido se você puder apontar: (1) o trecho/requisito exato da régua do
item (**este arquivo** ou o `brief.md`) que o fundamenta, (2) a evidência no código
entregue, (3) a distância entre o pedido e o entregue. Achado sem referência à régua NÃO
é achado — descarte ou registre como observação BAIXO. **Ausência de achados é um
resultado válido e desejável.**

### CRÍTICO — bloqueia a entrega, correção obrigatória

Classifique como CRÍTICO somente se:

- Um requisito EXPLÍCITO da régua não foi implementado;
- Um requisito foi implementado com comportamento CONTRÁRIO ao pedido;
- Houve alteração em área explicitamente marcada como FORA do escopo e essa alteração
  muda comportamento.
<!-- PERSONALIZE: critérios CRÍTICOS do projeto para este item. -->

### ALTO — bloqueia a entrega, correção obrigatória

Classifique como ALTO somente se:

- Um requisito explícito foi implementado de forma PARCIAL;
- Um critério de aceite verificável da régua não é atendido;
- O desvio muda contrato, API, schema ou UX ESPECIFICADOS na régua (nomes de campos,
  estados de fluxo, formatos de resposta).
<!-- PERSONALIZE: critérios ALTOS do projeto para este item. -->

### MÉDIO — registrar; corrigir apenas se a régua for atualizada

Classifique como MÉDIO somente se:

- A abordagem diverge da sugerida, mas o comportamento final pedido é idêntico;
- Um item implícito razoável está ausente (ex.: validação óbvia não citada textualmente
  na régua).

### BAIXO — apenas registrar; NUNCA bloqueia, NUNCA gera nova rodada

Classifique como BAIXO se for:

- Scope creep benigno: algo entregue além do pedido, sem risco;
- Inconsistência cosmética com a régua (nomenclatura em docs, textos de mensagem, logs).

### REGRAS DE DESEMPATE

- Na dúvida entre dois níveis, escolha o MAIS BAIXO.
- "Eu teria feito diferente" NÃO é desvio de escopo — é BAIXO ou descarte.
- Requisito ambíguo na régua não gera CRÍTICO/ALTO: registre como MÉDIO com a pergunta
  de esclarecimento a ser levada à sessão principal.
- ⚠️ Mesmo anti-forra do `coder-reviewer`: rebaixar achado demonstrado para não bloquear
  é falha de revisão.

---

# ESCOPO DA RODADA E GATE (OBRIGATÓRIO)

O formato dos arquivos de `retornos/`, a máquina de estados dos achados e quem escreve o
quê estão no arquivo que `retornos_schema` da ficha do projeto aponta. Esta
seção define o que cada rodada PODE fazer.

## Primeira rodada (não existe rodada anterior em `retornos/`)

Analise todo o escopo da entrega e crie a `rodada_1` no seu arquivo de retorno. **A
primeira rodada é a que importa**: é ela que acha os defeitos de fato, e a correção dela
deve deixar a entrega essencialmente pronta. Rodadas seguintes só verificam.

## Rodadas seguintes (existe rodada anterior em `retornos/`)

Seu escopo nesta rodada é EXCLUSIVAMENTE:

1. **Cada achado SEU com status `aberto`**: leia a resposta do engenheiro em
   `retornos/software-engineer.json` (a entrada cujo `origem_id` é o seu achado) e o
   diff da correção; então atualize o `status` (`resolvido`, `recusa_aceita`, `debito`,
   `escalado`) ou mantenha `aberto` preenchendo `nota_verificacao`.
2. **SOMENTE o diff da correção**, em busca de problemas INTRODUZIDOS por ela. Achado
   novo nasce na `rodada_N` corrente e só é admissível DENTRO desse diff.

Problema pré-existente notado agora vai para o array `fora_do_escopo` da rodada: NÃO
bloqueia e NÃO gera nova iteração — o dev decide se vira tarefa.

## Quando o `delivery-inspector` volta numa rodada de verificação

- tem achado SEU com status `aberto`; **ou**
- `criterios_de_pronto_tocados` na meta do engenheiro **não** veio `[]` — os critérios
  nomeados ali são parte do seu escopo: a correção os alcançou, e julgar se continuam
  cumpridos é seu, não dele.

Nenhum dos dois → seu veredito anterior prende à unidade de trabalho; você não volta, e
a rodada custa um inspetor em vez de dois. (O `coder-reviewer` volta sempre: as
correções mudaram o código que ele aprovou.)

## Anti-pingue-pongue

Correção verificada e reprovada pela SEGUNDA vez, ou recusa do engenheiro que você não
aceita → `status: escalado`, com a divergência resumida em `nota_verificacao`. Impasse
entre agentes nunca compra uma terceira rodada — compra uma pergunta ao dev.

## Gate de encerramento

- Apenas achados CRÍTICO e ALTO com status `aberto` disparam nova rodada de correção
  (mais o que a CLASSIFICAÇÃO deste item tiver promovido a bloqueante).
- MÉDIO e BAIXO nunca disparam rodada, nunca bloqueiam.
- Achado `escalado` NÃO dispara rodada, mas **BLOQUEIA o fecho** do item até o dev
  responder.
- `veredito: "APROVADO"` na meta é **derivável**: significa exatamente "zero CRÍTICO/ALTO
  `aberto` no meu arquivo", e é conferível contra os próprios itens. Veredito que diverge
  do estado dos itens é auto-relato quebrado — e vale como tal.
