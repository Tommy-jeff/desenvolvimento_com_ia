---
# FATOS OPERACIONAIS — todo papel lê este bloco. Mantenha-o curto e verdadeiro.
projeto: <nome legível>
slug: <host/owner/repo — ou o nome da pasta, sem remote>
raiz: <caminho absoluto do worktree nesta máquina>
reconhecido_em: <AAAA-MM-DD>
aprovado_pelo_dev: nao            # nao | sim — a tripulação avisa enquanto for "nao"
nivel_de_rigor: observador        # observador | consultivo | normativo
idioma_dos_retornos: pt-BR        # idioma do CONTEÚDO dos retornos/*.json
quem_comita: dev                  # dev | sessao
roadmap_mora_em: no-repo:docs/roadmap   # no-repo:<path> | no-pacote
retornos_schema: docs/roadmap/retornos-schema.md
manifesto_rapido: "<comando que cobre o que o diff alcança>"
manifesto_completo: "<comando da suíte inteira>"
---

# Ficha — <nome do projeto>

> Ponto de entrada da tripulação neste projeto. Montada pelo roadmap de reconhecimento; as
> fatias com as fontes de cada linha estão em `ficha/`. **Enquanto `aprovado_pelo_dev: nao`,
> todo papel trata esta ficha como rascunho e declara isso no limite da revisão.**

## O que este projeto é

<3–5 frases: domínio, stack, tamanho, se é monorepo, onde mora o código. Da fatia 00.>

## Correspondência — diretriz da tripulação × instrumento do projeto

<!-- PROJETO = usa o do projeto · NATIVO = usa o do método · COMPÕE = os dois, e como.
     Na composição o piso NUNCA desce. -->

| Diretriz | Desfecho | Instrumento do projeto | Fatia |
|---|---|---|---|
| Verificação rápida (por rodada) | | | 01 |
| Verificação completa (DoD) | | | 01 |
| Lint / formatação | | | 01 |
| Tipos / análise estática | | | 01 |
| Segurança estática (SAST) / segredos | | | 01 |
| Cobertura | | | 01 |
| Como se escreve teste | | | 02 |
| Padrões de arquitetura e código | | | 03 |
| Severidade / classificação de defeito | | | 03 |
| Revisão de código | | | 04 |
| Aprovação de dependência e licença | | | 05 |
| Quem comita / política de branch e PR | | | 05 |

## Manifestos

| Nível | Comando | Cobre | Não cobre | Tempo típico |
|---|---|---|---|---|
| rápido | `<comando>` | | | |
| completo | `<comando>` | | | |

<!-- Se o projeto não tiver nível rápido, escreva NÃO ENCONTRADO e repita o completo. A
     tripulação prefere pagar caro a afirmar verde sem evidência. -->

## Como se escreve teste aqui

- **Framework / runner:** <...>
- **Local e nome:** <convenção>
- **Fixtures, factories, dublês:** <onde ficam, como se usam>
- **Testes de referência** (o engenheiro abre um antes de escrever teste; o revisor julga
  "teste raso" contra eles):
  1. `<path>` — <por que é exemplar>
  2. `<path>` — <...>

## Áreas sensíveis (MÉDIO bloqueia como ALTO)

| Caminho / área | Por quê |
|---|---|

## Fronteiras humanas (exigem aprovação de gente)

| Caminho / área | Quem aprova | Fonte |
|---|---|---|

## Classes de arquivo que não se lê linha a linha

<!-- Não são ignorados: são conferidos por COERÊNCIA com a fonte que os produz. -->

| Padrão | Classe | Confere-se contra |
|---|---|---|
| `<glob>` | gerado / vendorado / lockfile / snapshot | `<a fonte>` |

## Aparelho de IA já instalado no projeto

| Artefato | Ferramenta | Desfecho | Como conviver |
|---|---|---|---|
| `<path>` | Claude Code / Cursor / Copilot / outro | complementa / conflita / ignorar | <regra de precedência decidida pelo dev> |

## Documentos normativos

| Documento | Cobre | Vale para a tripulação como |
|---|---|---|

## Decisões do dev registradas aqui

| Decisão | Valor | Quando |
|---|---|---|

## Perguntas abertas

<!-- O que nenhuma fatia respondeu e só o dev responde. Enquanto houver pergunta aberta que
     afete um fato operacional do frontmatter, a ficha não está aprovada. -->

- <pergunta>

## Fatias

| # | Fatia | Arquivo | Estado |
|---|---|---|---|
| 00 | Perímetro | `ficha/00-perimetro.md` | |
| 01 | Manifesto e sensores | `ficha/01-manifesto-e-sensores.md` | |
| 02 | Testes | `ficha/02-testes.md` | |
| 03 | Padrões e decisões | `ficha/03-padroes-e-decisoes.md` | |
| 04 | Aparelho de IA existente | `ficha/04-aparelho-de-ia.md` | |
| 05 | Fronteiras e risco | `ficha/05-fronteiras-e-risco.md` | |
| 06 | Classes de arquivo | `ficha/06-classes-de-arquivo.md` | |
| 07 | Consolidação | `ficha/07-consolidacao.md` | |
