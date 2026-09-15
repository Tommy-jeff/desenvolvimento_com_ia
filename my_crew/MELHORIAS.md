# Melhorias pendentes do pacote

Backlog **do método**, não de projeto nenhum. Mora na raiz do pacote de propósito: melhoria
registrada em `projetos/<slug>/aprendizados/` é melhoria que nenhuma sessão de outro projeto
vai enxergar.

Regra de entrada: só entra o que tem **origem rastreável** — qual uso real revelou o problema.
Item sem origem é ideia, e ideia não vira dívida.

Legenda: 🔴 corrige defeito que já mordeu · 🟡 corrige risco previsto · ⚪ dívida de acabamento

> **Estado em 2026-09-14.** Onze dos treze fechados na mesma passada; o que sobrou está
> anotado no item, com o motivo. Item ✅ já está no núcleo e nos dois espelhos — reinstale
> (`node instalar.mjs --alvo claude-code`) para o gerado acompanhar.


---

## Do pacote

### ✅ FEITO 🔴 1. O modelo do índice não impõe teto de tamanho
`metodo/modelos/ficha-indice.md` · **Origem:** primeiro reconhecimento real (veniti,
2026-09-14) produziu um índice de **463 linhas**. A fatia 07 manda que ele "caiba numa leitura
rápida" — é lido por todo papel em toda implementação — mas nada no modelo impõe limite, e
prosa sem limite cresce. **Conserto:** teto explícito (≤120 linhas) no modelo e no gate da
fatia 07; o que passar volta para a fatia de origem, que é onde o detalhe pertence.

### ✅ FEITO 🔴 2. A classe "trabalho caro que só persiste no fim" não foi varrida nos outros papéis
`metodo/papeis/coder-reviewer.md`, `delivery-inspector.md` · **Origem:** o escape de
2026-09-14 (ver `projetos/veniti_mobile_app/aprendizados/escapes.md`) foi corrigido **só** no
`harness-scout`. Mas o revisor e o auditor também levantam muito antes de gravar o primeiro
byte do `retornos/*.json`, e estão expostos exatamente à mesma perda por interrupção.
**Conserto:** a mesma regra de gravar cedo, nos dois.

### ✅ FEITO 🔴 3. O instalador pode sobrescrever agente em uso por outro projeto
`instalar.mjs` · **Origem:** fatia 04 do veniti. Os papéis vivem em `~/.claude/agents/`, que é
**nível de usuário** — instalar "para um projeto" altera o comportamento de **todos** os
outros. A guarda atual só detecta arquivo não-marcado; não detecta que um arquivo **marcado**
está em uso por outro projeto com versão diferente do método. **Conserto:** registrar versão
do método no arquivo gerado e avisar quando a instalação mudaria a versão em uso.

### ✅ FEITO 🔴 4. O instalador não detecta que os hooks já estão ocupados por OUTRO gate
`instalar.mjs` · **Origem:** fatia 04 do veniti. O código já desvia quando existe a chave
`hooks`, mas o risco medido é pior do que "não mexer": dois gates em `PreToolUse`/`Stop` se
apagam **com falha aberta** — ninguém percebe que parou de existir gate. **Conserto:** o aviso
precisa dizer isso com essas palavras, e o `LEIA-ME` do adaptador precisa carregar "fundir,
não instalar" como caminho padrão em projeto que já tem aparelho.

### ✅ FEITO 🟡 5. Não há gate de tamanho nas fatias do reconhecimento
`metodo/reconhecimento/*` · **Origem:** mesma corrida. O teto é de **arquivos abertos**, não de
tamanho de saída — e uma fatia de 35 KB (a 03) é cara de ler para a fatia 07 e para o dev.
**Conserto:** teto de saída por fatia, ou instrução explícita de que a fatia é referência e não
narrativa.

### ✅ FEITO ⚪ 6. `harness-scout` ficou sem teste do próprio método
**Origem:** o gate tem 23 testes; os papéis não têm nenhum, por serem prosa. Não há como um
teste pegar "a rubrica não manda persistir cedo" — mas há como pegar que um modelo perdeu uma
seção obrigatória. **Conserto:** um teste que valide a estrutura dos modelos.

