# Estado por projeto

Uma pasta por projeto, nomeada pelo **slug** (`host/owner/repo` normalizado, ou o nome da
pasta quando não há remote):

```
projetos/<slug>/
├── indice.md        # ponto de entrada da tripulação — os fatos operacionais
├── ficha/           # as 8 fatias do reconhecimento, com as fontes de cada linha
├── aprendizados/    # escapes.md · custos.md · decisoes.md
├── avulsos/         # contratos mínimos de trabalho fora de roadmap
└── roadmap/         # só quando `roadmap_mora_em: no-pacote`
```

Isto mora **fora** do repositório do projeto de propósito: o projeto pode ser fechado, pode
ser de outra pessoa, e pode ser tocado por mais de uma ferramenta. O que entra lá é só o
ponteiro (`metodo/modelos/ponteiro-no-projeto.md`).

⚠️ **Não versione segredo aqui.** A ficha descreve como o projeto se verifica — comandos,
caminhos, convenções. Se o reconhecimento esbarrar em credencial, endpoint interno ou nome de
cliente, registre a *existência* e não o *valor*.
