# Migração: adotar SDD em projeto existente

Você tem um projeto que já existe — código rodando, talvez sem documentação consistente — e quer adotar este fluxo. Aqui está o caminho mínimo, sem tentar fazer engenharia reversa de tudo.

## Princípio

**Não force specs retroativas.** O código existente fica como está. O SDD se aplica daqui pra frente, para features **novas**. Código legado só ganha spec quando uma feature nova mexer ali.

Esse princípio evita o trabalho infinito de documentar tudo o que já existe e libera adoção imediata.

## Passo a passo

### 1. Criar a estrutura mínima

Na raiz do repo:

```
.claude/
└── specs/
    ├── INBOX.md
    ├── ROADMAP.md
    ├── current/
    └── archive/
```

Copie os templates `INBOX.md` e `ROADMAP.md` da skill (ou rode `scripts/new-feature.sh` com uma feature qualquer, que isso cria os dois automaticamente).

### 2. Criar `CLAUDE.md` na raiz

Esse arquivo é o **manual do projeto** para qualquer agente — humano ou IA. Deve responder:

- **O quê é o projeto** (1 parágrafo)
- **Stack técnico** (linguagens, frameworks, banco, infra principal)
- **Convenções importantes** (formatação de moeda, idioma da UI, padrões de nomenclatura, regras inegociáveis)
- **Comandos úteis** (rodar dev, rodar testes, build)
- **Onde estão as specs** (apontar para `.claude/specs/`)
- **Regras de fluxo de trabalho** (ex: "nunca faça commit", "atualize README a cada lane")

Quanto mais específico, melhor. Trava de stack ("React + Supabase REST, sem SDK") economiza muita briga depois.

### 3. Criar `AGENTS.md` na raiz

Define os três agentes — Spec Architect, Software Engineer, Review Agent — com escopos estritos. Use o template embutido no `SKILL.md` desta skill como base. Customize se quiser:

- Adicionar agentes específicos do seu projeto (ex: "Database Migrator")
- Restringir mais o escopo de leitura/escrita
- Adicionar princípios técnicos do projeto

### 4. Decidir sobre o `README.md` como dashboard

Opcional, mas útil. Ver `readme-dashboard.md`. Se adotar, o `README.md` vira parte do fluxo — toda mudança de lane atualiza ele também.

Se o projeto já tem um README de divulgação (para usuários externos), considere usar `STATUS.md` ou similar para o dashboard interno.

### 5. Listar features pendentes no `ROADMAP.md`

Pegue a lista de coisas que você sabe que quer fazer e priorize. **Não escreva specs ainda** — só liste. As specs vão sendo escritas conforme cada feature é priorizada.

Status inicial:
- 🔵 backlog para as que estão no roadmap mas sem spec
- 🟡 em andamento se já tem algo sendo feito (raro nesse momento, mas possível)

### 6. Listar dívidas e bugs conhecidos no `INBOX.md`

Linhas curtas, formato `AAAA-MM-DD <tipo>: <descrição>`. Inclua coisas que você sabe que precisam ser feitas mas não viraram feature ainda.

Não vire wiki — uma linha por item. Quando algo for grande o suficiente para virar feature, move para `ROADMAP.md` e depois para `current/`.

### 7. Começar pela primeira feature nova

Use `scripts/new-feature.sh <slug>` (Claude Code) ou crie manualmente (claude.ai). Trate como Spec Architect e siga o fluxo normal.

A primeira feature serve também para validar a estrutura — você vai descobrir o que está faltando no `CLAUDE.md` e ajustar.

## O que NÃO fazer na migração

- **Não escreva specs retroativas para código existente.** É trabalho infinito e tem retorno baixo.
- **Não migre tudo de uma vez.** Comece com `CLAUDE.md`, `AGENTS.md` e a primeira feature. Adicione resto conforme precisar.
- **Não force agentes em pedidos triviais.** Se o usuário pede um one-liner ou uma dúvida pontual, responda como assistente neutro. SDD é para features, não para tudo.
- **Não importe specs de outros projetos sem revisar.** Cada projeto tem suas travas técnicas.

## Sinais de que a migração está dando certo

- Antes de codar uma feature nova, você consulta `spec`.
- Bugs descobertos no meio de uma WP vão para `INBOX.md` sem desviar o foco.
- O Review Agent devolve WPs para `fazendo` quando precisa — e isso não é visto como falha.
- O `README.md` (ou dashboard equivalente) reflete a realidade. Se está desatualizado, está sinalizando que o fluxo quebrou em algum ponto.

## Sinais de que algo está errado

- Você está editando código sem ter spec/plan/tasks aberto → você virou "Software Engineer freestyle". Pare e crie a spec.
- O Software Engineer está mudando `spec` → escopo cruzado. Pare e troque para Spec Architect.
- WPs estão estourando 90min com frequência → quebra muito grande. Spec Architect precisa dividir melhor.
- Está difícil decidir o que vai em `files:` da WP → o plan.md provavelmente está vago. Volte e detalhe.
