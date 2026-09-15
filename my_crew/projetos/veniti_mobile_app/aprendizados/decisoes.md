# Decisões — veniti_mobile_app

Decisões do dev que valem além de um item. Cada linha é datada, porque decisão sem data vira
regra sem origem.

---

## 2026-09-14 — O dev não faz mais parte da empresa que mantém este projeto

**Decisão:** nenhuma operação git neste repositório. Nem escrita (`commit`, `push`, `fetch`),
nem leitura (`status`, `log`, `ls-files`, `remote`).

**Por quê:** o usuário do dev ainda tem acesso ao repositório remoto, e é justamente por isso
que a linha é traçada aqui: o que impede o acesso indevido não é a falta de permissão, é a
decisão de não usá-la. Buscar atualização ou enviar qualquer coisa seria antiético.

**Como se aplica:**

- O **reconhecimento** deste projeto rodou sem git. Onde uma resposta só viria de comando git,
  a fatia registra `NÃO ENCONTRADO — a fonte exigiria comando git, proibido nesta execução`,
  nunca uma estimativa. Em particular: data do último commit, contagem exata de arquivos
  versionados, e o histórico de autores ficaram sem resposta.
- O **slug** é `veniti_mobile_app` (nome da pasta), não o caminho do remote — o método já
  prevê esse desfecho para projeto sem remote utilizável.
- `quem_comita: dev` — e, na prática, **nada sai deste repositório**.

**Estado do repositório após a decisão:**

- Identidade git **local removida** (`user.name` e `user.email`, que apontavam para o e-mail
  corporativo). A seção `[user]` do `.git/config` ficou vazia.
- Não há identidade **global** configurada nesta máquina.
- Consequência prática: um `git commit` neste repositório **falha por falta de identidade**,
  em vez de silenciosamente atribuir o commit a alguém. Isso é mais forte que a remoção
  pedida — a remoção sozinha teria feito o git cair no global.

**O que NÃO foi mexido, e por quê:** o `remote origin` continua configurado. Removê-lo não foi
pedido, e ele é a única evidência de onde este código veio — apagá-lo empobreceria o registro
sem impedir nada que a falta de identidade já não impeça.

⚠️ **Ponto de atenção:** o gate de revisão instalado neste projeto (hook de fim de turno)
executa `git status` por conta própria, fora do controle de quem trabalha. É leitura local e
não toca a rede, mas quem quiser zero invocação de git precisa desligar o hook em
`.claude/settings.json`.
