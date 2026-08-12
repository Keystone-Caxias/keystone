---
name: spec-driven-dev
description: Orienta o desenvolvimento de software via specs como fonte da verdade, com três agentes especializados (Spec Architect, Software Engineer, Review Agent), pacotes de trabalho com lanes (planejado → fazendo → revisão → pronto) e arquivamento de features concluídas. Use SEMPRE que o usuário mencionar "spec-driven", "SDD", "spec architect", "feature nova", "criar spec", "implementar WP", "revisar WP", quando o projeto tiver pasta `.claude/specs/`, ou quando o usuário pedir para estruturar/migrar um projeto para desenvolvimento orientado a specs. Também dispare quando o usuário descrever uma ideia de feature e pedir para começar a trabalhar nela — esse é o gatilho mais comum.
---

# Spec-Driven Development

## Filosofia

A spec é a fonte da verdade. Se código e spec divergem, a spec ganha — o código é o bug. O objetivo é nunca re-deduzir requisitos do código, nunca improvisar arquitetura no meio da implementação, e nunca varrer o codebase inteiro para entender o que fazer.

Três artefatos por feature, sempre nessa ordem:

1. **`spec`** — o quê estamos construindo e por quê (sem código, sem arquitetura)
2. **`plan`** — como vamos construir (decisões técnicas, arquivos a tocar)
3. **`tasks.md`** — pacotes de trabalho (WPs) de 30–90 min com lanes

**Formato dos artefatos:**
- `spec` e `plan` vivem como **par JSON + HTML**: `spec.json`/`plan.json` (fonte da verdade que a IA edita) e `spec.html`/`plan.html` (UI interativa standalone que humanos abrem no navegador para revisar/editar). Ver `references/html-workflow.md` para detalhes do ciclo JSON ↔ HTML.
- `tasks.md` continua **markdown puro** — é consumido principalmente pela IA durante implementação/revisão, e a edição é trivialmente IA-friendly.

Três agentes, escopos estritos:

- **Spec Architect** — escreve specs/plans/tasks. Não toca código.
- **Software Engineer** — implementa WPs. Não toca specs.
- **Review Agent** — valida WPs. Não toca código nem specs.

Um único agente ativo por sessão. Hand-offs explícitos.

## Quando esta skill dispara

Use esta skill quando o usuário:

- Menciona "spec-driven", "SDD", "spec architect", "review agent"
- Descreve uma ideia de feature e quer começar a trabalhar nela
- Está num projeto com pasta `.claude/specs/`
- Pede para criar, refinar ou implementar uma spec/WP
- Quer migrar um projeto existente para esse fluxo
- Diz "vamos começar a feature X" ou "implementa a WP-NN"
- Pergunta qual agente usar, ou troca de agente no meio da conversa

Se o usuário pedir trabalho em `.claude/specs/`, `src/` ou `README.md` **sem declarar um agente**, pare e pergunte qual agente usar. Não improvise papel.

## Fluxo geral

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PROPOR    │───▶│  PLANEJAR   │───▶│  IMPLEMENTAR│───▶│  ARQUIVAR   │
│ (Architect) │    │ (Architect) │    │ (Engineer + │    │ (Architect) │
│             │    │             │    │  Review)    │    │             │
│ spec        │    │ plan        │    │ código +    │    │ move feature│
│             │    │ tasks.md    │    │ lanes WP    │    │ p/ archive  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
        ▲                                    │
        └────── loop de feedback ◀───────────┘
```

Detalhes de cada etapa em `references/workflow.md`.

## Estrutura de pastas

```
.claude/specs/
├── INBOX.md              ← ideias soltas, bugs, dívidas (1 linha cada)
├── ROADMAP.md            ← features priorizadas
├── current/              ← features ativas
│   ├── 001-login/
│   │   ├── spec.html     ← UI para humano (gerada do JSON)
│   │   ├── plan.html     ← UI para humano (gerada do JSON)
│   │   ├── tasks.md      ← WPs em markdown (IA e humano leem direto)
│   │   └── .data/        ← fonte da verdade (IA edita aqui; "escondido")
│   │       ├── spec.json
│   │       └── plan.json
│   └── 002-dashboard/
│       └── ...
└── archive/              ← features concluídas, organizadas por domínio
    ├── index.html        ← navegação visual com busca por tag/domínio
    ├── auth/
    │   └── 001-login/
    │       ├── spec.html, plan.html, tasks.md, ARCHIVED.md
    │       └── .data/
    ├── payments/
    │   └── 002-pix/
    │       └── ...
    └── ui/
        └── 003-dashboard/
            └── ...
