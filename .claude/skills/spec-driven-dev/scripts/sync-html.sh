#!/usr/bin/env bash
# sync-html.sh — regenera spec.html e plan.html de uma feature a partir dos
# JSONs em .data/. Use depois que a IA editar .data/spec.json ou .data/plan.json.
#
# Uso: bash sync-html.sh <NNN-slug>
# Ex:  bash sync-html.sh 001-login-via-google
#
# Rode a partir da raiz do repo.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Uso: bash sync-html.sh <NNN-slug>" >&2
  exit 1
fi

FEATURE_ID="$1"

if [ ! -d ".claude/specs" ]; then
  echo "Erro: rode a partir da raiz do repo (esperava .claude/specs/)." >&2
  exit 1
fi

# Procura a feature em current/ ou archive/<dominio>/.
FEATURE_DIR=""
if [ -d ".claude/specs/current/$FEATURE_ID" ]; then
  FEATURE_DIR=".claude/specs/current/$FEATURE_ID"
else
  CANDIDATE=$(find .claude/specs/archive -mindepth 2 -maxdepth 2 -type d -name "$FEATURE_ID" 2>/dev/null | head -1)
  [ -n "$CANDIDATE" ] && FEATURE_DIR="$CANDIDATE"
fi

if [ -z "$FEATURE_DIR" ]; then
  echo "Erro: feature $FEATURE_ID não encontrada em current/ nem archive/." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RENDER="$SCRIPT_DIR/render-doc.py"
[ -f "$RENDER" ] || { echo "Erro: $RENDER não encontrado." >&2; exit 1; }

REGENERATED=()

if [ -f "$FEATURE_DIR/.data/spec.json" ]; then
  python3 "$RENDER" spec "$FEATURE_DIR/.data/spec.json" "$FEATURE_DIR/spec.html"
  REGENERATED+=("spec.html")
fi

if [ -f "$FEATURE_DIR/.data/plan.json" ]; then
  python3 "$RENDER" plan "$FEATURE_DIR/.data/plan.json" "$FEATURE_DIR/plan.html"
  REGENERATED+=("plan.html")
fi

if [ ${#REGENERATED[@]} -eq 0 ]; then
  echo "Aviso: nenhum .data/spec.json ou .data/plan.json em $FEATURE_DIR." >&2
  exit 1
fi

echo "✓ Regenerado em $FEATURE_DIR: ${REGENERATED[*]}"
