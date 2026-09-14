# Roadmap — <Título do tema>

<!-- 2–4 frases: o que este roadmap entrega quando concluído. Termine declarando o princípio de auto-contenção. -->
Este diretório versiona o plano de execução de <tema>: <resumo do objetivo em 1–2 frases>.

Cada arquivo aqui é **auto-contido** e foi escrito para ser atribuído a uma sessão isolada — sem depender do histórico de outras conversas.

<!-- Manter este aviso enquanto o tema não tiver documento normativo próprio. Remover ao graduar (e apontar para ele). -->
> ⚠️ Ainda **não existe** uma Skill `<tema>`. Este README é, por ora, o documento normativo do tema (ver seção **Regras normativas** abaixo). Se/quando o tema amadurecer, formalizá-lo e migrar as regras para lá<, respeitando as regras de aprovação do documento de instruções do projeto>.

## Decisões de produto já travadas

<!-- Tudo que foi decidido com o dev e que NENHUMA sessão deve re-decidir. Se uma sessão encontrar motivo para mudar algo daqui: parar, perguntar ao dev, registrar a mudança nesta tabela. -->

| Decisão | Valor | Observação |
|---|---|---|
| <decisão> | **<valor escolhido>** | <por quê / consequência> |

## A tensão central (leia antes de implementar)

<!-- Opcional, mas valiosa: o trade-off de design que o implementador precisa entender para não "consertar" a solução na direção errada. Apagar a seção se não houver. -->

<Descrever o conflito entre dois objetivos e como o roadmap o resolve — e o que foi conscientemente sacrificado.>

## Fases

<!-- Opcional: usar quando o trabalho tem etapas com garantias/riscos distintos. Apagar se não houver. -->

- **Fase 1 — <nome>.** <O que entrega e que garantia dá.> Itens **01–NN**.
- **Fase 2 — <nome>.** <O que entrega a mais.> Itens **NN–NN**.

## Para quem está atribuindo uma task

Use um comando como:

```
@docs/roadmap/<tema>/01-<slug>/brief.md implemente este item completamente
```

A sessão deve:

1. Ler este README inteiro (especialmente **Decisões travadas** e **Regras normativas**).
2. Ler os documentos normativos do projeto relacionadas: <listar>.
3. Ler a pasta do item: `brief.md` (contexto) e `quality.md` (a régua imutável).
4. Conferir que o `quality.md` está comitado; atualizar o frontmatter do `brief.md` para `status: in_progress` antes de tocar em código.
5. Executar o **Plano de execução** do `brief.md`.
6. Rodar o ciclo de revisão (inspetores → correção → verificação) com os registros em `retornos/`, até o **gate de encerramento** do `quality.md` fechar.
7. Cumprir o **Definition of Done**.
8. Atualizar o frontmatter para `status: done` + `commit:` (`pending` ou hash).
9. Atualizar a tabela de status abaixo (neste README).

## Para quem está implementando (sessão que implementa)

Antes de tocar em código, garanta:

- [ ] Li este README por inteiro?
- [ ] Li o `brief.md` e o `quality.md` do item por inteiro?
- [ ] Li os documentos normativos do projeto referenciadas?
- [ ] As dependências (`depende_de`) deste item já estão `done`?
- [ ] O `quality.md` está comitado (baseline dos inspetores)?
- [ ] Atualizei o status do frontmatter do `brief.md` para `in_progress`?

Depois, siga o **Plano de execução**. Não invente etapas — se algo não está claro, **pergunte ao usuário** antes de inventar solução.

Regras do projeto (da ficha) que se aplicam a este roadmap:

<!-- Extrair do documento de instruções do projeto as regras que os itens vão esbarrar. Exemplos típicos: -->
- **Dependência externa nova** → <regra de pesquisa/aprovação do projeto>.
- **Tela/elemento visual novo** → <regra de design do projeto>.
- **Mudança de schema/infra** → <o que é passo manual do dev e como documentar>.
- **Testes** → <regra de cobertura do projeto + comando: `<comando de testes do projeto>`>.

## Status atual

<!-- ESPELHO dos frontmatters — atualizar no mesmo commit que muda um frontmatter. O frontmatter do item é o canônico. -->

| # | Item | Prioridade | Status | Depende de |
|---|---|---|---|---|
| 01 | [<Título>](01-<slug>/brief.md) | Alta | pending | — |
| 02 | [<Título>](02-<slug>/brief.md) | Média | pending | 01 |

## Ordem sugerida de ataque

<!-- Blocos, não lista linear: explicitar o que pode rodar em paralelo. -->

1. **Bloco fundação** (sem dependências, pode rodar em paralelo): **01** e **02**.
2. **Bloco <nome>**: **03** → **04**.
3. ...

## Regras normativas (até existir uma Skill)

<!-- As regras que valem desde já para qualquer código que toque o tema. Numeradas, curtas, imperativas. Ao graduar para Skill, migrar esta seção inteira e substituí-la por um link. -->

1. **<Nome da regra>.** <Enunciado.>
2. ...

## Convenções dos arquivos

- Cada item é uma **pasta** `NN-<slug>/` com `brief.md` (contexto mutável + frontmatter) e `quality.md` (régua imutável); `retornos/` nasce na primeira rodada de revisão.
- Frontmatter no `brief.md`, com `status` (pending | in_progress | blocked | done), `prioridade`, `fase` (se houver), `depende_de`, `bloqueia`, `commit` (null | pending | hash).
- **Plano de execução** (no `brief.md`) com passos numerados; paths exatos quando há um único alvo; código quando o padrão se repete.
- **Definition of Done** (no `quality.md`) sempre como checklist, com os comandos de verificação do projeto e o gate de encerramento.
- **Armadilhas** (no `quality.md`) lista os anti-padrões específicos do item.
- **Referências** (no `brief.md`) linka seções deste README, documentos normativos do projeto e itens relacionados.
- Formato dos arquivos de revisão: o caminho em `retornos_schema` da ficha do projeto.

Use a pasta `_MODELO/` para novos itens.
