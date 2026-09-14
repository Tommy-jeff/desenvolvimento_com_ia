# Reconhecimento 07 — Consolidação

> **Papel:** `metodo/papeis/harness-scout.md` — leia-o inteiro antes de começar.
> **Só leitura.** Sem tripulação, sem gate. **Sem teto** — mas você lê **as fatias**, não o
> projeto.
> **Saída:** `<PACOTE>/projetos/<slug>/indice.md`, a partir de
> `metodo/modelos/ficha-indice.md`.
> **Depende de:** as sete fatias `00`–`06` entregues.

## O que esta fatia faz

Monta o ponto de entrada que toda sessão da tripulação vai ler. Ele precisa ser **curto**: é
lido em toda implementação, por todo papel, e cada linha inútil aqui é paga muitas vezes.

⚠️ **Não abra o projeto.** Seu universo são os sete arquivos de `ficha/`. Se uma resposta não
está neles, ela **não existe** — vira `NÃO ENCONTRADO` ou pergunta ao dev, nunca uma consulta
sua ao repositório. Abrir o projeto aqui reintroduz exatamente o custo que o fatiamento
eliminou.

## Método

1. **Copie o modelo** `metodo/modelos/ficha-indice.md` para o destino.
2. **Preencha o frontmatter.** São os fatos que todo papel lê; cada um vem de uma fatia:

   | Campo | Vem de |
   |---|---|
   | `projeto`, `slug`, `raiz` | 00 |
   | `manifesto_rapido`, `manifesto_completo` | 01 |
   | `idioma_dos_retornos` | 03 (decisão do dev) |
   | `quem_comita` | 05 |
   | `nivel_de_rigor` | decisão do dev — na ausência dela, `observador` |
   | `roadmap_mora_em` | decisão do dev — `no-repo:<path>` se o repositório aceita, senão `no-pacote` |
   | `retornos_schema` | onde o schema foi (ou será) copiado |
   | `aprovado_pelo_dev` | **sempre `nao` na sua entrega** |

3. **Monte a tabela de correspondência**, juntando as linhas que as fatias 01–05 já
   classificaram. Conflito entre duas fatias sobre a mesma diretriz não se resolve por
   escolha sua: **as duas leituras vão para a ficha**, e a divergência vira pergunta ao dev.
4. **Consolide as listas** — áreas sensíveis, fronteiras humanas, classes de arquivo, testes de
   referência, documentos normativos, aparelho de IA existente.
5. **Junte todas as perguntas ao dev** das sete fatias numa lista só, sem editar o texto de
   nenhuma. Marque quais delas **travam** um campo do frontmatter: são essas que impedem a
   aprovação.
6. **Prepare o ponteiro.** A partir de `metodo/modelos/ponteiro-no-projeto.md`, deixe o texto
   pronto para o dev colar nos documentos que a fatia 04 identificou. **Você não cola** — não
   escreve no projeto.

## O gate desta fatia

Antes de entregar, confira:

- [ ] Todo campo do frontmatter está preenchido — com valor real ou com `NÃO ENCONTRADO`.
- [ ] Nenhum valor foi inferido: cada um aponta para a fatia de origem.
- [ ] `aprovado_pelo_dev: nao`.
- [ ] As perguntas que travam campos do frontmatter estão marcadas como tal.
- [ ] O índice cabe numa leitura rápida. Passou disso, o detalhe volta para a fatia de origem —
      o índice **aponta**, as fatias **explicam**.

## O que você entrega ao dev

Um resumo curto, e nesta ordem:

1. **As perguntas que travam a aprovação** — primeiro, porque é o que ele precisa responder.
2. **As divergências** entre fatias, se houver.
3. **O que ficou `NÃO ENCONTRADO`** e para o que isso cega a tripulação.
4. **O ponteiro pronto** para colar, e em quais arquivos.

Depois das respostas do dev: aplique-as, vire `aprovado_pelo_dev: sim`, e registre em
`aprendizados/decisoes.md` as que forem decisões — não meros preenchimentos.
