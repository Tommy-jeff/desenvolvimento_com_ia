# IDEs e Setup

> [!abstract] Pré-requisitos
> [[00 - Panorama de Ferramentas]]

Esta nota responde diretamente a três perguntas das suas anotações ([[Noções básicas]]): *qual IDE usar (sem abandonar o Android Studio)? devo usar mais de uma IDE? qual é o pacote de desenvolvimento atual?*

## O que é: o "setup" mental

A pergunta "qual IDE?" parte de uma suposição antiga — a de que IDE e IA são a **mesma coisa** e que adotar IA significa **trocar** de editor. Não significa.

> [!important] A separação que resolve tudo
> Hoje, **o agente de IA não precisa estar acoplado à sua IDE**. Um agente CLI (como o Claude Code) roda no **terminal** e atua sobre os **arquivos do projeto** — os mesmos que o Android Studio abre. Editor e agente trabalham no mesmo diretório, em paralelo. Logo: você **não precisa abandonar o Android Studio**.

## A recomendação para sua stack (Flutter)

O Android Studio é, hoje, o melhor ambiente para o "ofício Flutter": emulador, Flutter Inspector, DevTools, debugger, hot reload, gerenciamento de SDK/devices. **Isso a IA não substitui.** Então:

> [!tip] Setup recomendado: Android Studio + agente CLI lado a lado
> 1. **Android Studio** continua sendo seu centro de execução: rodar/depurar o app, inspecionar widgets, hot reload, emulador.
> 2. **Agente CLI (Claude Code)** roda em um **terminal** — pode ser o terminal embutido do próprio Android Studio — apontando para a raiz do projeto. Ele lê/edita os arquivos; você vê as mudanças refletirem na IDE na hora.
> 3. **Fluxo:** peça a tarefa ao agente no terminal → ele edita → você revisa o diff → faz hot reload no Android Studio para ver rodando.
>
> Resultado: você ganha a IA **sem perder** nada do ferramental Flutter que já domina.

## Devo usar mais de uma IDE?

Depende do que "IDE" significa aqui:

- **Para Flutter:** mantenha **uma** principal (Android Studio). Trocar de IDE para programar Flutter raramente compensa.
- **Para o agente de IA:** ele é **complementar**, não uma segunda IDE. O terminal não é "outra IDE", é uma ferramenta ao lado.
- **Quando faz sentido um segundo editor?** Se quiser experimentar um editor com IA fortemente integrada (ex.: VS Code + extensão, ou Cursor) para *tarefas de IA*, tudo bem usá-lo **em paralelo** no mesmo repo — mas sem migrar seu fluxo Flutter para lá de imediato. Evite manter dois ambientes só por manter; isso fragmenta sua atenção.

> [!warning] Cuidado com edições simultâneas
> Se o agente edita um arquivo enquanto o Android Studio o tem aberto, recarregue/sincronize para não sobrescrever. Commits pequenos e frequentes (Git) tornam isso seguro e reversível.

## Comparação de ambientes para rodar o agente

| Ambiente | Como o agente entra | Bom para |
|---|---|---|
| **Android Studio + Claude Code no terminal** | CLI no terminal embutido | seguir com seu fluxo Flutter atual + IA (recomendado) |
| **VS Code + extensão de agente** | painel/extensão integrada | quem prefere edição leve e integração visual de diffs |
| **Cursor / Windsurf** | IA nativa no editor | quem topa um editor dedicado à IA em paralelo |

Os conceitos do Módulo 04 (Rules, Skills, MCP) funcionam em **qualquer** um desses — eles vivem no **repositório**, não na IDE.

## O "pacote de desenvolvimento atual" (checklist)

Um setup atual e enxuto para um dev Flutter:

- [ ] **Android Studio** (execução, debug, DevTools, emulador) — mantido.
- [ ] **Git** com commits pequenos e frequentes — sua rede de segurança ao deixar a IA editar.
- [ ] **Um agente CLI** (Claude Code) rodando no terminal do projeto.
- [ ] **(Opcional) autocomplete** no editor para o dia a dia de digitação.
- [ ] **Arquivo(s) de Rules** versionado(s) no repo ([[00 - Rules e Arquivos de Instrucao]]).
- [ ] **Skills/MCP** conforme a necessidade aparece (Módulo 04).
- [ ] **Quality gate** (format, analyze, testes) que vale também para código gerado por IA — ver [[00 - Estruturando um Projeto Flutter para IA]].

## Cenário de exemplo (Flutter / Dart)

Você quer adicionar uma tela de configurações:

1. Abre o terminal **dentro do Android Studio**, na raiz do projeto.
2. Pede ao agente: *"crie `SettingsPage` seguindo o padrão das outras páginas em `lib/features/`, com toggle de tema e item de logout."*
3. O agente edita os arquivos; você vê no painel de arquivos do Android Studio.
4. **Hot reload** → a tela aparece no emulador.
5. Ajusta detalhes visuais com hot reload, revisa o diff no Git, commita.

Um único ambiente, IA e Flutter convivendo.

## Armadilhas comuns

> [!warning]
> - **Achar que precisa migrar de IDE** para usar IA — não precisa.
> - **Manter dois ambientes pesados** "por garantia" — escolha um principal.
> - **Deixar a IA editar sem Git** — sempre tenha como reverter.
> - **Esquecer de sincronizar** arquivos editados pelo agente que estão abertos na IDE.

## Resumo

Mantenha o Android Studio como centro do ofício Flutter e acople um agente CLI pelo terminal. IA é uma camada **ao lado** da sua IDE, não um substituto dela — e toda a configuração mora no repositório, que é o tema do próximo módulo.

---
**Próximo passo:** o coração das suas dúvidas — como configurar o agente → [[00 - Rules e Arquivos de Instrucao]]
