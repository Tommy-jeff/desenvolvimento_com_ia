# Reconhecimento 03 — Padrões e decisões

> **Papel:** `metodo/papeis/harness-scout.md` — leia-o inteiro antes de começar.
> **Só leitura.** Sem tripulação, sem gate. **Teto de leitura: 12 arquivos · teto de saída: 250 linhas.**
> **Saída:** `<PACOTE>/projetos/<slug>/ficha/03-padroes-e-decisoes.md`

## O que esta fatia responde

O que neste projeto é **normativo** — regra que uma sessão não pode violar nem re-decidir — e
onde essa regra está escrita. É daqui que saem as lentes específicas de projeto que os
inspetores aplicam e as decisões que o engenheiro de correção não tem autoridade para mexer.

## A distinção que importa: normativo × descritivo

Um projeto maduro tem muita documentação, e a maior parte dela **descreve** em vez de
**obrigar**. Separe:

| | O que é | Para a tripulação |
|---|---|---|
| **Normativo** | "toda entidade nova declara X"; "nunca chamar Y direto"; ADR aceito | vira critério de achado — violar é defeito |
| **Descritivo** | visão geral, tutorial, histórico, "como funciona" | vira contexto — violar não é defeito |

⚠️ **Na dúvida, é descritivo.** Promover documentação descritiva a norma enche a revisão de
achado inventado, e o dev perde a confiança no instrumento. Registre a dúvida em *Perguntas ao
dev* em vez de decidir sozinho.

## Onde procurar

1. **Decisões de arquitetura** — pasta de ADR, RFC, design docs. Confira o **estado** de cada
   uma: proposta, aceita, substituída. ADR substituída que ninguém marcou é armadilha clássica.
2. **Guias de estilo e de contribuição** — e o que neles é imperativo ("deve", "nunca") versus
   sugestão.
3. **Configuração que codifica regra** — regras de lint customizadas, fronteiras de import,
   restrições de dependência entre módulos. **Regra que já está automatizada é a mais
   confiável de todas**: ela é executada, não lembrada.
4. **Idioma** — em que idioma estão identificadores, comentários, mensagens de commit e textos
   de interface. Pode ser diferente por camada.
5. **Modelo canônico** — existe um módulo/entidade que serve de espelho para os novos? É a
   informação mais útil desta fatia inteira.

## Estrutura da saída

```markdown
# Ficha — 03. Padrões e decisões

> Levantado em <data> · teto: 12 arquivos (<usados>)

## Já em contexto (não relido)

## Documentos normativos
| Documento | Cobre | Imperativo? | Estado | Fonte |
|---|---|---|---|---|

## Regras já automatizadas
<as que vivem em configuração e são executadas — com o sensor que as executa>

## Decisões travadas (não se re-decide)
| Decisão | Valor | Onde está registrada |
|---|---|---|

## Implementação canônica de referência
- <módulo/entidade> em `<path>` — <o que ela exemplifica>

## Idioma
| Elemento | Idioma | Fonte |
|---|---|---|
| Identificadores | | |
| Comentários / docstrings | | |
| Textos de interface | | |
| Mensagens de commit | | |
| **Retornos da tripulação** | <decisão do dev> | |

## Severidade / classificação de defeito do projeto
<o projeto tem escala própria de severidade? como ela mapeia para CRÍTICO/ALTO/MÉDIO/BAIXO?>

## Correspondência (para o índice)
| Diretriz | Desfecho | Instrumento | Justificativa |
|---|---|---|---|

## Não coberto
## Perguntas ao dev
```

## Perguntas que costumam sobrar

- Qual ADR está viva e qual foi substituída na prática sem ninguém atualizar o estado?
- Existe regra que o time cobra em revisão e que não está escrita em lugar nenhum?
- Em que idioma os retornos da tripulação devem sair, dado que outras pessoas podem lê-los?
