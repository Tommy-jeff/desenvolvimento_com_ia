# Reconhecimento 06 — Classes de arquivo

> **Papel:** `metodo/papeis/harness-scout.md` — leia-o inteiro antes de começar.
> **Só leitura.** Sem tripulação, sem gate. **Teto de leitura: 8 arquivos.**
> **Saída:** `<PACOTE>/projetos/<slug>/ficha/06-classes-de-arquivo.md`

## O que esta fatia responde

Quais arquivos versionados **não se lê linha a linha** numa revisão — e, para cada classe,
**contra o que eles são conferidos**.

Sem esta fatia, o revisor de um projeto grande tem dois desfechos ruins e nenhum bom: afoga
lendo milhares de linhas de código gerado, ou pula em silêncio e não declara que pulou. Com
ela, ele pula **declaradamente** e confere o que importa.

## A regra: não ler não é ignorar

Cada classe tem uma **fonte** contra a qual a coerência é verificada. É essa checagem barata
que substitui a leitura cara:

| Classe | O que é | Confere-se contra |
|---|---|---|
| **gerado** | produzido por ferramenta a partir de uma fonte no repo | a fonte mudou junto? o gerado corresponde a ela? |
| **vendorado** | código de terceiro copiado para dentro | a versão declarada bate? veio inteiro, sem edição local não registrada? |
| **lockfile** | resolução travada de dependências | bate com o manifesto? entrou dependência que ninguém pediu? |
| **snapshot** | saída gravada de um teste | a mudança no snapshot é **intencional** e explicada pelo diff do código? |

⚠️ **O snapshot é o mais perigoso dos quatro.** Snapshot atualizado em massa é a forma mais
comum de um defeito real atravessar uma revisão sem ninguém ver: a ferramenta reescreve, o
diff fica enorme, e todo mundo aceita. Se o projeto usa snapshot, diga **como se distingue**
atualização legítima de atualização preguiçosa.

## Onde procurar

1. **Marcações de atributo de arquivo** — o mecanismo do git para marcar gerado/vendorado é a
   fonte mais confiável quando existe.
2. **Cabeçalhos de arquivo** — código gerado quase sempre se anuncia na primeira linha
   ("do not edit"). Uma varredura por essa marca acha o que nenhuma configuração declarou.
3. **Configuração das ferramentas de geração** — o que geram e para onde.
4. **Exclusões dos sensores** — o que o lint, a cobertura e a análise estática já excluem. Se
   uma ferramenta do projeto já ignora aquele caminho, é forte indício da classe.
5. **`.gitignore`** — para o contraste: o que é gerado **e não versionado** não interessa aqui,
   porque nunca aparece num diff.

## Estrutura da saída

```markdown
# Ficha — 06. Classes de arquivo

> Levantado em <data> · teto: 8 arquivos (<usados>)

## Já em contexto (não relido)

## Classes
| Padrão (glob) | Classe | Gerado/mantido por | Confere-se contra | Fonte |
|---|---|---|---|---|

## Volume
<quantos arquivos versionados caem em cada classe — mostra ao dev o quanto isso pesa numa
revisão deste repositório>

## Snapshot: legítimo × preguiçoso
<como distinguir, neste projeto — ou NÃO ENCONTRADO>

## Não coberto
## Perguntas ao dev
```

## Perguntas que costumam sobrar

- Há código gerado que **não** se anuncia no cabeçalho e que só quem conhece o projeto sabe?
- Vendorado tem edição local proposital? Onde está registrada?
- Existe caminho que o time trata como "não revisar" sem que nada declare isso?
