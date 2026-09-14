# Adaptador — Claude Code

Gera, a partir de `metodo/`: quatro agentes em `~/.claude/agents/`, a skill em
`~/.claude/skills/roadmap-driven-development/` (com os modelos e o roadmap de reconhecimento
junto), e — se você passar `--projeto` — o gate mecânico dentro do projeto.

```bash
node instalar.mjs --alvo claude-code                        # só os agentes e a skill
node instalar.mjs --alvo claude-code --projeto .            # + gate e hooks no projeto
node instalar.mjs --alvo claude-code --projeto . --simular  # mostra o que faria
```

## O que é gerado, e o que não se edita

| Gerado | A partir de |
|---|---|
| `~/.claude/agents/<papel>.md` | `adaptadores/claude-code/agentes.json` (frontmatter) + `metodo/papeis/<papel>.md` (corpo) |
| `~/.claude/skills/<skill>/SKILL.md` | mesmo `agentes.json` + `metodo/00-metodo.md` |
| `…/templates/` e `…/reconhecimento/` | `metodo/modelos/` e `metodo/reconhecimento/` |
| `<projeto>/.crew/review-pipeline.mjs` | `adaptadores/claude-code/gate/` |

Todo arquivo gerado carrega uma marca no topo. **Editar o gerado é perder a edição na próxima
instalação** — mexa em `metodo/` e reinstale.

⚠️ Arquivo que existe e **não** tem a marca é tratado como seu: o instalador escreve
`<nome>.novo` ao lado e avisa, em vez de sobrescrever. Para assumir a versão do pacote,
`--forcar`.

## O gate

Node ESM sem dependência. Comandos:

```
begin <id>   abre a unidade de trabalho (zera vereditos)
scope        o que mudou nesta unidade
set <delivery|review> <approved|rejected> [--adequacy-file <arquivo|->]
status       estado e frescor dos vereditos
gate         hook PreToolUse  — bloqueia git add/commit/push no nível normativo
check        hook Stop        — exige os dois vereditos frescos
reset        zera o estado
```

Três coisas que ele faz e que valem mais que o resto:

1. **`set review approved` roda o manifesto ele mesmo** e recusa o registro se estiver
   vermelho. Auto-relato é forjável; o gate confere.
2. **Exige `--adequacy-file`** para aprovar revisão — a declaração de adequação de teste é a
   única evidência de que a mutação foi de fato procurada, e é o campo que some na rodada em
   que ninguém lembra de pedir.
3. **Frescor assimétrico:** `delivery` sobrevive à correção (prende à unidade + HEAD);
   `review` morre a cada edição de código (prende ao hash do conteúdo).

**Sem `.crew/config.json`, o gate falha ABERTO e em silêncio.** Um projeto que não adotou a
tripulação nunca pode ser bloqueado por ela.

Testes: `node --test adaptadores/claude-code/gate/`. Ficam fora da suíte do projeto
hospedeiro de propósito — o gate é do pacote, não do projeto.

## Configuração

`<projeto>/.crew/config.json` nasce com manifesto **vazio**, e é assim de propósito: os
comandos vêm da fatia 01 da ficha, depois do reconhecimento. Enquanto estiverem vazios,
aprovar revisão é recusado.

```json
{
  "nivelDeRigor": "observador",
  "manifestoRapido":  [["npm", "test", "--", "--changed"]],
  "manifestoCompleto": [["npm", "test"]],
  "docOnly": ["*.md", "docs/**", ".crew/**", ".gitignore"],
  "exigirAdequacao": true
}
```

Cada comando é um **array de argumentos**, não uma string: o gate os executa sem passar por
interpretação de shell, e argumento com espaço não vira dois.