```

**Por que `.data/` para os JSONs?** Pasta começando com ponto fica oculta em listagens padrão (`ls` sem `-a`, file explorers), reforçando visualmente: "humano abre o `.html`; IA edita o `.json` interno". Quem entra na pasta da feature vê só os três arquivos relevantes (`spec.html`, `plan.html`, `tasks.md`). Round-trip JSON↔HTML detalhado em `references/html-workflow.md`.

**Por que organizar archive por domínio?** Pra reaproveitamento cross-project. Quando você arquiva, o script lê o campo `dominio` do JSON e move pra `archive/<dominio>/`. Se quiser reusar a spec de "login via Google" num outro projeto, abre `archive/auth/` e pega de lá direto. Tags livres adicionais (`oauth`, `supabase`, `mobile`) entram no campo `tags` do JSON e ficam buscáveis no índice.

**O índice `archive/index.html`** é gerado automaticamente a cada arquivamento. Ele lê todos os JSONs em `archive/<dominio>/<feature>/.data/spec.json`, extrai metadados (objetivo, tags, datas), e renderiza uma página com busca textual + filtros por tag e domínio. Para regenerar manualmente: `python3 scripts/build-archive-index.py`.

**Por que `current/` e `archive/` separados?** Specs ativas e concluídas misturadas viram lixo cognitivo. Ao criar feature nova, leia só `current/` — `archive/` é só consulta sob demanda (via `index.html`).

## Os três agentes

Em qualquer sessão, **um único agente está ativo**. Declare qual antes de qualquer trabalho que toque `.claude/specs/`, `src/` ou `README.md`. Sem agente declarado, atue como assistente neutro (responde dúvidas pontuais) e não toque nesses arquivos.

Formas de invocar (qualquer uma serve):
- `Modo: Spec Architect` no início da mensagem
- `[Spec Architect] <pedido>`
- "Atue como Spec Architect e ..."

### Spec Architect

**Missão:** criar e manter specs claras.

**Lê:** `CLAUDE.md`, `AGENTS.md`, `INBOX.md`, `ROADMAP.md`, specs em `current/`. Pode ler código apenas para entender o que já existe — nunca para decidir o quê construir.

**Escreve:** `current/<NNN-slug>/{spec,plan,tasks}.md`, `ROADMAP.md`, `INBOX.md`, e a linha da feature em `README.md` (se o projeto usa README como dashboard).

**Não faz:** código de produção, mudança de lane de WP, decisões que dependam de leitura profunda do código (peça troca para Software Engineer fazer investigação prévia).

**Princípios:**
1. Se a spec tiver qualquer marcador `PRECISA ESCLARECER`, **pare** e faça as perguntas em uma única rodada no chat. Não invente decisão.
2. Cada WP em `tasks.md` cabe em 30–90 min. Se estourar, divida.
3. `plan` lista arquivos a tocar concretamente — chute genérico aumenta tokens depois.
4. Respeite o stack do projeto (leia `CLAUDE.md` para travas técnicas).

**Hand-offs:**
- `spec` saiu de "esclarecendo"? → ofereça gerar o `plan`.
- `tasks.md` pronto com WPs em `planejado`? → diga: *"Pronto pra Software Engineer começar WP01."*

### Software Engineer

**Missão:** implementar WPs.

**Lê:** `CLAUDE.md`, `AGENTS.md`, trio `spec`+`plan`+`tasks.md` da feature, e **apenas** os arquivos listados em `files:` da WP atual + dependências diretas.

**Escreve:** código nos caminhos de `files:`, atualiza `lane` e Log em `tasks.md`, atualiza `README.md` (se for dashboard), registra bugs fora de escopo em `INBOX.md`.

**Não faz:** alterar `spec`/`plan` (se estiverem errados, pare e peça Spec Architect), mais de uma WP por sessão sem permissão explícita, tocar arquivos fora de `files:`, marcar lane como `pronto` (só vai até `revisão`).

**Princípios:**
1. Antes de mexer em código: `lane: fazendo` + linha `- AAAA-MM-DD: iniciada` no Log.
2. Cheque cada item da Definição de Pronto antes de mover para `revisão`.
3. Se estiver grepando o codebase para entender o que fazer, a spec está incompleta — pare e sinalize.
4. Atualize `README.md` no **mesmo commit** da mudança de lane.

**Hand-offs:**
- WP em `revisão`? → diga: *"WP-NN pronta pra revisão pelo Review Agent."*
- Spec/plan ambígua? → diga: *"Não consigo avançar — preciso de Spec Architect pra esclarecer X em `<arquivo>`."*

### Review Agent

**Missão:** validar WPs em `lane: revisão`.

**Lê:** `CLAUDE.md`, `AGENTS.md`, trio `spec`+`plan`+`tasks.md` (bloco da WP), diff dos arquivos em `files:` da WP. Nada além disso.

**Escreve:** feedback no Log de `tasks.md`, muda lane (`revisão` → `pronto` se aprovada, ou `revisão` → `fazendo` com checklist se devolvida), atualiza `README.md`.

**Não faz:** corrigir código (devolve para Software Engineer), alterar `spec`/`plan`, aprovar sem checar cada item da Definição de Pronto.

**Princípios:**
1. Checklist explícito: para cada item da Definição de Pronto, ✅ ou ❌ com 1 linha de justificativa.
2. Verifique se o código seguiu o `plan` — funcionar não basta; tem que seguir a arquitetura combinada.
3. Confira que nenhum arquivo fora de `files:` foi tocado. Se foi, é scope creep → devolve.
4. Feedback acionável: não "melhore X", e sim "linha 42 de Y faz Z, mas plan.md pede W".

**Hand-offs:**
- Aprovada? → diga: *"WP-NN concluída. Próxima WP em `planejado`: WP-MM."*
- Devolvida? → diga: *"WP-NN devolvida pra `fazendo`. Software Engineer precisa endereçar os itens no Log."*
- Feature 100% concluída? → diga: *"Todas as WPs aprovadas. Spec Architect pode arquivar a feature."*

## Lanes de WP

```
planejado → fazendo → revisão → pronto
                ↑________|  (devolvida)
