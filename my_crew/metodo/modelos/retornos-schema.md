# Schema dos arquivos de retorno (`retornos/`)

> Este arquivo acompanha o método e é **copiado no bootstrap para o caminho que a ficha
> do projeto declara em `retornos_schema`** — é de lá que os papéis o leem, porque uma
> sessão isolada não enxerga a pasta do pacote. Ele define o formato dos três
> arquivos, a máquina de estados dos achados e quem escreve o quê. O que ele NÃO define:
> critérios de severidade — esses moram na seção CLASSIFICAÇÃO DE ACHADOS do `quality.md`
> de cada item.

## Os três arquivos

Cada item de roadmap tem uma pasta `retornos/` com um arquivo POR AGENTE:

```
NN-slug/
├── brief.md
├── quality.md
└── retornos/
    ├── coder-reviewer.json
    ├── delivery-inspector.json
    └── software-engineer.json
```

## Regras de escrita

- **Cada agente escreve SOMENTE no próprio arquivo.** Corrigir não dá direito de editar o
  registro de quem achou; verificar não dá direito de editar o registro de quem corrigiu.
- **Rodada nova entra por acréscimo** (`Edit` adicionando a chave `rodada_N`), **nunca**
  reescrevendo o arquivo inteiro — entre rodadas não há commit protegendo, e um `Write`
  total malfeito apaga a história.
- **A sessão principal comita `retornos/` ao fim de cada rodada** (commit de bookkeeping,
  fora do teto de diff do item). É esse commit que torna a contagem de rodadas um fato do
  `git log` em vez de palavra de quem as gastou — e que permite atualizar `status`
  in-place sem perder histórico.
- A chave `rodada_N` marca a rodada em que o registro **nasceu**. O `status` é o estado
  corrente, atualizado in-place pelo dono do arquivo nas rodadas seguintes.
- `id`: prefixo do agente (`cr-`, `di-`, `se-`) + sufixo curto, único dentro do arquivo.

## Formato — inspetores (`coder-reviewer.json`, `delivery-inspector.json`)

```json
{
    "rodada_1": {
        "meta": {
            "veredito": "REPROVADO",
            "manifesto": "<comando de verificação do projeto> → 39 testes, 0 falhas, exit 0",
            "adequacao_de_teste": "se nucleo/calculo.js:88 trocasse >= por >, morreria testes/gasto.test.js:41",
            "limite_da_revisao": "revisei os 4 arquivos do diff e 2 vizinhos de nucleo/; não abri ferramentas/"
        },
        "itens": [
            {
                "id": "cr-7f3a2b",
                "agente": "coder-reviewer",
                "severidade": "alto",
                "criterio_da_tabela": "resultado incorreto em condição comum",
                "evidencia": "nucleo/calculo.js:142",
                "descricao": "por que isto é um defeito",
                "cenario_de_falha": "quando X acontece, Y ocorre",
                "consequencia": "o que o usuário ou o dado sofre",
                "ref_brief": null,
                "status": "aberto",
                "nota_verificacao": null
            }
        ],
        "fora_do_escopo": []
    }
}
```

- `meta.veredito`: `"APROVADO"` | `"REPROVADO"`. **Derivável**: APROVADO ⇔ zero
  CRÍTICO/ALTO `aberto` nos `itens` deste arquivo (mais o que o `quality.md` do item
  tiver promovido a bloqueante). Veredito que diverge do estado dos itens é auto-relato
  quebrado.
- `meta.manifesto` e `meta.adequacao_de_teste`: obrigatórios para o `coder-reviewer`, com
  o exit code de uma execução **desta rodada**. O `delivery-inspector` preenche
  `veredito` e `limite_da_revisao`.
- `criterio_da_tabela`: o critério da CLASSIFICAÇÃO DE ACHADOS do `quality.md` que o
  achado viola. Achado que não aponta critério não é achado.
