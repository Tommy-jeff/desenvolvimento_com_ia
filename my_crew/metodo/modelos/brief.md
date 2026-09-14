---
status: pending      # pending | in_progress | blocked | done
prioridade: Média    # Alta | Média | Baixa
fase: 1              # opcional — remover se o roadmap não tiver fases
depende_de: []       # ex: [1, 3]
bloqueia: []         # ex: [4]
commit: null         # null | pending | "<hash>" — pending = pronto, aguardando commit
---

# Item NN — <Título curto e acionável>

> **Para a sessão que pega esta task:** leia o `README.md` deste roadmap (decisões travadas
> + regras normativas), o **`quality.md` desta pasta** (a régua imutável do item) e as
> documentos normativos do projeto referenciadas abaixo. Atualize `status: in_progress` neste frontmatter
> antes de tocar em código. Não invente etapas — se algo está ambíguo, **pergunte ao
> usuário**.

<!-- Se status: blocked, registrar aqui o motivo e o que desbloqueia. -->

## Papel deste arquivo

Este `brief.md` é o **contexto mutável** do item: o porquê, o cenário e o caminho sugerido.
Pode ser enriquecido durante a execução (contexto novo, aprendizado de rodada) sem
cerimônia. A **régua** do item — escopo, arquivos a tocar, testes, Definition of Done,
orçamentos e a classificação de achados — mora em `quality.md`, que é **imutável** dentro
da unidade de trabalho. Em conflito entre os dois, o `quality.md` vence.

## Por quê

<2–4 frases explicando o gap atual e o que ele quebra ou impede.>

## Contexto necessário

<O que uma sessão sem histórico precisa saber: decisões do dev que tocam este item,
números de referência com a fonte, estado do disco esperado. Afirmação sobre o estado do
mundo é **datada** — a sessão confere por comando antes de agir sobre ela.>

## Plano de execução (sugerido)

### Passo 1: <título>

<Descrição + paths exatos quando há um único alvo + snippets quando o padrão se repete em
vários lugares.>

<!-- Sinalizar explicitamente passos que caem em regras de aprovação do projeto:
     dependência nova, UI nova, passo manual de infra
     (ex: "⚠️ este passo exige aprovação do dev — ver a ficha do projeto"). -->

### Passo 2: ...

## Referências

- `README.md` do roadmap, seções <X, Y>.
- `quality.md` desta pasta — a régua que os inspetores vão usar.
- documento normativo `<nome>` do projeto, seções <relevantes>.
- Itens relacionados: <NN, NN>.
