# Roadmap de reconhecimento

Levanta o que o projeto **já tem** e monta a ficha que a tripulação vai consultar em toda
implementação. Roda **uma vez por projeto**, antes do primeiro item de trabalho.

> 🔵 **Este roadmap é só leitura.** Nada é implementado, nada é corrigido, nenhum comando de
> escrita roda. **A tripulação não é acionada** — não há inspetor, não há gate, não há
> veredito, porque não há entrega sendo julgada. O papel de todas as oito sessões é
> `metodo/papeis/harness-scout.md`.

## Por que fatiado

Porque a alternativa não cabe. Num projeto grande e maduro, responder tudo de uma vez exige
abrir dezenas de arquivos de configuração, workflows de CI, documentos normativos e a suíte de
testes — e o resultado é uma leitura rasa de tudo em vez de uma leitura certeira de cada
coisa. Fatiado, cada sessão abre poucos arquivos, com um alvo declarado e um teto explícito, e
entrega uma fatia que se sustenta sozinha.

O ganho é maior quanto **menor** for a janela de contexto disponível. Em 350k, o roadmap
inteiro numa sessão só não termina; oito sessões de uma fatia cada terminam com folga.

## As três regras

1. **O que já está no contexto não se lê de novo.** Toda fatia abre com o inventário do que a
   ferramenta já carregou sozinha. Releitura é o desperdício mais caro deste passo.
2. **Teto de leitura por item.** Estourou, registra o que faltou e **para**. Fatia incompleta e
   honesta vale; fatia completa por adivinhação, não.
3. **Falha fechada, linha a linha.** Cada afirmação cita a fonte. O que não se achou vira
   `NÃO ENCONTRADO — procurei em: …`, nunca o que "costuma ser".

## Como atribuir

Uma sessão por item, na ordem. Cada uma recebe só o arquivo do seu item:

```
@<PACOTE>/metodo/reconhecimento/01-manifesto-e-sensores.md execute este levantamento
```

Antes da primeira, crie o destino e resolva o slug:

```bash
git remote get-url origin      # normalize para host/owner/repo; sem remote, use o nome da pasta
mkdir -p <PACOTE>/projetos/<slug>/ficha
```

## Os itens

| # | Item | Responde | Teto |
|---|---|---|---|
| 00 | [Perímetro](00-perimetro.md) | o que é o projeto, stack, layout, tamanho | 10 |
| 01 | [Manifesto e sensores](01-manifesto-e-sensores.md) | como se verifica: teste, lint, tipos, SAST, CI | 15 |
| 02 | [Testes](02-testes.md) | como se escreve teste aqui, e quais são os exemplares | 12 |
| 03 | [Padrões e decisões](03-padroes-e-decisoes.md) | o que é normativo, o que não se re-decide | 12 |
| 04 | [Aparelho de IA existente](04-aparelho-de-ia.md) | o que já existe de agente/regra/skill, e como conviver | 12 |
| 05 | [Fronteiras e risco](05-fronteiras-e-risco.md) | áreas sensíveis, donos humanos, dependências, quem comita | 12 |
| 06 | [Classes de arquivo](06-classes-de-arquivo.md) | o que é gerado, vendorado, lockfile, snapshot | 8 |
| 07 | [Consolidação](07-consolidacao.md) | monta o `indice.md` a partir das sete fatias | — |

Os itens **00 a 06 são independentes** — podem rodar em qualquer ordem, e em paralelo se você
tiver como. O **07 depende dos sete**, e lê as fatias, não o projeto.

## Ao terminar

O item 07 entrega o `indice.md` com `aprovado_pelo_dev: nao` e uma lista de perguntas abertas.
**Leve as perguntas ao dev, aplique as respostas, e só então vire o campo para `sim`.** Até
lá, todo papel da tripulação trata a ficha como rascunho e declara isso.

## Reconhecimento não é para sempre

Projeto vivo muda: comando de teste troca, CI ganha etapa, convenção evolui. Re-rode **a fatia
afetada** quando a tripulação esbarrar num fato desatualizado — nunca o roadmap inteiro. E
registre o que mudou em `aprendizados/decisoes.md`, porque um fato que mudou uma vez costuma
mudar de novo.
