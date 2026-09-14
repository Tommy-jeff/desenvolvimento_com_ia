---
name: <tema-em-kebab-case>
description: <Escrever rica em GATILHOS, não em resumo: comece com "Use ao implementar ou alterar qualquer feature que <toque o tema>", liste as situações concretas que devem disparar o carregamento (tipos de entidade, telas, operações), enumere o que a Skill cobre (regras principais, por nome) e termine relacionando com outros documentos normativos do projeto ("Complementa <skill-x>, que cobre <Y>").>
---

<!--
Esqueleto de Skill normativa — usar ao GRADUAR um roadmap maduro (seção 9 da skill roadmap-driven-development).
Salvar no formato de documento normativo que a ficha do projeto indicar (ex.: uma skill em .claude/skills/<tema>/, uma regra em .cursor/rules/, um doc em docs/) e APAGAR este comentário.
Lembrar: atualizar o README do roadmap para apontar para esta Skill, e o documento de instruções do projeto
(com permissão explícita do dev, se o projeto exigir).
O frontmatter acima deve permanecer como a primeira linha do arquivo.
-->

# <Título do tema> — <Nome do projeto>

Esta Skill é **normativa** para <escopo: todo código que...>. Se uma seção começa com **(NORMATIVO)**, segui-la não é opcional — divergir requer justificativa explícita em PR.

Implementação canônica de referência: <entidade/módulo exemplar> (<paths dos arquivos que servem de espelho para novas implementações>).

Roadmap de convergência/expansão: `docs/roadmap/<tema>/` — **o status dos itens vive lá** (frontmatter de cada item + tabela do README). Esta Skill não duplica a tabela de status.

## Quando aplicar

Carregar/aplicar esta Skill sempre que a tarefa envolver:

- <situação concreta 1>
- <situação concreta 2>
- Trabalho em itens do roadmap `docs/roadmap/<tema>/`.

Não aplicar para: <exclusões explícitas — evita falsos positivos>.

---

## 1. <Regra central> (NORMATIVO)

<Enunciado + tabela ou snippet quando ajudar. Preferir regras curtas, imperativas e testáveis.>

## 2. <Convenção de leitura/escrita> (NORMATIVO)

<...>

## N. <Seções informativas — sem o marcador (NORMATIVO) — para contexto, racional das decisões, histórico.>

## Anti-padrões

<!-- Extraídos da prática do roadmap: o que sessões realmente erraram ou quase erraram. -->

- ❌ <anti-padrão> — <por que quebra e o que fazer no lugar>.

## Checklist de PR

- [ ] <verificação objetiva 1>
- [ ] <verificação objetiva 2>
