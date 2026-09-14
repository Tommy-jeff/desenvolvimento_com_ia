# Reconhecimento 02 — Testes

> **Papel:** `metodo/papeis/harness-scout.md` — leia-o inteiro antes de começar.
> **Só leitura.** Sem tripulação, sem gate. **Teto de leitura: 12 arquivos.**
> **Saída:** `<PACOTE>/projetos/<slug>/ficha/02-testes.md`

## O que esta fatia responde

**Como se escreve teste aqui.** Num projeto maduro isso já foi decidido — framework, local,
nome, fixtures, dublês, o que se testa e o que não se testa — e a decisão está nos arquivos,
não num documento.

Esta é a fatia de maior retorno do reconhecimento. Sem ela, o engenheiro de correção escreve
teste no padrão que ele acha bom, e o revisor julga "teste raso" pelo gosto dele; com ela, os
dois julgam contra o que o projeto já faz.

## O produto principal: os testes de referência

Escolha **1 a 3 arquivos de teste exemplares** e diga **por que** cada um é exemplar. São eles
que o engenheiro abre antes de escrever qualquer teste.

Critérios para escolher — prefira o arquivo que:

- foi tocado **recentemente** (`git log -1 --format=%cd -- <path>`), não o mais antigo;
- exercita **caminho de erro**, não só caminho feliz;
- usa os **auxiliares comuns** do projeto (factory, builder, dublê, fixture) em vez de montar
  tudo à mão;
- cobre a **camada onde o trabalho vai acontecer** — se o projeto tem camadas com estilos
  diferentes de teste, escolha um por camada e diga qual serve para quê.

⚠️ **Não escolha o teste mais bonito: escolha o mais representativo.** A ficha descreve o que o
projeto faz, não o que ele deveria fazer. Se o padrão predominante for fraco, registre o padrão
e leve a observação para *Perguntas ao dev* — não "corrija" a realidade escolhendo a exceção.

## Onde procurar

1. **Configuração do runner** — onde ele procura teste, que padrão de nome reconhece, que
   setup roda antes.
2. **A árvore de testes** — teste ao lado do código, ou em árvore espelho? Um arquivo por
   unidade, ou por feature?
3. **Auxiliares compartilhados** — pastas de fixture, factory, builder, mock, helper, dublê de
   servidor, banco em memória. **Isto costuma ser o que mais falta** quando alguém de fora
   escreve teste no projeto.
4. **Os próprios testes** — abra os candidatos a referência. É onde o teto de leitura vai.
5. **Documentação de teste**, se existir — e compare com o que os arquivos mostram.

## Estrutura da saída

```markdown
# Ficha — 02. Testes

> Levantado em <data> · teto: 12 arquivos (<usados>)

## Já em contexto (não relido)

## Convenção
- Framework / runner: <...> · Fonte: <...>
- Local: <ao lado do código | árvore espelho em <path> | outro>
- Nome: <padrão> · Fonte: <...>
- Estilo de asserção: <...>
- Camadas com estilo distinto: <...>

## Auxiliares disponíveis
| Auxiliar | Onde | Para quê |
|---|---|---|

## Testes de referência
1. `<path>` — <por que é exemplar; que camada representa; tocado em <data>>
2. `<path>` — <...>

## O que o projeto NÃO testa (por convenção)
<ex.: camada de UI, integrações externas, scripts — com a fonte que mostra isso>

## Correspondência (para o índice)
| Diretriz | Desfecho | Instrumento | Justificativa |
|---|---|---|---|
| Como se escreve teste | | | |

## Não coberto
## Perguntas ao dev
```

## Perguntas que costumam sobrar

- Existe convenção não escrita que o time cobra em revisão? (nome do caso, um `expect` por
  teste, proibição de dublê em certa camada)
- Teste de integração exige infraestrutura? Quem a sobe?
- O padrão predominante é o padrão desejado, ou é dívida que o time já quer trocar?