### ✅ FEITO 🔴 12. O reconhecimento pressupõe um dono de projeto que responde — e às vezes não existe
`metodo/reconhecimento/*`, `metodo/modelos/ficha-indice.md` · **Origem:** o teste no veniti,
2026-09-14. O método só sabe **travar**: pergunta aberta que afeta o frontmatter impede
`aprovado_pelo_dev: sim`, e todo papel passa a declarar a ficha como rascunho. Mas o cenário
que motivou este pacote — projeto fechado, de outra pessoa, que você não controla — é
exatamente aquele em que **não há a quem perguntar**. **Conserto:** um modo em que a fatia
adota o default mais conservador, marca a suposição COMO suposição (não como fato levantado)
e segue, deixando a pergunta registrada sem bloquear. Ficha que nunca pode ser aprovada é
ficha que ninguém usa.

### ✅ FEITO 🔴 13. O volume de perguntas cresce sem consolidação
`metodo/reconhecimento/07-consolidacao.md` · **Origem:** mesmo teste — sete fatias geraram
**59 perguntas**, 16 marcadas como bloqueantes. Cada fatia pergunta de forma independente e a
consolidação foi instruída a juntar tudo **sem editar o texto de nenhuma** — então o mesmo
assunto aparece repetido (`nivel_de_rigor` em 2, `quem_comita` em 2, o manifesto em 7).
**Conserto:** a fatia 07 precisa poder **fundir perguntas equivalentes** e impor um teto de
bloqueantes (≤5). A regra de "não editar o texto" existia para preservar a voz de cada
batedor, e o preço dela ficou maior que o benefício.

---

## Da auditoria de 2026-09-13 (primeiro turno da adoção)

### ⏸️ ABERTO 🔴 7. hispaniola roda a geração anterior do método
`VsCodeProjects/hispaniola/.claude/agents/` · **Origem:** auditoria de 2026-09-13. Três agentes locais (31/07–04/08) **sombreiam** os
da raiz por precedência, e estão **versionados no git** — o oposto da pegada zero. Rodam a
doutrina antiga: achados inline `[D_]`/`[C_]`, sem `retornos/`, sem `Write`. **Conserto:**
remover os locais e adaptar a seção de tripulação do `CLAUDE.md` de lá. Cuidado: o gate dele é
`scripts/review-pipeline.mjs`, 63 KB, e tem `--adequacy-file`, que o gate do pacote incorporou.

### ◐ PARCIAL 🟡 8. Três projetos sem seção de tripulação
**Origem:** auditoria de 2026-09-13. `clinity` (aponta para a skill `roadmap-delivery-review`, ancestral pré-tripulação),
`presenteieme` e `socorreae_mobile` (não têm seção nenhuma). Sessão que implementa lá não
despacha inspetor. **Conserto:** colar o ponteiro de `metodo/modelos/ponteiro-no-projeto.md`.

### ✅ FEITO ⚪ 9. Documentação do veniti mente sobre onde os agentes moram
**Origem:** auditoria de 2026-09-13. `CLAUDE.md:433` afirma "Agentes em `.claude/agents/`" — não há tal pasta; vêm da raiz. E o
`.claude/INSTALL.md` promete que copiar `.claude/` + `CLAUDE.md` leva o backup inteiro: **não
leva os agentes nem a skill.**

### ⏸️ ABERTO ⚪ 10. `retornos/` no nível do tema em `endpoints-residuais-v2`
**Origem:** auditoria de 2026-09-13. Três JSONs de ~35 KB comitados no nível do tema, além dos por item. Resíduo do formato antigo.

---

## Decisões em aberto

### ⏸️ DECISÃO 11. Migrar o gate do veniti de Dart para o do pacote?
O do veniti (Dart, 22 KB) funciona e está instalado. O do pacote (Node) tem `--adequacy-file`,
que o Dart não tem. Migrar custa uma unidade de trabalho e não é urgente — **decisão do dev**.