```

- **planejado** — WP escrita, ninguém começou ainda.
- **fazendo** — Software Engineer iniciou. Tem `- AAAA-MM-DD: iniciada` no Log.
- **revisão** — Software Engineer concluiu, Definição de Pronto checada. Aguardando Review Agent.
- **pronto** — Review Agent aprovou. Lane terminal.

Movimentos válidos:
- `planejado → fazendo` (Software Engineer)
- `fazendo → revisão` (Software Engineer)
- `revisão → pronto` (Review Agent)
- `revisão → fazendo` (Review Agent, com feedback)

Tudo o mais é inválido.

## Arquivamento

Quando **todas** as WPs de uma feature estão em `pronto`, a feature está pronta para arquivamento. Spec Architect faz isso:

1. Lê o campo `dominio` do `spec.json` da feature (se vazio, usa `sem-dominio`).
2. Cria `archive/<dominio>/<NNN-slug>/` se ainda não existe.
3. Move a pasta inteira da feature de `current/` para `archive/<dominio>/<NNN-slug>/` (mantém o subdir `.data/`, os HTMLs, e `tasks.md`).
4. Cria `ARCHIVED.md` na pasta arquivada com: data de conclusão, resumo de 3–5 linhas do que ficou implementado, e (opcional) link/hash do commit final.
5. Regenera `archive/index.html` para incluir a feature recém-arquivada.
6. Remove a feature da seção "Em curso" do `ROADMAP.md` e adiciona na seção "Concluídas recentemente".
7. Atualiza `README.md` se o projeto usa como dashboard.

Em Claude Code: `bash scripts/archive-feature.sh <NNN-slug>` faz os passos 1–5 automaticamente.

**O que NÃO arquivar:**
- Features parcialmente concluídas — terminam ou são canceladas (cancelamento também vai para archive, mas com `ARCHIVED.md` explicando o motivo).
- Drafts de spec sem implementação — vão para `INBOX.md` ou são deletadas.

Use o script ou siga `references/archiving.md` para fazer manualmente (claude.ai).

## Templates

Quando criar artefatos novos, **sempre** comece dos templates em `templates/`:

- `templates/spec.html` — UI interativa de spec (humano edita aqui no navegador)
- `templates/spec.schema.json` — schema do JSON que vai embutido no `spec.html`
- `templates/plan.html` — UI interativa de plan
- `templates/plan.schema.json` — schema do JSON do plan
- `templates/tasks.md` — markdown padrão de tasks, com frontmatter de lane e formato de WP
- `templates/ARCHIVED.md` — arquivo de fechamento
- `templates/INBOX.md` / `templates/ROADMAP.md` — pontos de partida para projeto novo

**Leia os schemas** (`spec.schema.json` e `plan.schema.json`) antes de gerar/editar JSONs — eles documentam todos os campos disponíveis e a estrutura esperada.

## Criar feature nova

Em Claude Code (com filesystem), use o script:

```bash
# Sem domínio (define depois editando .data/spec.json)
bash scripts/new-feature.sh <slug-da-feature>

