# Adaptador — Cursor

Gera as regras do Cursor **dentro do projeto**, em `.cursor/rules/`, a partir de `metodo/`.

```bash
node instalar.mjs --alvo cursor --projeto .
```

| Gerado | Papel |
|---|---|
| `.cursor/rules/crew-metodo.mdc` | o método inteiro |
| `.cursor/rules/crew-coder-reviewer.mdc` | revisor de código |
| `.cursor/rules/crew-delivery-inspector.mdc` | auditor de entrega |
| `.cursor/rules/crew-software-engineer.mdc` | engenheiro de correção |
| `.cursor/rules/crew-harness-scout.mdc` | batedor de reconhecimento |

Todas nascem com `alwaysApply: false`: elas entram quando a descrição casa com a tarefa, não
em toda mensagem. Regra de revisão carregada o tempo todo é contexto queimado — e num projeto
grande isso pesa.

## A diferença que importa

O Cursor não tem subagente com contexto próprio. **A cegueira dos inspetores, que é o que dá
valor a eles, você precisa produzir à mão**: abra uma sessão nova para cada inspetor e não cole
o histórico da implementação. Rodar os dois papéis dentro da mesma conversa que escreveu o
código não é uma versão mais fraca do método — é uma concordância cara, porque o modelo já
tem a narrativa dele em contexto e vai revisá-la, não ao código.

Se não der para abrir sessão separada, prefira o adaptador genérico e cole o prompt em outra
ferramenta.

## Prefixo `crew-`

Os arquivos são prefixados de propósito: num projeto maduro é comum já existir regra com nome
parecido, e colisão de nome faz alguém carregar a errada. Se o projeto já tiver algo chamado
`crew-*`, renomeie na instalação — a fatia 04 do reconhecimento é quem detecta isso.

## Gate

Não há. O gate mecânico depende de hooks de tool call, que é mecanismo do Claude Code. No
Cursor o nível de rigor é `observador` por construção: os retornos são registrados, nada é
bloqueado. O que sustenta o método aqui é a disciplina de sessão separada, não a máquina.
