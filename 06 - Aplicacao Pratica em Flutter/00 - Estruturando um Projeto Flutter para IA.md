# Estruturando um Projeto Flutter para IA

> [!abstract] Pré-requisitos
> [[01 - Orquestrando Workflows]] e todo o Módulo 04.

## O que é

Tornar um projeto **"AI-friendly"** é organizá-lo para que a IA produza bom código com pouco atrito: convenções claras, contexto fácil de achar e um portão de qualidade que vale também para o que a IA gera. Não é reescrever o projeto — é adicionar as camadas de configuração dos módulos anteriores **ao seu repo Flutter**.

> [!important] A tese
> Um projeto bem estruturado para humanos já é meio caminho para ser bom para IA. A IA só amplifica o que existe: base organizada → ótimo código gerado; base bagunçada → bagunça mais rápida. Estruturar para IA é, em grande parte, **boa engenharia** + os arquivos de configuração certos.

## Os pilares de um repo Flutter pronto para IA

### 1. Arquitetura e convenções explícitas
A IA segue padrões — se eles estiverem **escritos**. Tenha uma estrutura previsível e documentada:
```
lib/
  core/            # erros, rede, tema, utils compartilhados
  features/
    <feature>/
      data/        # repositories, datasources, models
      domain/      # entities, usecases (se usar)
      presentation/# bloc/cubit, pages, widgets
```
Padrões consistentes = a IA acerta de primeira com mais frequência.

### 2. Rules versionadas (`CLAUDE.md` / `AGENTS.md`)
O arquivo de instruções do projeto ([[00 - Rules e Arquivos de Instrucao]]) na raiz: stack, arquitetura, convenções, comandos e proibições. É o primeiro arquivo a criar.

### 3. Skills para procedimentos recorrentes
Empacote o que você repete ([[01 - Skills]]): "criar feature BLoC", "gerar testes de bloc", "adicionar string i18n em todos os locales".

### 4. Quality gate que disciplina a IA
Este é o ponto **mais importante** para confiar no código gerado. Um portão automático que roda em todo commit:
```
1. dart format .      (formatação)
2. flutter analyze    (análise estática)
3. flutter test       (testes)
4. (opcional) SAST    (ex.: semgrep) para segurança
```
Você já aplica exatamente isso no seu projeto real (o Veniti Mobile usa husky + analyze + semgrep + test). **Esse gate vale para o código da IA igual ao seu** — é o que transforma "confio cegamente" em "confio porque passou no portão".

### 5. Git como rede de segurança
Commits pequenos e frequentes. Toda mudança da IA é revisável no diff e reversível. Sem isso, dar autonomia à IA é arriscado.

### 6. Testes como contrato
Testes existentes protegem refactors da IA: se ela quebrar comportamento, o teste acusa. Peça testes junto de cada feature/bugfix — vire isso uma Rule.

## Como usar da melhor maneira

> [!tip] Ordem sugerida para "preparar" um repo
> 1. Escreva o `CLAUDE.md`/`AGENTS.md` (convenções + comandos + proibições).
> 2. Garanta o quality gate rodando em pre-commit (format + analyze + test).
> 3. Crie 1–2 Skills para seus procedimentos mais repetidos.
> 4. Configure MCP só se houver fonte externa útil (issues, banco).
> 5. Adote o loop de [[01 - Orquestrando Workflows]] no dia a dia.
> 6. Refine as Rules sempre que a IA errar o mesmo padrão.

## Qual o melhor lugar para aplicar

- **Qualquer projeto Flutter** que você vai manter por mais de alguns dias.
- **Especialmente** projetos de equipe: as Rules/Skills/gate versionados fazem todos (e todas as IAs) seguirem o mesmo padrão.

## Cenário de exemplo (Flutter / Dart)

Você assume um app Flutter existente, sem nada de IA configurado. Em uma tarde:

1. Cria `CLAUDE.md` descrevendo a arquitetura atual, o uso de BLoC, os comandos e "todo feature tem teste; não burlar hooks".
2. Adiciona um pre-commit que roda `dart format`, `flutter analyze` e `flutter test`.
3. Cria a Skill `criar-feature-bloc` com o template real do projeto.
4. A partir daí, pedir uma feature nova gera código **no padrão do projeto**, **testado** e que **não passa** se quebrar o gate.

O repo deixou de ser "um lugar onde a IA chuta" e virou "um lugar onde a IA produz no seu padrão, com rede de proteção".

## Armadilhas comuns

> [!warning]
> - **Dar autonomia à IA sem quality gate** → bugs e dívida entram silenciosamente.
> - **Rules desatualizadas** após o projeto evoluir → confundem a IA.
> - **Sem testes** → nada protege os refactors que a IA propõe.
> - **Estrutura inconsistente** → a IA replica a inconsistência.
> - **Segredos no repo** para "facilitar" o MCP → risco de segurança.

## Resumo

Preparar um projeto Flutter para IA = arquitetura clara + Rules versionadas + Skills + um quality gate automático + Git/testes como rede de segurança. Isso converte confiança cega em confiança verificável. A seguir, casos completos de ponta a ponta.

---
**Próximo passo:** ver tudo funcionando em casos reais → [[01 - Casos de Uso de Ponta a Ponta]]
