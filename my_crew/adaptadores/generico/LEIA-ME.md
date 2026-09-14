# Adaptador — genérico (LLM sem harness)

Para a máquina do trabalho, a ferramenta corporativa, a janela de 350k, o modelo que não tem
agente, skill, hook nem arquivo de regra. É o menor denominador comum: **texto colado numa
sessão**.

```bash
node instalar.mjs --alvo generico
```

Gera `adaptadores/generico/prompts/`: um arquivo por papel, mais o método inteiro. Cada um é
auto-contido — abre a sessão, cola, trabalha.

## Como usar

| Quando | Cole |
|---|---|
| Planejar ou executar um item | `prompts/metodo.md` |
| Reconhecer um projeto novo | `prompts/harness-scout.md` + **o arquivo da fatia** |
| Revisar uma entrega | `prompts/coder-reviewer.md` e `prompts/delivery-inspector.md`, **em duas sessões separadas** |
| Corrigir os achados | `prompts/software-engineer.md` |

## As duas regras que sustentam o método sem harness

**1. Uma sessão por papel, e limpa.** Os inspetores valem pela cegueira. Colar o prompt do
revisor na mesma conversa que escreveu o código produz uma revisão da narrativa, não do
código — e ela vai concordar, porque o raciocínio que a produziu está ali em contexto. Duas
abas, dois inspetores, nenhuma delas com o histórico da implementação.

**2. Entregue fatos, nunca a história.** Ao despachar um papel, dê: o caminho da pasta do
item (ou o contrato), a baseline (hash), a ficha do projeto. **Não dê** o resumo do que você
fez nem por que fez. Se o resumo escapar, o inspetor foi instruído a ignorá-lo e registrar
que veio.

## Janela pequena

É aqui que o fatiamento do reconhecimento paga: **uma fatia por sessão**, com teto de leitura
declarado. O roadmap inteiro numa sessão só não termina em 350k; oito sessões de uma fatia
cada terminam com folga. O mesmo raciocínio vale para os itens de trabalho — item que não cabe
numa sessão isolada é item que precisava ter sido dividido antes de ser atribuído.

## O que você perde sem harness

- **Gate mecânico** — nada bloqueia commit nem fim de turno. O nível de rigor é `observador`,
  e o que sustenta o método é a sua disciplina.
- **Escrita automática dos `retornos/`** — o papel devolve o JSON no chat e **você** o grava.
  Vale a pena gravar mesmo assim: é o registro que permite a rodada de verificação ter escopo
  travado, e sem ele a segunda rodada vira auditoria nova.

Nada disso enfraquece as rubricas: as lentes, a classificação e a disciplina de falha fechada
são as mesmas dos outros adaptadores. O que muda é quem executa a mecânica — você.
