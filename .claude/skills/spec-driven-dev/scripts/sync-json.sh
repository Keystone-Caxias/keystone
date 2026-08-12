#!/usr/bin/env bash
# sync-json.sh — extrai o JSON embutido em um spec.html ou plan.html editado
# pelo humano (baixado via botão "Salvar" no navegador) e atualiza o JSON
# correspondente na pasta da feature.
#
# Uso:
#   bash sync-json.sh <html-de-entrada> <json-de-saida>
#
# Ex:
#   bash sync-json.sh ~/Downloads/spec-001-login.html .claude/specs/current/001-login/spec.json
#
# Depois disso, rode sync-html.sh para regenerar o HTML "limpo" no lugar certo:
#   bash sync-html.sh 001-login

set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Uso: bash sync-json.sh <html-de-entrada> <json-de-saida>" >&2
  exit 1
fi

INPUT="$1"
OUTPUT="$2"

if [ ! -f "$INPUT" ]; then
  echo "Erro: arquivo HTML de entrada não existe: $INPUT" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Erro: python3 não encontrado no PATH." >&2
  exit 1
fi

python3 - "$INPUT" "$OUTPUT" <<'PYEOF'
import sys, re, json

input_path, output_path = sys.argv[1], sys.argv[2]

with open(input_path, encoding="utf-8") as f:
    html = f.read()

# Procura tanto spec-data quanto plan-data — o tipo é detectado pelo id.
m = re.search(
    r'<script type="application/json" id="(spec|plan)-data">\s*(.+?)\s*</script>',
    html, re.DOTALL
)
if not m:
    print("Erro: bloco JSON não encontrado no HTML.", file=sys.stderr)
    print("Esperava <script type=\"application/json\" id=\"spec-data\"> ou \"plan-data\".", file=sys.stderr)
    sys.exit(1)

kind, raw = m.group(1), m.group(2)

# Desfaz o escape de </script> que o renderizador insere.
raw = raw.replace("<\\/script>", "</script>")

try:
    data = json.loads(raw)
except json.JSONDecodeError as e:
    print(f"Erro: JSON inválido no HTML: {e}", file=sys.stderr)
    sys.exit(1)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✓ JSON extraído ({kind}) → {output_path}")
PYEOF
