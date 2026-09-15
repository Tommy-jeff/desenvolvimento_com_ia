# Escapes — veniti_mobile_app

Defeito que passou por um gate e só apareceu depois. **O sujeito de cada linha é o gate que
vazou**, nunca a sessão que errou — sessão erra sempre, e é para isso que existe gate.

---

## 2026-09-14 — A rubrica do batedor não mandava persistir cedo

**O que vazou:** `metodo/papeis/harness-scout.md` — a seção *Sua saída* dizia **o que**
escrever e **onde**, mas não dizia **quando** nem **com o quê**.

**Como apareceu:** no primeiro reconhecimento real (este projeto), sete batedores rodaram em
paralelo e o limite de sessão da API cortou quatro deles. **Duas** fatias tinham o levantamento
pronto e ainda não haviam gravado — o trabalho inteiro se perdeu, e teve de ser refeito do
zero. As outras duas morreram **depois** de gravar, e os arquivos saíram íntegros.

A diferença entre perder tudo e não perder nada foi só a ordem das operações. Uma das perdidas
tinha acabado de tentar gravar por heredoc de shell e visto o heredoc tropeçar nas aspas do
markdown — gastou nisso a chamada que teria usado para gravar de verdade.

⚠️ **Segundo escape, no mesmo episódio, e este é de quem coordenava:** a sessão principal
listou o diretório para saber o que tinha sobrevivido e tratou o resultado como definitivo.
Não era — dois batedores ainda estavam agonizando e gravaram **depois** da listagem. A sessão
relançou duas fatias que não precisavam ser relançadas e relatou ao dev uma perda maior do que
a real. Listagem de diretório enquanto há trabalho concorrente vivo é **instantâneo**, não
inventário; quem lê precisa esperar o trabalho concorrente terminar, ou tratar o resultado
como piso, nunca como fato.

**Por que o gate não pegou:** não havia gate. A rubrica tratava a gravação como o último passo
natural do trabalho, e "último passo" é exatamente o que uma interrupção come. O custo de
gravar cedo e reescrever depois é uma chamada; o de gravar tarde é a sessão inteira — e a
assimetria não estava escrita em lugar nenhum.

**Correção (aplicada na raiz, não neste projeto):** a seção *Sua saída* passou a exigir
gravação **assim que o levantamento existir** e **pela ferramenta de escrita, nunca por
heredoc ou redirecionamento**, com as duas razões explícitas. Regenerado nos três lugares
(núcleo ×2 + agente instalado).

**Classe nova que isto revela:** *trabalho caro que só persiste no fim*. Vale procurá-la nos
outros papéis — o revisor e o auditor também levantam muito antes de gravar o primeiro byte
do `retornos/*.json`, e estão sujeitos exatamente à mesma perda.
