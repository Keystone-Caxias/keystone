# Arquivamento manual (claude.ai)

Use este guia quando estiver em claude.ai (sem terminal confiável) ou quando preferir fazer manualmente.

## Pré-condição

- Todas as WPs da feature em `lane: pronto` (confira em `tasks.md`).
- Campo `dominio` preenchido em `.data/spec.json`. Se vazio, defina antes de arquivar — ele determina a pasta de destino.

Se houver WPs em outras lanes, **não arquive**. Termine ou cancele explicitamente. Cancelamento também vai para archive, mas com motivo registrado no `ARCHIVED.md`.

## Passos

### 1. Confirmar o domínio

Abra `.data/spec.json` e veja o campo `dominio`. Valores comuns:

- `auth` — login, sessão, permissões, 2FA
- `payments` — checkout, faturamento, integração de gateways
- `ui` — telas, componentes, design system, navegação
- `infra` — CI/CD, deploy, observabilidade, secrets
- `api` — endpoints REST/GraphQL, contratos
- `reporting` — dashboards, exports, BI
- `notifications` — email, push, SMS, in-app
- `admin` — back-office, ferramentas internas
- `onboarding` — fluxo de novo usuário

Não force a categoria. Se nenhuma encaixar, invente uma palavra única em kebab-case (`ml`, `search`, `messaging`, `import-export`...). Domínios não usam acentos nem espaços.

### 2. Criar (se necessário) a pasta de domínio

`.claude/specs/archive/<dominio>/` — crie se ainda não existir.

### 3. Mover a feature

Mover toda a pasta `.claude/specs/current/<NNN-slug>/` para `.claude/specs/archive/<dominio>/<NNN-slug>/`.

Importante: mova tudo, **incluindo a `.data/`** que contém os JSONs. A pasta antiga em `current/` deve sumir.

### 4. Criar `ARCHIVED.md` na pasta arquivada

Copiar `templates/ARCHIVED.md` e preencher:

- **Arquivada em** — data de hoje
- **Status final** — `concluída` ou `cancelada`
- **Domínio** — o mesmo do JSON
- **Resumo do que ficou** — 3–5 linhas no passado, sobre o resultado observável
- **WPs concluídas** — listar com data (puxa do Log de `tasks.md`)
- **Commits / PRs relevantes** — se houver
- **Desvios da spec original** — se a implementação divergiu, registre aqui. A spec original **não muda** — esta seção explica o delta.

### 5. Regenerar o índice

`archive/index.html` precisa ser regenerado para incluir a nova feature.

- Em Claude Code: `python3 scripts/build-archive-index.py`
- Em claude.ai: o script Python lê os JSONs de todas as features e produz um HTML. Se você não consegue executá-lo, pode pedir pro humano rodar localmente, ou viver sem o índice atualizado até o próximo `archive-feature.sh`.

### 6. Atualizar `ROADMAP.md`

- Remover a linha da feature da seção "Em curso".
- Adicionar linha em "Concluídas recentemente" com data e domínio.
- Manter no máximo 5 itens em "Concluídas recentemente". Histórico vai pra `archive/index.html`.

### 7. Atualizar `README.md` (se for dashboard)

Ver `readme-dashboard.md`.

### 8. Comunicar

> *"Feature `<NNN-slug>` arquivada em `archive/<dominio>/`. Índice atualizado. Próxima feature no roadmap: `<próxima>`."*

## O que NÃO fazer durante o arquivamento

- **Não edite `spec.json`/`plan.json`/`.html`** — eles ficam congelados como artefato histórico. Desvios vão para `ARCHIVED.md`.
- **Não delete nada.** Cancelamento mantém os arquivos, com motivo no `ARCHIVED.md`.
- **Não consolide múltiplas features num único `ARCHIVED.md`.** Cada feature tem o seu.
- **Não mude o `dominio` na hora de arquivar.** Se o domínio estava errado, ajuste **antes** e regenere o HTML — depois arquive. Mudar no momento bagunça o índice.
