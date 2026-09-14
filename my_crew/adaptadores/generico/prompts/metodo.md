<!-- gerado pelo pacote de desenvolvimento — edite em metodo/, não aqui -->

# O método — trabalho dirigido por roadmap, entregue sob revisão cega

Planejar e executar implementações médias/grandes como **roadmaps versionados**, fatiados em
itens auto-contidos que uma sessão isolada consegue executar sem depender do histórico de
outra conversa — e entregá-los sob uma revisão que não acredita na narrativa de quem
implementou.

Este documento é **agnóstico de linguagem, de stack e de ferramenta**. Ele define estrutura e
processo. Tudo que é específico do projeto — comandos, convenções, aprovações, quem comita,
em que idioma se escreve — vem da **ficha do projeto** (seção 1), nunca daqui.

---

## 1. A ficha do projeto — de onde vêm os fatos

Antes de planejar ou executar qualquer coisa, resolva a ficha pelo **procedimento de
descoberta** (`LEIA-ME.md` do pacote): raiz do pacote → slug do projeto →
`<PACOTE>/projetos/<slug>/indice.md`.

A ficha é uma **tabela de correspondência**: para cada diretriz de que a tripulação depende,
ela diz qual instrumento do projeto a cumpre. Três desfechos por linha:

| Desfecho | Significado |
|---|---|
| `PROJETO` | o projeto já tem instrumento → **use o dele** e cite-o como fonte |
| `NATIVO` | o projeto não tem → vale o instrumento nativo deste método |
| `COMPÕE` | os dois existem → a ficha diz **como** se somam (tipicamente: o piso nativo, elevado pela política do projeto) |

O frontmatter da ficha carrega os fatos operacionais que todo papel consulta: `nivel_de_rigor`,
`idioma_dos_retornos`, `quem_comita`, `roadmap_mora_em`, `retornos_schema`,
`manifesto_rapido`, `manifesto_completo`.

**Sem ficha, não se começa.** Ela nasce do roadmap de reconhecimento (`reconhecimento/`),
que roda uma vez por projeto, é só leitura e **não aciona a tripulação**. Um projeto grande e
maduro já respondeu quase tudo que este método precisa saber; descobrir isso no meio de uma
implementação é caro, impreciso, e em janela de contexto apertada simplesmente não cabe.

⚠️ **A ficha é lida, nunca inferida.** Campo que ela marca como `NÃO ENCONTRADO` continua não
encontrado: declare para o que isso te cega e siga — não preencha o buraco com o que "costuma
ser".

## 2. Quando criar um roadmap

Criar quando **2 ou mais** forem verdadeiros:

- Estimativa de **2–3 sessões de trabalho ou mais**.
- Há **decisões de produto/arquitetura a travar** (escolhas que uma sessão futura poderia
  re-decidir errado).
- Envolve **mudança de schema, migração, infraestrutura ou passo manual** fora do código.
- Toca **múltiplas camadas ou subsistemas**.
- O trabalho tem **fases com riscos distintos**.

Caso contrário: implementar direto. Roadmap para tarefa pequena é burocracia; tarefa grande
sem roadmap vira re-trabalho e decisão perdida.

**Trabalho fora de roadmap também passa pela revisão.** Bug pequeno, ajuste pontual, chamado
de suporte — a maior parte do trabalho num projeto maduro — usa o **contrato mínimo**
(seção 8). O que não existe é entrega sem régua.

## 3. Onde o roadmap mora

A ficha declara, em `roadmap_mora_em`:

- **`no-repo:<path>`** (preferido) — versionado junto com o código, tipicamente
  `docs/roadmap/`. A régua de cada item ganha baseline por commit, e os inspetores auditam
  contra ela.
- **`no-pacote`** — `<PACOTE>/projetos/<slug>/roadmap/`, para o projeto fechado que não
  aceita metodologia de terceiro no repositório. **Há perda real:** sem commit não existe
  baseline que a implementação não consiga mover. A compensação é o `quality.md` ser
  congelado por hash registrado no `indice.md` antes da implementação, e os inspetores serem
  avisados dessa perda de potência — eles a declaram no limite da revisão em vez de fingir
  que não existe.

## 4. Estrutura

```
<raiz-de-roadmaps>/
├── retornos-schema.md          # formato dos retornos/ — 1× por projeto
└── <tema-em-kebab-case>/
    ├── README.md               # objetivo, decisões travadas, status, ordem de ataque
    ├── _MODELO/                # cópia de modelos/brief.md + modelos/quality.md, ajustada
    ├── 01-<slug>/              # UM DIRETÓRIO por item
    │   ├── brief.md            # contexto mutável; carrega o frontmatter de status
    │   ├── quality.md          # régua imutável
    │   └── retornos/           # nasce na 1ª rodada — 1 JSON por papel
    ├── 02-<slug>/
    └── ...
```

