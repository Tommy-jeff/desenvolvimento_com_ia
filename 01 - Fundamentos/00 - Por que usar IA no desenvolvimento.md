# Por que usar IA no desenvolvimento

> [!abstract] Pré-requisitos
> Nenhum. Esta é a porta de entrada da trilha ([[00 - Mapa do Curso]]).

## O que é (e por que este módulo existe)

Este não é um módulo técnico — é sobre **mentalidade**. A maior barreira para usar IA bem não é a ferramenta; é a postura de quem a usa. A resistência mais comum (e a que motivou esta trilha) é o medo de **perder o controle** ou de "admitir" que a IA escreve código melhor.

A virada de chave: a IA não substitui seu julgamento, ela **amplia seu alcance**. Você deixa de ser quem digita cada linha e passa a ser quem **decide, direciona e revisa**. O código continua sendo seu — sua responsabilidade, suas decisões de arquitetura, sua revisão. O que muda é a velocidade com que você chega lá.

> [!quote] A reformulação que importa
> "A IA sabe mais do meu código do que eu" → **falso**. A IA tem mais *velocidade de digitação e amplitude de busca*, mas **zero responsabilidade e zero contexto de negócio**. Quem entende o porquê é você. Ela é um executor incansável; você é o engenheiro.

## O novo papel do desenvolvedor

| Antes | Agora |
|---|---|
| Escrevia cada linha | **Especifica e revisa** cada mudança |
| Memorizava APIs | **Sabe avaliar** se o que a IA gerou está correto |
| Produtividade ≈ velocidade de digitar | Produtividade ≈ qualidade das instruções + revisão |
| Conhecimento = sintaxe na cabeça | Conhecimento = **arquitetura, trade-offs e critério** |

O seu valor migra de *"saber escrever"* para *"saber o que pedir, julgar o resultado e ser responsável por ele"*. Isso **aumenta** a importância da senioridade, não diminui.

## Como usar da melhor maneira (princípios)

1. **Você é o piloto, a IA é o copiloto.** Toda saída passa pela sua revisão. Você nunca commita algo que não entende.
2. **Confie, mas verifique.** A IA erra com confiança ("alucina"). Trate cada sugestão como um PR de um colega júnior muito rápido: bom ponto de partida, revisão obrigatória.
3. **Comece pequeno e suba a régua.** Boilerplate e testes primeiro; arquitetura e refactors complexos quando você já confia no fluxo.
4. **Aprenda lendo o que ela gera.** Quando a IA usa um padrão que você não conhece, pare e estude — ela vira também uma ferramenta de aprendizado.
5. **Mantenha o controle onde ele importa:** decisões de design, segurança e regras de negócio. Delegue onde ele não importa: repetição, busca, rascunhos.

## Qual o melhor lugar para usar

✅ **Bom uso desde já:**
- Gerar boilerplate (models, DTOs, `copyWith`, serialização).
- Escrever e completar testes.
- Explicar código legado / código de terceiros.
- Refactors mecânicos e renomeações amplas.
- Rascunhar uma primeira versão para você revisar.

⚠️ **Use com cautela e revisão redobrada:**
- Decisões de arquitetura (use como *segundo cérebro*, não como decisor).
- Código que lida com segurança, pagamento, dados sensíveis.
- Mudanças amplas sem testes que as protejam.

❌ **Não delegue:**
- A responsabilidade final pela correção e pela revisão.
- O entendimento do *porquê* de uma decisão de produto.

## Cenário de exemplo (Flutter / Dart)

Você precisa de um `model` `User` com `fromJson`/`toJson`, `copyWith` e `==`.

- **Postura antiga (tímida):** escreve tudo na mão; ou pede à IA mas cola sem ler.
- **Postura nova (orquestrador):**
  1. Pede: *"Gere a classe `User` (id, name, email, createdAt) imutável, com `fromJson`/`toJson`, `copyWith`, igualdade por valor e testes unitários cobrindo serialização."*
  2. **Lê** o resultado: o `createdAt` foi tratado como `DateTime` com parse ISO? A igualdade cobre todos os campos?
  3. Ajusta o que discorda, roda os testes, commita com consciência.

Resultado: minutos em vez de meia hora, **sem** abrir mão do entendimento.

## Armadilhas comuns

> [!warning] Erros de quem está começando
> - **Aceitar sem ler** ("vibe coding" sem revisão) → dívida técnica invisível.
> - **Pedir demais de uma vez** → resultado genérico e difícil de revisar. Fatie.
> - **Não dar contexto** e culpar a IA pelo resultado ruim (veja [[01 - Como a IA enxerga seu projeto]]).
> - **Achar que usar IA é "trapaça"** → é ferramenta, como foi o autocomplete, o Stack Overflow e o Git no seu tempo.

## Resumo

A IA muda *como* você trabalha, não *o que* você é responsável por entregar. Adotá-la bem é uma decisão de mentalidade: virar orquestrador sem largar o leme.

---
**Próximo passo:** entender, na prática, como a IA "lê" seu projeto → [[01 - Como a IA enxerga seu projeto]]
