# Reconhecimento 01 — Manifesto e sensores

> **Papel:** `metodo/papeis/harness-scout.md` — leia-o inteiro antes de começar.
> **Só leitura.** Sem tripulação, sem gate. **Teto de leitura: 15 arquivos.**
> **Saída:** `<PACOTE>/projetos/<slug>/ficha/01-manifesto-e-sensores.md`

## O que esta fatia responde

**Como este projeto verifica a si mesmo** — e essa é a pergunta mais importante do
reconhecimento inteiro. Dela saem os dois comandos que a tripulação roda em toda rodada e no
encerramento, e a lista de sensores que já existem e que ela não deve duplicar.

## A pergunta central: existe um nível rápido?

A tripulação roda verificação **três ou mais vezes por item**. Num projeto grande, a suíte
completa leva dezenas de minutos, e três execuções por item tornam o método inviável.

Procure, nesta ordem, um comando que cubra **só o que o diff alcança**:

- seleção por caminho ou por padrão de nome no runner de testes;
- seleção por projeto/pacote afetado, em monorepo;
- modo "mudados desde a baseline", quando o runner ou o orquestrador oferece;
- o alvo de teste da área, quando a suíte é dividida por domínio.

**Não existe nível rápido?** Escreva `NÃO ENCONTRADO` e repita o comando completo nos dois
campos. A tripulação prefere pagar caro a afirmar verde sem evidência — mas o dev precisa
**ver** esse custo declarado, porque é ele que decide se vale criar um.

⚠️ **Registre o comando, não o resultado.** Você não roda manifesto: rodar é do revisor, na
rodada dele. Se o comando exige ambiente que você não tem (segredos, serviço de pé, emulador),
isso é um **fato da ficha** — anote, porque muda o que a tripulação consegue afirmar.

## Onde procurar

1. **Scripts declarados** no manifesto de pacote, no `Makefile`, `Justfile`, `Taskfile` ou
   equivalente. É o lugar mais provável e o mais barato.
2. **CI** — os workflows. O CI é a verdade sobre o que o projeto considera obrigatório: o que
   ele roda em PR **é** o manifesto do projeto, mesmo que ninguém tenha escrito isso num README.
3. **Hooks de pre-commit / pre-push** — o que já bloqueia antes de chegar no CI.
4. **Configuração dos sensores** — lint, formatação, tipos, análise de segurança, cobertura.
   Você quer saber **se existe**, **como se invoca** e **se falha quebra o build**.
5. **Documentação de contribuição** — o que o projeto *diz* que se roda, para comparar com o
   que o CI *de fato* roda.

⚠️ **Divergência entre o documentado e o que o CI roda é achado valioso.** Registre os dois e
marque qual manda. O CI manda.

## Estrutura da saída

```markdown
# Ficha — 01. Manifesto e sensores

> Levantado em <data> · teto: 15 arquivos (<usados>)

## Já em contexto (não relido)

## Manifestos
| Nível | Comando | Cobre | Não cobre | Tempo típico | Fonte |
|---|---|---|---|---|---|
| rápido | | | | | |
| completo | | | | | |

- Exige ambiente especial? <segredos, serviço, emulador — ou não>

## Sensores
| Sensor | Existe? | Comando | Bloqueia o quê | Onde roda | Fonte |
|---|---|---|---|---|---|
| Testes | | | | | |
| Lint / formatação | | | | | |
| Tipos / análise estática | | | | | |
| Segurança estática / segredos | | | | | |
| Cobertura (e o piso, se houver) | | | | | |
| Outros | | | | | |

## Correspondência (para o índice)
| Diretriz | Desfecho | Instrumento | Justificativa da composição |
|---|---|---|---|

## Documentado × praticado
<divergências entre o que a documentação promete e o que o CI executa>

## Não coberto
## Perguntas ao dev
```

## Perguntas que costumam sobrar

- Existe um comando rápido que o time usa no dia a dia e que não está escrito em lugar nenhum?
- Warning de lint é tolerado na prática, ou o time trata como erro?
- A cobertura tem piso que quebra o build, ou é só relatório?
