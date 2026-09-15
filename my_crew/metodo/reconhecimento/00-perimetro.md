# Reconhecimento 00 — Perímetro

> **Papel:** `metodo/papeis/harness-scout.md` — leia-o inteiro antes de começar.
> **Só leitura.** Sem tripulação, sem gate. **Teto de leitura: 10 arquivos · teto de saída: 250 linhas.**
> **Saída:** `<PACOTE>/projetos/<slug>/ficha/00-perimetro.md`

## O que esta fatia responde

O mínimo para que qualquer outra fatia saiba onde procurar: o que este projeto é, em que
linguagens, com que gerenciadores, organizado como, e de que tamanho.

É a fatia mais barata e a que mais economiza nas outras — as sete seguintes leem daqui em vez
de redescobrir o layout.

## Onde procurar (pare quando responder)

1. **Identidade e remote** — `git remote -v`, `git log -1 --format=%cd` (o projeto está vivo?),
   nome da pasta raiz.
2. **Manifestos de pacote na raiz e um nível abaixo** — qualquer arquivo que declare
   dependências e scripts do ecossistema em uso. É o que revela linguagem e gerenciador sem
   você precisar adivinhar pela extensão.
3. **Layout** — a árvore de diretórios, **até 2 níveis**, ignorando o que o `.gitignore`
   ignora. Não desça mais: descer é trabalho da fatia que precisar.
4. **README** — só as seções de visão geral e de setup.
5. **Sinais de monorepo** — workspaces declarados no manifesto, múltiplos manifestos, arquivo
   de orquestração de build na raiz.

## Tamanho — meça, não estime

Tamanho decide o teto de leitura das outras fatias e se o `manifesto_completo` é viável numa
rodada. Duas medidas bastam:

```bash
git ls-files | wc -l                                  # arquivos versionados
git ls-files | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -15   # extensões dominantes
```

⚠️ **Não conte linhas do worktree inteiro** — em repositório grande isso demora e traz
vendorado junto. `git ls-files` já respeita o que o projeto versiona.

## Estrutura da saída

```markdown
# Ficha — 00. Perímetro

> Levantado em <data> · teto: 10 arquivos (<usados>)

## Já em contexto (não relido)

## Identidade
- Slug: <host/owner/repo>
- Raiz nesta máquina: <caminho absoluto>
- Último commit: <data> · branch padrão: <nome>

## Stack
| Camada / pacote | Linguagem | Gerenciador | Manifesto |
|---|---|---|---|

## Layout
<árvore de 2 níveis, comentada: onde mora o código, os testes, a documentação, a infra>

## Tamanho
- Arquivos versionados: <n>
- Extensões dominantes: <lista com contagem>
- Monorepo: sim/não — <evidência>

## Não coberto
## Perguntas ao dev
```

## Perguntas que costumam sobrar

- Qual parte da árvore está viva e qual é legado que ninguém toca?
- Existe código gerado em massa que distorce a contagem? (a fatia 06 fecha isso)
