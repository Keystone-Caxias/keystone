#!/usr/bin/env bash
# new-feature.sh — cria uma nova feature em .claude/specs/current/<NNN-slug>/
#
# Estrutura criada:
#   .claude/specs/current/<NNN-slug>/
#   ├── spec.html         ← humano abre no Chrome
#   ├── plan.html         ← idem
#   ├── tasks.md          ← markdown puro (IA edita direto)
#   └── .data/            ← fonte da verdade (IA edita aqui; oculto em listagens)
#       ├── spec.json
#       └── plan.json
#
# Uso:
#   bash new-feature.sh <slug>              # sem domínio (define depois)
#   bash new-feature.sh <slug> <dominio>    # com domínio (ex: auth, payments)
#
# Ex:
#   bash new-feature.sh login-via-google auth
#
# Pré-requisitos:
#   - rodar a partir da raiz do repositório (.claude/ existe)
#   - python3 disponível

set -euo pipefail

if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  echo "Uso: bash new-feature.sh <slug> [<dominio>]" >&2
  echo "Ex:  bash new-feature.sh login-via-google auth" >&2
  exit 1
fi

SLUG="$1"
DOMINIO="${2:-}"

if ! [[ "$SLUG" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Erro: slug inválido. Use a-z, 0-9, hífens; comece com letra." >&2
  exit 1
fi

if [ -n "$DOMINIO" ] && ! [[ "$DOMINIO" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Erro: domínio inválido. Use a-z, 0-9, hífens; comece com letra." >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Erro: python3 não encontrado no PATH." >&2
  exit 1
fi

if [ ! -d ".claude/specs" ]; then
  echo "Erro: rode a partir da raiz do repo (esperava .claude/specs/)." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="$SCRIPT_DIR/../templates"
RENDER="$SCRIPT_DIR/render-doc.py"

[ -d "$TEMPLATES_DIR" ] || { echo "Erro: templates não encontrados em $TEMPLATES_DIR" >&2; exit 1; }
[ -f "$RENDER" ] || { echo "Erro: render-doc.py não encontrado em $RENDER" >&2; exit 1; }

mkdir -p .claude/specs/current
mkdir -p .claude/specs/archive

# Próximo NNN, considerando current/ e archive/ (que agora pode ter subpastas
# por domínio, então busca em profundidade).
set +e
HIGHEST=$(
  {
    find .claude/specs/current -maxdepth 1 -mindepth 1 -type d 2>/dev/null
    find .claude/specs/archive -mindepth 1 -type d 2>/dev/null
  } |
  sed 's|.*/||' |
  grep -E '^[0-9]{3}-' |
  sed 's/-.*$//' |
  sort -n |
  tail -1
)
set -e

if [ -z "$HIGHEST" ]; then
  NEXT_NUM="001"
else
  NEXT_NUM=$(printf "%03d" $((10#$HIGHEST + 1)))
fi

FEATURE_ID="${NEXT_NUM}-${SLUG}"
FEATURE_DIR=".claude/specs/current/${FEATURE_ID}"

if [ -d "$FEATURE_DIR" ]; then
  echo "Erro: $FEATURE_DIR já existe." >&2
  exit 1
fi

TODAY=$(date +%Y-%m-%d)
mkdir -p "$FEATURE_DIR/.data"

# Gera os esqueletos JSON e renderiza os HTMLs correspondentes.
FEATURE_ID="$FEATURE_ID" TODAY="$TODAY" FEATURE_DIR="$FEATURE_DIR" \
RENDER="$RENDER" DOMINIO="$DOMINIO" python3 <<'PYEOF'
import os, json, importlib.util

render_path = os.environ["RENDER"]
feature_id  = os.environ["FEATURE_ID"]
today       = os.environ["TODAY"]
feature_dir = os.environ["FEATURE_DIR"]
dominio     = os.environ.get("DOMINIO", "")

spec_mod_spec = importlib.util.spec_from_file_location("render_doc", render_path)
mod = importlib.util.module_from_spec(spec_mod_spec)
spec_mod_spec.loader.exec_module(mod)

spec_data = mod.empty_spec(feature_id, today, dominio=dominio)
plan_data = mod.empty_plan(feature_id, today)

# JSONs em .data/ (fonte da verdade, "escondidos" da listagem padrão).
with open(f"{feature_dir}/.data/spec.json", "w", encoding="utf-8") as f:
    json.dump(spec_data, f, ensure_ascii=False, indent=2)
with open(f"{feature_dir}/.data/plan.json", "w", encoding="utf-8") as f:
    json.dump(plan_data, f, ensure_ascii=False, indent=2)

# HTMLs ficam na raiz da feature, onde o humano abre.
with open(f"{feature_dir}/spec.html", "w", encoding="utf-8") as f:
    f.write(mod.render("spec", spec_data))
with open(f"{feature_dir}/plan.html", "w", encoding="utf-8") as f:
    f.write(mod.render("plan", plan_data))
PYEOF

# tasks.md — copia do template e substitui placeholders.
cp "$TEMPLATES_DIR/tasks.md" "$FEATURE_DIR/tasks.md"
sed -i.bak \
  -e "s|<NNN-slug>|${FEATURE_ID}|g" \
  -e "s|AAAA-MM-DD|${TODAY}|g" \
  "$FEATURE_DIR/tasks.md"
rm "$FEATURE_DIR/tasks.md.bak"

# INBOX e ROADMAP se ainda não existem.
[ -f .claude/specs/INBOX.md ]   || cp "$TEMPLATES_DIR/INBOX.md"   .claude/specs/INBOX.md
[ -f .claude/specs/ROADMAP.md ] || cp "$TEMPLATES_DIR/ROADMAP.md" .claude/specs/ROADMAP.md

echo "✓ Feature criada: $FEATURE_DIR"
echo "  ├── spec.html    (humano abre no Chrome)"
echo "  ├── plan.html    (idem)"
echo "  ├── tasks.md     (IA edita direto)"
echo "  └── .data/"
echo "      ├── spec.json (fonte da verdade da spec)"
echo "      └── plan.json (fonte da verdade do plan)"
echo ""
if [ -z "$DOMINIO" ]; then
  echo "⚠ Domínio não informado. Defina mais tarde editando .data/spec.json"
  echo "  (campo \"dominio\") — determina onde a feature vai em archive/ ao concluir."
  echo ""
fi
echo "Próximos passos (Spec Architect):"
echo "  1. Editar $FEATURE_DIR/.data/spec.json"
echo "  2. Rodar: bash scripts/sync-html.sh $FEATURE_ID  (regenera HTML)"
echo "  3. Abrir $FEATURE_DIR/spec.html no navegador para revisar"
echo "  4. Quando humano editar HTML e baixar nova versão, rodar:"
echo "       bash scripts/sync-json.sh <html-baixado> $FEATURE_DIR/.data/spec.json"
echo "  5. Resolver 'precisa_esclarecer' antes de status virar 'pronto'"
echo "  6. Depois fazer o mesmo ciclo para plan.json/plan.html"
echo "  7. Preencher $FEATURE_DIR/tasks.md (markdown direto)"