- `ref_brief`: seção do `quality.md`/`brief.md` que fundamenta — **obrigatório para o
  `delivery-inspector`**, opcional para o `coder-reviewer`.
- `fora_do_escopo`: mesmo formato de item. Nunca bloqueia, nunca gera rodada — é
  inventário para o dev, não veredito.

### Máquina de estados dos achados

| Status | Quem escreve | Quando |
|---|---|---|
| `aberto` | inspetor, ao criar | CRÍTICO/ALTO/MÉDIO nascem assim. Só CRÍTICO/ALTO `aberto` dispara rodada |
| `registrado` | inspetor, ao criar | BAIXO nasce assim — **terminal**; o engenheiro não é obrigado a responder |
| `resolvido` | inspetor, rodada seguinte | verificou o diff da correção e ela resolve |
| `recusa_aceita` | inspetor, rodada seguinte | o engenheiro recusou com `fundamento`, e o fundamento convence |
| `debito` | inspetor, rodada seguinte | MÉDIO que o engenheiro registrou como débito; aceito |
| `escalado` | inspetor, rodada seguinte | espelha `escalado_ao_dev` do engenheiro, OU impasse (2ª reprovação da correção / recusa não aceita). Sai do gate de rodada; **bloqueia o fecho** até o dev responder |
| `encerrado_pelo_dev` | sessão principal, com a resposta do dev | terminal — a decisão do dev vai em `nota_verificacao` |

Toda mudança de status preenche `nota_verificacao` (uma frase: o que foi verificado).
Manter `aberto` numa rodada de verificação **também** exige `nota_verificacao` — por que
a correção não resolve.

## Formato — engenheiro (`software-engineer.json`)

```json
{
    "rodada_1": {
        "meta": {
            "manifesto": "<comando de verificação do projeto> → 39 testes, 0 falhas, exit 0",
            "criterios_de_pronto_tocados": []
        },
        "itens": [
            {
                "id": "se-9c4e1f",
                "origem_id": "cr-7f3a2b",
                "agente_id": "coder-reviewer",
                "status": "corrigido",
                "descricao": "o que foi feito e por quê — ou o motivo da recusa",
                "fundamento": null,
                "pergunta_ao_dev": null,
                "arquivos_tocados": ["nucleo/calculo.js:80-95"]
            }
        ]
    }
}
```

- **Uma entrada por achado analisado** (`origem_id` singular). Correção única que resolve
  dois achados = duas entradas com os mesmos `arquivos_tocados`.
- `status`: `corrigido` | `recusado` | `debito` | `escalado_ao_dev`.
- `fundamento`: **obrigatório** quando `recusado` — a regra, o teste ou o requisito
  concreto que autoriza recusar (recusa sem fundamento citável é recusa por conveniência)
  — e quando `debito` (a avaliação de custo).
- `pergunta_ao_dev`: **obrigatória** quando `escalado_ao_dev` — a pergunta exata, pronta
  para o dev responder.
- `arquivos_tocados`: vazio quando `recusado` ou `escalado_ao_dev`.
- `meta.criterios_de_pronto_tocados`: os critérios do Definition of Done que o diff de
  correção **alcançou**. **`[]` é afirmação explícita** ("nenhum") — o
  `delivery-inspector` não volta por este motivo. **Campo ausente é entrega incompleta**
  — nunca vale como `[]`; quem despacha a rodada seguinte exige o campo antes de
  prosseguir.
- BAIXO (`status: registrado`) não exige entrada; responder é opcional.

## O gate de encerramento (resumo operacional)

- Nova rodada de correção acontece **se e somente se** existe CRÍTICO/ALTO `aberto`
  (ou achado em área que o `quality.md` do item promoveu a bloqueante).
- O item **fecha** quando: zero CRÍTICO/ALTO `aberto` **e** zero `escalado` sem resposta.
- `escalado` não gera rodada — gera pergunta ao dev, e o fecho espera por ela.
- MÉDIO (`debito`) e BAIXO (`registrado`) nunca seguram nada.
