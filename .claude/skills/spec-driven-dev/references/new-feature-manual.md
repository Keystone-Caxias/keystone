# Criar feature manualmente (claude.ai)

Use este guia quando estiver em claude.ai sem terminal confiável, ou quando preferir fazer manualmente em vez de rodar o script.

## Pré-requisitos

- O projeto tem `.claude/specs/current/` e `.claude/specs/archive/` (se não, ver `migration.md`).
- Você está em modo **Spec Architect**.

## Passos

### 1. Descobrir o próximo NNN

Liste o que existe em `current/` e em `archive/<dominio>/`:

- Pegue todos os nomes de pasta com formato `NNN-slug` (onde NNN são 3 dígitos), em qualquer profundidade dentro de `archive/`.
- O próximo é o maior NNN + 1, com zero-padding (`007`, `042`, `108`).

Se não há nenhuma feature ainda → comece em `001`.

### 2. Validar o slug e definir o domínio

Slug:
- Apenas `a-z`, `0-9`, e hífens
- Começar com letra
- Curto e descritivo (`login-google`, não `implementacao-do-novo-sistema-de-login-com-google-oauth-2`)

Domínio (ver lista em `archiving.md`): defina já ou deixe pra resolver durante o preenchimento. Determina onde a feature vai parar em `archive/` no fim.

### 3. Criar a estrutura de pastas

```
.claude/specs/current/<NNN>-<slug>/
├── (vazio por enquanto)
└── .data/
```

Exemplo: `.claude/specs/current/001-login-via-google/.data/`

### 4. Criar os JSONs vazios em `.data/`

Esqueleto mínimo de `spec.json`:

```json
{
  "feature_id": "001-login-via-google",
  "status": "esclarecendo",
  "criada_em": "2026-05-20",
  "autor": "",
  "dominio": "auth",
  "tags": [],
  "objetivo": "",
  "motivacao": "",
  "escopo": { "inclui": [], "nao_inclui": [] },
  "criterios_aceitacao": [],
  "cenarios": { "feliz": "", "alternativos": [] },
  "restricoes": [],
  "dependencias": [],
  "precisa_esclarecer": [],
  "fora_escopo": []
}
```

Esqueleto mínimo de `plan.json`:

```json
{
  "feature_id": "001-login-via-google",
  "status": "rascunho",
  "baseado_em_spec_de": "2026-05-20",
  "abordagem": "",
  "decisoes_tecnicas": [],
  "arquivos": { "criados": [], "modificados": [], "nao_tocados": [] },
  "estrutura_dados": "",
  "fluxo_principal": "",
  "consideracoes": { "performance": "", "acessibilidade": "", "seguranca": "", "i18n": "" },
  "testes": "",
  "riscos": [],
  "rollout": "",
  "fora_escopo_tecnico": []
}
```

### 5. Gerar os HTMLs

**Caso A — tem Python disponível:**
Rode `python3 scripts/render-doc.py spec .data/spec.json spec.html` (na pasta da feature) e idem para plan.

**Caso B — sem Python e sem terminal:**
Copie `templates/spec.html` para a pasta da feature (na raiz, não em `.data/`). Substitua manualmente:
- `{{FEATURE_ID}}` → o ID da feature (ex: `001-login-via-google`)
- `{{SPEC_JSON}}` → o conteúdo do JSON acima, indentado bonito

Idem para `plan.html`.

É chato. Em claude.ai sem Python, prefira pedir pro humano rodar `bash scripts/new-feature.sh <slug> <dominio>` localmente.

### 6. Criar `tasks.md` na raiz da feature

Copiar `templates/tasks.md` para a pasta da feature (na raiz, ao lado dos HTMLs). Substituir:
- `<NNN-slug>` → `001-login-via-google`
- `AAAA-MM-DD` → data de hoje

### 7. Criar `INBOX.md` e `ROADMAP.md` se não existirem

Se for a primeira feature do projeto, copie:
- `templates/INBOX.md` → `.claude/specs/INBOX.md`
- `templates/ROADMAP.md` → `.claude/specs/ROADMAP.md`

### 8. Adicionar linha no ROADMAP

Em `.claude/specs/ROADMAP.md`, seção "Em curso", adicionar:

```markdown
| 001 | <nome> | <dominio> | 🟡 | 0/0 | `current/001-<slug>/` |
```

### 9. Confirmar com o usuário

Mostre ao usuário a pasta criada. Estrutura final:

```
.claude/specs/current/001-login-via-google/
├── spec.html
├── plan.html
├── tasks.md
└── .data/
    ├── spec.json
    └── plan.json
```

Pergunte se está OK e em seguida puxe o briefing da feature para começar a preencher o `spec.json` (e regenerar o `spec.html` depois).
