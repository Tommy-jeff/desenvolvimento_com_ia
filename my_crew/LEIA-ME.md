# Pacote de desenvolvimento — a tripulação

Método de planejamento e revisão de implementações, empacotado para **viajar entre máquinas
e projetos**. O pacote mora **fora** do projeto: nada aqui precisa entrar no repositório de
quem te contratou, e nada aqui depende de uma LLM específica.

```
avaliar → planejar → fatiar → executar em sessões isoladas → revisar → graduar → encerrar
```

## O que tem aqui

| Pasta | O que é | Quem lê |
|---|---|---|
| `metodo/` | **O núcleo neutro.** Método, papéis, modelos e o roadmap de reconhecimento. Zero marca de ferramenta | qualquer LLM, qualquer projeto |
| `adaptadores/` | Traduções do núcleo para um harness concreto (Claude Code, Cursor, avulso) | o instalador |
| `projetos/<slug>/` | **Estado por projeto** — a ficha do reconhecimento e os aprendizados. Fora do repo do projeto | a tripulação, em execução |

O núcleo é a **única fonte da verdade**. Os adaptadores não copiam conteúdo: eles geram os
arquivos do harness a partir de `metodo/`, no momento da instalação. É o que impede as
cópias de divergirem — que é exatamente o defeito que este pacote existe para curar.

## Premissas (leia antes de instalar)

1. **`git` é dependência dura, não preferência.** A baseline dos inspetores é um hash; o
   universo auditável é `git status` + `git diff`; a lente anti-forja é um `git diff` sobre
   a régua do item. Sem git, o método não roda — e não roda por construção, não por gosto.
2. **O pacote não comita nada.** Quem comita é quem a ficha do projeto declarar.
3. **A tripulação não substitui o aparelho do projeto.** Ela **reconhece** o que já existe —
   convenções de teste, sensores de qualidade, padrões, agentes e regras de outras LLMs — e
   **agrega**. O que o projeto já resolve, a tripulação usa; só onde falta instrumento é que
   o nativo dela entra.

## Como usar num projeto novo

```
1. Instalar o adaptador da sua ferramenta   → adaptadores/<ferramenta>/LEIA-ME.md
2. Rodar o roadmap de reconhecimento         → metodo/reconhecimento/README.md
3. Aprovar a ficha gerada                    → projetos/<slug>/indice.md
4. Trabalhar                                 → metodo/00-metodo.md
```

O passo 2 acontece **uma vez por projeto** e é só leitura: sem tripulação, sem gate, sem
código escrito. Ele existe porque um projeto grande e maduro já tem respostas para quase
tudo que a tripulação precisa saber — e descobri-las no meio de uma implementação é caro,
impreciso e, em janela de contexto pequena, inviável.

## Procedimento de descoberta

Todo papel resolve o caminho do pacote e da ficha assim, sem nunca hardcodar um diretório:

1. **Raiz do pacote:** `$DEV_CREW_HOME` → senão o caminho declarado no `.md` do projeto
   (linha "Pacote de desenvolvimento: …") → senão `~/dev-crew`.
2. **Slug do projeto:** `git remote get-url origin`, normalizado para `host/owner/repo`
   (minúsculas, sem `.git`, sem credenciais). Sem remote: o nome da pasta raiz do worktree.
3. **Entrada:** `<PACOTE>/projetos/<slug>/indice.md`.

**A entrada não existe → o projeto ainda não foi reconhecido.** Não adivinhe os fatos que
ela carregaria: pare e peça o reconhecimento. Ficha ausente é ausência de instrumento, nunca
permissão para supor.

## Tornar padrão numa máquina

O passo 1 da descoberta precisa resolver **sem ninguém informar caminho**. Enquanto ele não
resolve, todo papel depende de receber o caminho absoluto na mão — e um papel que depende de
ser informado não é padrão, é exceção repetida.

Escolha **uma** âncora, e só uma:

| Âncora | Quando usar | Como |
|---|---|---|
| `~/dev-crew` | o caso normal | junção/symlink de diretório apontando para onde o pacote de fato mora |
| `$DEV_CREW_HOME` | o pacote mora em disco removível, ou há mais de um | variável de ambiente de usuário |
| ponteiro no projeto | máquina que você não configura | a linha de `metodo/modelos/ponteiro-no-projeto.md` |

No Windows, a junção não exige privilégio elevado:

```powershell
New-Item -ItemType Junction -Path "$HOMEdev-crew" -Target "<onde o pacote mora>"
```

Em macOS ou Linux, `ln -s "<onde o pacote mora>" ~/dev-crew`.

⚠️ **Âncora é atalho, não cópia.** Se você copiar o pacote para `~/dev-crew` em vez de apontar
para ele, passa a ter duas cópias que ninguém compara — e duas cópias que ninguém compara
viram duas gerações do método, sendo que a errada é sempre a que alguém está usando.

### Espelhos

Cópias de backup se sincronizam por `node espelhar.mjs`, que **confere** o resultado em vez de
confiar nele. Os destinos vêm de `espelhos.json`, que é dado de máquina. `--verificar` só
compara, sem escrever.

Arquivo que existe no espelho e não no canônico é reportado como `sobrando` e **nunca** é
removido automaticamente: apagar arquivo de um diretório que não é o canônico é a operação
deste pacote que não dá para desfazer.

## Níveis de rigor

Ninguém liga um gate bloqueante num repositório maduro no primeiro dia. A ficha declara em
qual nível o projeto está, e o nível sobe quando o dev mandar:

| Nível | Registra retornos | Bloqueia fim de turno | Bloqueia git |
|---|---|---|---|
| `observador` | sim | não | não |
| `consultivo` | sim | sim | não |
| `normativo` | sim | sim | sim |

## Manutenção

Alterou uma rubrica? Altere em `metodo/papeis/` e **reinstale** — nunca edite o arquivo
gerado dentro de `~/.claude/`, `.cursor/` ou equivalente. O arquivo gerado é derivado; a
próxima instalação o sobrescreve, e a sua edição se perde em silêncio.