- `NN-` define **identidade** (referenciada em `depende_de`/`bloqueia`), não ordem de
  execução — a ordem real está em **Ordem de ataque** no README.
- **Legado:** itens em arquivo único (`NN-slug.md`) continuam válidos. Não migre
  retroativamente; itens novos nascem em pasta.

## 5. Anatomia de um item

| Arquivo | Papel | Mutabilidade |
|---|---|---|
| `brief.md` | **Contexto**: por quê, cenário, plano sugerido, referências. Carrega o frontmatter de status | Mutável — enriquecer durante a execução, sem cerimônia |
| `quality.md` | **Régua**: escopo DENTRO/FORA, arquivos a tocar, orçamentos, testes obrigatórios, Definition of Done, armadilhas, CLASSIFICAÇÃO DE ACHADOS, gate | **Imutável dentro da unidade de trabalho.** Congelada antes da implementação — é a baseline dos inspetores. Emenda = decisão do dev, antes, em mudança própria |
| `retornos/` | **Registro das rodadas** — 1 JSON por papel | Cada papel escreve só no próprio arquivo |

**Por que a divisão:** tudo que **julga** a entrega mora num arquivo que a implementação não
pode tocar; tudo que **explica** mora num arquivo livre. A vigilância anti-forja cobre um
arquivo só, e enriquecer o contexto no meio do caminho deixa de ser zona cinzenta.

A **CLASSIFICAÇÃO DE ACHADOS** é personalizada por item, no planejamento: os critérios do
projeto que se aplicam àquele item entram ali, extraídos da ficha. Subir piso e acrescentar
critério é permitido; rebaixar ou remover, nunca. **Os inspetores leem só a pasta do item —
regra que não estiver lá não existe para eles.**

**Frontmatter (no `brief.md`):**

```yaml
---
status: pending      # pending | in_progress | blocked | done
prioridade: Média    # Alta | Média | Baixa
fase: 1              # opcional
depende_de: []       # ex: [1, 3]
bloqueia: []         # ex: [4]
commit: null         # null | pending | "<hash>"
---
```

**Dimensionamento:** um item deve caber numa sessão isolada (plano + código + testes + DoD).
Se ao escrever o plano ele não couber, divida em dois com `depende_de` — nunca entregue um
"parte 1 de N" implícito.

## 6. Fonte única de status

- **Canônico:** o frontmatter do `brief.md`.
- **Espelho:** a tabela "Status atual" do README, atualizada junto.
- Documento normativo do tema apenas **linka** o roadmap; nunca duplica a tabela.

Divergiram? O frontmatter vence.

## 7. Execução de um item

**Antes de tocar código:**

1. Resolver a **ficha** (seção 1). Não existe → pare e peça o reconhecimento.
2. Ler o **README do roadmap inteiro** — decisões travadas, tensão central, regras normativas.
3. Ler os **documentos normativos** que a ficha marcar como `PROJETO` ou `COMPÕE` para este
   tema (ADRs, style guides, regras de outra LLM já instaladas no repo).
4. Ler a **pasta do item inteira** — `brief.md` e `quality.md`.
5. Conferir que os itens em `depende_de` estão `done`. Se não, parar e avisar.
6. Conferir que o `quality.md` está **congelado** (comitado, ou com hash no índice quando o
   roadmap mora no pacote). Se não está, **a ficha diz quem resolve**: `quem_comita: dev` →
   pare e peça ao dev; `quem_comita: sessao` → congele-o sozinho, antes de qualquer código.
7. Atualizar o frontmatter para `status: in_progress`.

**Durante:** executar o plano na ordem. **Não inventar etapas — ambiguidade vira pergunta ao
dev, nunca solução inventada.**

**Ciclo de revisão** (com os papéis de `papeis/`; sem aparelho de agentes, a própria sessão
audita contra o `quality.md` — e declara que auditou a si mesma):

8. **Rodada 1 — a que importa.** Os dois inspetores rodam **independentes e sem se ver**,
   cada um recebendo a pasta do item + a baseline. Em ferramenta que suporta paralelismo,
   dispare os dois juntos: qual dos dois é o caminho crítico muda de item para item, e
   nenhuma ordem serial acerta sempre. Cada um grava no **próprio** arquivo de `retornos/`.
   **A sessão não repassa raciocínio de implementação** — eles auditam o diff, não a narrativa.
9. **Correção.** O engenheiro recebe a fila única (os dois arquivos), avalia mérito, corrige
   na raiz e registra cada resposta. Serializar dois ciclos custa um ciclo inteiro a mais e
   ainda invalida a revisão do primeiro.
10. **Rodadas seguintes — só verificação.** Escopo travado: os achados `aberto` + o diff da
    correção, nada mais. Nova rodada de correção **somente** se sobrar CRÍTICO/ALTO `aberto`;
    `escalado` vai ao dev sem gerar rodada, mas segura o fecho.
