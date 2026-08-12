#!/usr/bin/env bash
# archive-feature.sh — move uma feature concluída de current/ para
# archive/<dominio>/<NNN-slug>/, lê o domínio do próprio JSON da spec.
#
# Uso: bash archive-feature.sh <NNN-slug>
# Ex:  bash archive-feature.sh 001-login-via-google
#
# Rode a partir da raiz do repo. Depois de mover, regenera archive/index.html.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Uso: bash archive-feature.sh <NNN-slug>" >&2
  exit 1
fi

FEATURE_ID="$1"

if [ ! -d ".claude/specs/current/$FEATURE_ID" ]; then
  echo "Erro: .claude/specs/current/$FEATURE_ID não existe." >&2
  echo "Features ativas:" >&2
  ls .claude/specs/current/ 2>/dev/null | sed 's/^/  /' >&2 || echo "  (nenhuma)" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Lê o domínio do spec.json. Se não tiver, usa 'sem-dominio'.
SPEC_JSON=".claude/specs/current/$FEATURE_ID/.data/spec.json"
if [ ! -f "$SPEC_JSON" ]; then
  echo "Erro: $SPEC_JSON não existe — não consigo determinar o domínio." >&2
  exit 1
fi

DOMINIO=$(python3 -c "
import json, sys
with open('$SPEC_JSON') as f:
    data = json.load(f)
print((data.get('dominio') or 'sem-dominio').strip().lower() or 'sem-dominio')
")

# Validação básica de WPs prontas (mesmo padrão da v anterior).
TASKS_FILE=".claude/specs/current/$FEATURE_ID/tasks.md"
if [ -f "$TASKS_FILE" ]; then
  set +e
  PENDING=$(grep -E '^lane:' "$TASKS_FILE" | grep -v 'pronto' | wc -l | tr -d ' ')
  set -e
  if [ "$PENDING" -gt 0 ]; then
    echo "Atenção: $PENDING WP(s) ainda não estão em 'pronto'." >&2
    grep -nE '^lane:' "$TASKS_FILE" | grep -v 'pronto' | sed 's/^/  /' >&2
    read -r -p "Arquivar mesmo assim? Digite 'sim' para continuar: " CONFIRM
    if [ "$CONFIRM" != "sim" ]; then
      echo "Cancelado." >&2
      exit 1
    fi
  fi
fi

# Move.
TARGET_DIR=".claude/specs/archive/$DOMINIO"
mkdir -p "$TARGET_DIR"

if [ -d "$TARGET_DIR/$FEATURE_ID" ]; then
  echo "Erro: $TARGET_DIR/$FEATURE_ID já existe." >&2
  exit 1
fi

mv ".claude/specs/current/$FEATURE_ID" "$TARGET_DIR/$FEATURE_ID"

# Esqueleto do ARCHIVED.md.
TEMPLATE="$SCRIPT_DIR/../templates/ARCHIVED.md"
TODAY=$(date +%Y-%m-%d)

if [ -f "$TEMPLATE" ]; then
  cp "$TEMPLATE" "$TARGET_DIR/$FEATURE_ID/ARCHIVED.md"
  sed -i.bak \
    -e "s|<NNN-slug>|${FEATURE_ID}|g" \
    -e "s|AAAA-MM-DD|${TODAY}|g" \
    -e "s|<ex: auth>|${DOMINIO}|g" \
    "$TARGET_DIR/$FEATURE_ID/ARCHIVED.md"
  rm "$TARGET_DIR/$FEATURE_ID/ARCHIVED.md.bak"
fi

echo "✓ Feature movida: .claude/specs/current/$FEATURE_ID → $TARGET_DIR/$FEATURE_ID"
echo "✓ Domínio: $DOMINIO"
echo "✓ Esqueleto: $TARGET_DIR/$FEATURE_ID/ARCHIVED.md"
echo ""

# Regenera o índice do archive.
INDEX_SCRIPT="$SCRIPT_DIR/build-archive-index.py"
if [ -f "$INDEX_SCRIPT" ]; then
  python3 "$INDEX_SCRIPT"
  echo "✓ Índice regenerado: .claude/specs/archive/index.html"
else
  echo "(aviso: build-archive-index.py não encontrado; índice não regenerado)"
fi

echo ""
echo "Próximos passos (Spec Architect):"
echo "  1. Preencher $TARGET_DIR/$FEATURE_ID/ARCHIVED.md (resumo, commits, desvios)"
echo "  2. Remover a feature da seção 'Em curso' de .claude/specs/ROADMAP.md"
echo "  3. Adicionar linha em 'Concluídas recentemente' do ROADMAP"
echo "  4. Se o projeto usa README como dashboard, atualizar lá também"
