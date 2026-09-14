# Ponteiro — o que entra no repositório do projeto

O pacote mora fora do projeto. Dentro dele entra **só o ponteiro**: o mínimo para que
qualquer assistente, em qualquer sessão, encontre o método e a ficha.

Cole no documento de instruções que aquele ecossistema já usa — `CLAUDE.md`, `AGENTS.md`,
`.cursor/rules/*.mdc`, `.github/copilot-instructions.md`, `CONTRIBUTING.md`. Em mais de um, se
o projeto for tocado por mais de uma ferramenta.

---

## Versão curta (uma linha — use quando o projeto não é seu)

```markdown
> Pacote de desenvolvimento: `<caminho absoluto>` — método, papéis de revisão e a ficha
> deste projeto em `projetos/<slug>/`. Começar por `LEIA-ME.md`.
```

## Versão completa (use quando você controla o documento)

```markdown
## Pacote de desenvolvimento

O método de planejamento e revisão usado neste projeto mora **fora do repositório**, em
`<caminho absoluto>`. Nada dele é comitado aqui.

- **Método e papéis:** `metodo/` — comece por `LEIA-ME.md`.
- **Ficha deste projeto:** `projetos/<slug>/indice.md` — os fatos operacionais (comandos de
  verificação, convenção de teste, áreas sensíveis, quem comita). **Leia antes de implementar;
  não a adivinhe.**
- **Roadmaps:** `<docs/roadmap/ — ou "no pacote, em projetos/<slug>/roadmap/">`.

Regra de precedência: este documento e os normativos do projeto **vencem** o método em caso de
conflito. O método agrega processo; ele não substitui a convenção daqui.
```

---

## Por que tão pouco

O ponteiro não repete o método. Repetição é a origem de toda divergência que este pacote
existe para evitar: o dia em que o `CLAUDE.md` do projeto descreve uma rodada de revisão e o
pacote descreve outra, ninguém sabe qual vale.

⚠️ **A regra de precedência não é formalidade.** Num projeto que não é seu, a convenção da casa
ganha — sempre. O método entra como processo em cima dela, nunca como substituição dela.