11. **Registrar os `retornos/` ao fim de cada rodada** — a contagem de rodadas vira fato
    verificável, não palavra de quem as gastou.

**Ao terminar:**

12. Cumprir o **Definition of Done**, incluindo o `manifesto_completo` e o **gate de
    encerramento**: zero CRÍTICO/ALTO `aberto`, zero `escalado` sem resposta.
13. Atualizar frontmatter (`status: done` + `commit:`) e a tabela do README.
14. Entregar o relatório ao dev (seção 10). **Quem comita é quem a ficha declarar.**

## 8. Contrato mínimo (trabalho fora de roadmap)

Bug, ajuste pontual, chamado — não merece roadmap, mas merece régua. Antes de tocar código, a
sessão escreve um `quality.md` curto a partir do **pedido verbatim do dev**, em
`<PACOTE>/projetos/<slug>/avulsos/<data>-<slug>/`, com no mínimo:

- **Pedido verbatim** — as palavras do dev, sem paráfrase. É o que o inspetor de entrega usa
  como régua, e ele não enxerga a conversa.
- **Escopo DENTRO/FORA** e **arquivos a tocar**.
- **Definition of Done** com o comando de verificação.
- **CLASSIFICAÇÃO DE ACHADOS** — pode ser a referência à base dos modelos, mais as áreas
  sensíveis que a ficha declarar para os paths tocados.

O resto do ciclo é idêntico. O que não existe é inspetor julgando entrega sem saber o que foi
pedido.

## 9. Graduação e encerramento

**Graduar** as regras do tema para documento normativo do projeto quando ≥1 for verdadeiro:
as regras passam a ser consultadas por trabalho fora do roadmap · o tema continua vivo depois
dos itens · já existem anti-padrões identificados na prática que precisam ser bloqueados em
qualquer sessão futura. Use `modelos/skill-normativa.md`, no formato que a ficha indicar para
documentos normativos naquele projeto. O documento **linka** o roadmap para status; não
duplica a tabela.

**Encerrar** quando 100% `done` com hash: banner de conclusão no README · migrar regras
normativas residuais · registrar follow-ups adiados ("o que ficou de fora e por quê", de onde
nasce o próximo roadmap) · não deletar a pasta, que é registro histórico das decisões.

## 10. O relatório ao dev

```
## Entrega — <item>
- Escopo: <o que o item pedia>
- Arquivos tocados: <lista>
- Manifesto: <saída colada do comando, não auto-relato>
- Vereditos: entrega <APROVADO|REPROVADO> / revisão <APROVADO|REPROVADO> — <N> rodada(s)
- Observações não bloqueantes (médio/baixo): ...
- Fora do escopo, aberto na verificação: ...
- Escalado ao dev: ...
- Sugestão de mensagem de commit (o dev decide se usa): <tipo>(<escopo>): <descrição>
```

## 11. Aprendizados

Três registros vivem em `<PACOTE>/projetos/<slug>/aprendizados/` e atravessam itens:

- **`escapes.md`** — defeito que passou pelos gates e só apareceu depois. O sujeito da linha é
  **qual gate vazou**, nunca a sessão que errou. É daqui que nascem lentes novas.
- **`custos.md`** — minutos e tokens por rodada, medidos. Gate novo só vira obrigação depois
  de rodar num item real **com o custo registrado**: o aparato de qualidade não é exceção à
  régua que ele mesmo aplica.
- **`decisoes.md`** — decisões do dev que valem além de um item.

## 12. Anti-padrões

- ❌ **Item que depende de memória de outra conversa** — corrija o documento, não compense na
  conversa.
- ❌ **Começar sem ficha** — ou preencher de cabeça o que ela marcou `NÃO ENCONTRADO`.
- ❌ **Substituir o aparelho do projeto** — o que ele já resolve, a tripulação usa; o nativo
  entra só onde falta instrumento.
- ❌ **Status em três lugares** · **anotação livre de status** ("done mas falta comitar" —
  use `commit: pending`).
- ❌ **Re-decidir decisão travada** — a sessão para e pergunta; a mudança é registrada, nunca
  aplicada em silêncio.
- ❌ **Item multi-sessão** — divida antes de atribuir, não durante.
- ❌ **Definition of Done sem comando executável.**
- ❌ **Hardcodar regra de projeto neste método ou nos modelos** — comandos, frameworks e
  convenções vêm da ficha; nos modelos são marcadores.
- ❌ **Editar o `quality.md` dentro da unidade que ele governa** — forja de contrato.
- ❌ **Achado novo fora do diff da correção, numa verificação** — vai para `fora_do_escopo`,
  nunca para o gate.
- ❌ **Reescrever um `retornos/*.json` inteiro** — rodada nova entra por acréscimo.
- ❌ **Papel escrevendo no arquivo de retorno de outro papel.**
- ❌ **Veredito que diverge do estado dos itens** — `APROVADO` é derivável.
