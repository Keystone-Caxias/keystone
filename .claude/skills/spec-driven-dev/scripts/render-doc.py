#!/usr/bin/env python3
"""
render-doc.py — gera spec.html ou plan.html a partir de um JSON.

Uso:
    python3 render-doc.py spec  <caminho-do-json>  <caminho-de-saida-html>
    python3 render-doc.py plan  <caminho-do-json>  <caminho-de-saida-html>

Ou stdin/stdout (sem args de arquivo): lê JSON do stdin, escreve HTML no stdout.

Quando a IA precisa criar/atualizar uma spec ou plan, ela:
  1. Produz o JSON com a estrutura conforme spec.schema.json / plan.schema.json
  2. Roda este script para embutir o JSON no template HTML correspondente
  3. Salva o HTML no caminho da feature

O template HTML vive ao lado deste script em ../templates/{spec,plan}.html.
"""
import json
import sys
import os
from pathlib import Path


HERE = Path(__file__).resolve().parent
TEMPLATES_DIR = HERE.parent / "templates"


def render(kind: str, data: dict) -> str:
    """Substitui os placeholders {{FEATURE_ID}} e {{SPEC_JSON}}/{{PLAN_JSON}}
    no template do tipo especificado e retorna o HTML completo."""
    if kind not in {"spec", "plan"}:
        raise ValueError(f"kind deve ser 'spec' ou 'plan', recebido: {kind}")

    template_path = TEMPLATES_DIR / f"{kind}.html"
    if not template_path.exists():
        raise FileNotFoundError(f"Template não encontrado: {template_path}")

    template = template_path.read_text(encoding="utf-8")

    feature_id = data.get("feature_id", "sem-id")
    json_placeholder = "{{SPEC_JSON}}" if kind == "spec" else "{{PLAN_JSON}}"

    # ensure_ascii=False mantém acentos legíveis dentro do <script>.
    # O JSON vai dentro de um <script type="application/json">, que NÃO é
    # parseado como JavaScript — então não precisamos escapar </script>
    # dentro de strings, mas por segurança neutralizamos a sequência caso
    # ela apareça em algum texto do usuário.
    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    json_str = json_str.replace("</script>", "<\\/script>")

    return (
        template
        .replace("{{FEATURE_ID}}", feature_id)
        .replace(json_placeholder, json_str)
    )


def empty_spec(feature_id: str, today: str, dominio: str = "", tags: list = None) -> dict:
    """Retorna um esqueleto vazio de spec, com os campos esperados."""
    return {
        "feature_id": feature_id,
        "status": "esclarecendo",
        "criada_em": today,
        "autor": "",
        "dominio": dominio,
        "tags": tags or [],
        "objetivo": "",
        "motivacao": "",
        "escopo": {"inclui": [], "nao_inclui": []},
        "criterios_aceitacao": [],
        "cenarios": {"feliz": "", "alternativos": []},
        "restricoes": [],
        "dependencias": [],
        "precisa_esclarecer": [],
        "fora_escopo": [],
    }


def empty_plan(feature_id: str, today: str) -> dict:
    """Retorna um esqueleto vazio de plan."""
    return {
        "feature_id": feature_id,
        "status": "rascunho",
        "baseado_em_spec_de": today,
        "abordagem": "",
        "decisoes_tecnicas": [],
        "arquivos": {"criados": [], "modificados": [], "nao_tocados": []},
        "estrutura_dados": "",
        "fluxo_principal": "",
        "consideracoes": {
            "performance": "",
            "acessibilidade": "",
            "seguranca": "",
            "i18n": "",
        },
        "testes": "",
        "riscos": [],
        "rollout": "",
        "fora_escopo_tecnico": [],
    }


def main():
    args = sys.argv[1:]

    if not args or args[0] in {"-h", "--help"}:
        print(__doc__, file=sys.stderr)
        sys.exit(0)

    kind = args[0]

    if kind not in {"spec", "plan"}:
        print(f"Erro: tipo deve ser 'spec' ou 'plan'. Recebido: {kind}", file=sys.stderr)
        sys.exit(1)

    # Modo stdin/stdout: nenhum arquivo, lê JSON do stdin
    if len(args) == 1:
        data = json.load(sys.stdin)
        sys.stdout.write(render(kind, data))
        return

    # Modo arquivos
    if len(args) != 3:
        print("Uso: render-doc.py <spec|plan> <input.json> <output.html>", file=sys.stderr)
        sys.exit(1)

    input_path = Path(args[1])
    output_path = Path(args[2])

    with input_path.open(encoding="utf-8") as f:
        data = json.load(f)

    html = render(kind, data)
    output_path.write_text(html, encoding="utf-8")
    print(f"✓ {output_path}")


if __name__ == "__main__":
    main()