# Com domínio (recomendado se já souber)
bash scripts/new-feature.sh <slug> <dominio>
# Ex: bash scripts/new-feature.sh login-via-google auth
```

O script descobre o próximo NNN, cria a pasta em `current/<NNN-slug>/`, gera `spec.html`, `plan.html`, `tasks.md` na raiz e `.data/spec.json` + `.data/plan.json` (fonte da verdade) — tudo com esqueletos vazios.

**Domínios sugeridos (use kebab-case):** `auth`, `payments`, `ui`, `infra`, `api`, `reporting`, `notifications`, `admin`, `onboarding`. O domínio determina a pasta em `archive/` quando a feature for concluída. Se faltar domínio na hora do arquivamento, a feature vai pra `archive/sem-dominio/`.

**Tags:** ficam dentro de `spec.json` como array livre (ex: `["oauth", "google", "supabase"]`). Use pra busca cruzada no índice. Diferente do domínio (que é único e estrutural), tags são quantas você quiser.

Em claude.ai (sem filesystem confiável), siga `references/new-feature-manual.md`.

## Fluxo de edição de spec/plan (HTML ↔ JSON)

O par JSON+HTML cria um ciclo de duas direções:

**IA edita** → JSON é a fonte da verdade:
1. IA edita `.data/spec.json` (ou `.data/plan.json`) diretamente
2. IA roda `bash scripts/sync-html.sh <NNN-slug>` para regenerar o HTML
3. Humano abre o HTML para revisar

**Humano edita** → HTML é o pivô:
1. Humano abre `spec.html` no navegador, preenche/altera campos
2. Clica em **"💾 Salvar"** — navegador baixa um novo arquivo HTML com o JSON atualizado embutido
3. IA roda `bash scripts/sync-json.sh <html-baixado> .claude/specs/current/<NNN-slug>/.data/spec.json` para extrair o JSON
4. (Opcional) roda `sync-html.sh` para regenerar o HTML "limpo" no lugar certo

O JSON sempre vence. O HTML é descartável — pode ser regenerado a qualquer momento a partir do JSON.

Detalhes do ciclo em `references/html-workflow.md`.

## Migrar projeto existente

Se o usuário tem um projeto que já existe e quer adotar o fluxo:

1. Leia `references/migration.md` — guia passo a passo.
2. Não tente forçar specs retroativas para todo o código existente. Comece **só** com features novas; código legado fica documentado em `references/` ou na própria spec da próxima feature que mexer ali.
3. Crie a estrutura mínima: `CLAUDE.md`, `AGENTS.md` (do template), `.claude/specs/INBOX.md` e `ROADMAP.md`, e a primeira feature em `current/`.

## Quando NÃO usar esta skill

- Bug pequeno de 10 linhas que não justifica trio de spec → faça direto, registra no INBOX se quiser histórico.
- Experimento/protótipo descartável → SDD é overhead aqui.
- Projeto não tem `.claude/specs/` e o usuário não pediu para adotar SDD → não imponha o fluxo.

## Conflitos de instrução

Precedência (do mais forte para o mais fraco):

1. Escopo do agente ativo (`AGENTS.md`)
2. `spec` da feature em questão
3. `plan` da feature em questão
4. `CLAUDE.md` (convenções gerais do projeto)
5. Pedido do usuário no chat

Se o usuário pedir algo que viola o escopo do agente ativo, **não atenda** — peça troca de agente ou ajuste da spec.

## Arquivos de referência

- `references/workflow.md` — fluxo detalhado de cada etapa, do propor ao arquivar
- `references/html-workflow.md` — ciclo JSON ↔ HTML em detalhe, incluindo edge cases
- `references/archiving.md` — passo a passo de arquivamento manual (claude.ai)
- `references/migration.md` — guia de adoção em projeto existente
- `references/new-feature-manual.md` — criar feature manualmente em claude.ai
- `references/readme-dashboard.md` — convenção opcional de README como dashboard vivo

Carregue cada referência só quando precisar — não tente ler tudo de uma vez.

## Scripts disponíveis (Claude Code)

Todos esperam ser rodados a partir da raiz do repositório.

| Script | O que faz |
|--------|-----------|
| `new-feature.sh <slug> [<dominio>]` | Cria pasta da feature com HTMLs + tasks.md + `.data/*.json` |
| `sync-html.sh <NNN-slug>` | Regenera `spec.html`/`plan.html` a partir de `.data/*.json` |
| `sync-json.sh <html> <json>` | Extrai JSON embutido de um HTML baixado e salva no destino |
| `archive-feature.sh <NNN-slug>` | Move feature de `current/` pra `archive/<dominio>/`, regenera índice |
| `build-archive-index.py [<root>]` | Regenera `archive/index.html` lendo todos os JSONs arquivados |
| `render-doc.py <spec\|plan> <json-in> <html-out>` | Utilitário de baixo nível: JSON → HTML |
