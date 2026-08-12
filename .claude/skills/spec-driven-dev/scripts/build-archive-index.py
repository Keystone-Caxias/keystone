#!/usr/bin/env python3
"""
build-archive-index.py — gera .claude/specs/archive/index.html agregando
metadados de todas as features arquivadas.

Lê cada archive/<dominio>/<NNN-slug>/.data/spec.json e produz uma página
única com filtro por tag, domínio e busca textual.

Uso:
    python3 build-archive-index.py                # roda no .claude/specs/ atual
    python3 build-archive-index.py <root>         # roda em outro caminho
"""
import json
import sys
import html
from pathlib import Path


def find_archive_root(start: Path) -> Path:
    """Encontra .claude/specs/archive a partir do diretório dado ou da raiz."""
    candidates = [
        start / ".claude" / "specs" / "archive",
        start / "specs" / "archive",
        start,
    ]
    for c in candidates:
        if c.is_dir():
            return c
    raise FileNotFoundError(
        f"Não encontrei pasta archive em {start}. Rode da raiz do repo."
    )


def collect_features(archive_root: Path) -> list[dict]:
    """Varre archive/<dominio>/<NNN-slug>/ e coleta metadados de cada feature."""
    features = []
    if not archive_root.exists():
        return features

    for dominio_dir in sorted(archive_root.iterdir()):
        if not dominio_dir.is_dir() or dominio_dir.name.startswith("."):
            continue
        dominio = dominio_dir.name

        for feature_dir in sorted(dominio_dir.iterdir()):
            if not feature_dir.is_dir():
                continue

            spec_json = feature_dir / ".data" / "spec.json"
            if not spec_json.exists():
                # Pode estar no formato antigo (sem .data/). Tenta o legado.
                legacy = feature_dir / "spec.json"
                if legacy.exists():
                    spec_json = legacy
                else:
                    continue

            try:
                with spec_json.open(encoding="utf-8") as f:
                    spec = json.load(f)
            except (json.JSONDecodeError, OSError):
                continue

            archived_md = feature_dir / "ARCHIVED.md"
            archived_em = ""
            resumo = ""
            if archived_md.exists():
                content = archived_md.read_text(encoding="utf-8")
                # Tenta extrair "Arquivada em: AAAA-MM-DD" e o resumo.
                for line in content.splitlines():
                    if "Arquivada em:" in line:
                        archived_em = line.split("Arquivada em:")[-1].strip().strip("*").strip("`").strip()
                        break
                # Resumo: o que vier depois de "## Resumo do que ficou" até a próxima seção.
                if "## Resumo" in content:
                    chunk = content.split("## Resumo", 1)[1]
                    chunk = chunk.split("##", 1)[0]  # corta na próxima seção
                    # Remove o título "do que ficou" e linhas só de marcadores.
                    lines = [
                        ln.strip() for ln in chunk.splitlines()
                        if ln.strip() and not ln.strip().startswith("<")
                    ]
                    # Pula a primeira linha se for o resto do título
                    if lines and "do que ficou" in lines[0].lower():
                        lines = lines[1:]
                    resumo = " ".join(lines[:3])  # primeiras linhas úteis

            features.append({
                "feature_id": spec.get("feature_id", feature_dir.name),
                "dominio": dominio,
                "tags": spec.get("tags", []) or [],
                "objetivo": spec.get("objetivo", "") or "",
                "motivacao": spec.get("motivacao", "") or "",
                "criada_em": spec.get("criada_em", ""),
                "arquivada_em": archived_em,
                "resumo": resumo,
                "autor": spec.get("autor", "") or "",
                # Caminho relativo a archive/ — útil para o link.
                "caminho": str(feature_dir.relative_to(archive_root)).replace("\\", "/"),
            })

    return features


def render_html(features: list[dict]) -> str:
    """Renderiza index.html com filtros interativos."""
    # Domínios e tags únicos, para os filtros.
    dominios = sorted({f["dominio"] for f in features})
    tags = sorted({t for f in features for t in f["tags"]})

    # Embutimos os dados como JSON para o JS filtrar sem reload.
    payload = json.dumps(features, ensure_ascii=False, indent=2)
    payload = payload.replace("</script>", "<\\/script>")

    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Archive de Specs</title>
<style>
  :root {{
    --bg: #0f1115;
    --bg-elev: #171a21;
    --bg-input: #1f232c;
    --border: #2a2f3a;
    --border-strong: #3a4150;
    --text: #e6e8ec;
    --text-dim: #9aa3b2;
    --accent: #7aa2f7;
    --accent-soft: rgba(122, 162, 247, 0.12);
    --ok: #9ece6a;
    --warn: #e0af68;
    --radius: 6px;
    --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: var(--sans); background: var(--bg); color: var(--text);
    margin: 0; padding: 32px 20px 60px; line-height: 1.5;
  }}
  .container {{ max-width: 1040px; margin: 0 auto; }}

  header {{ margin-bottom: 24px; }}
  h1 {{ font-size: 24px; font-weight: 600; margin: 0 0 4px; letter-spacing: -0.01em; }}
  .subtitle {{ color: var(--text-dim); font-size: 14px; }}
  .count {{ color: var(--accent); font-family: var(--mono); }}

  .filters {{
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 20px;
  }}
  .filter-row {{ display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 12px; }}
  .filter-row:last-child {{ margin-bottom: 0; }}
  .filter-row label {{ font-size: 12px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.04em; }}

  input[type="text"], select {{
    background: var(--bg-input);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 7px 10px;
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
  }}
  input[type="text"]:focus, select:focus {{
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-soft);
  }}
  #search {{ flex: 1; min-width: 200px; }}

  .chip {{
    display: inline-block;
    background: var(--bg-input);
    border: 1px solid var(--border);
    color: var(--text-dim);
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    margin: 2px 4px 2px 0;
  }}
  .chip:hover {{ border-color: var(--accent); color: var(--accent); }}
  .chip.active {{
    background: var(--accent-soft);
    border-color: var(--accent);
    color: var(--accent);
  }}

  .feature-card {{
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    margin-bottom: 12px;
    transition: border-color 0.1s;
  }}
  .feature-card:hover {{ border-color: var(--border-strong); }}
  .card-header {{
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }}
  .card-id {{
    font-family: var(--mono);
    color: var(--text-dim);
    font-size: 13px;
  }}
  .card-title {{
    font-size: 15px;
    font-weight: 500;
    flex: 1;
  }}
  .card-dominio {{
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 500;
  }}
  .card-date {{
    color: var(--text-dim);
    font-size: 12px;
    font-family: var(--mono);
  }}
  .card-summary {{
    color: var(--text-dim);
    font-size: 14px;
    margin-bottom: 10px;
  }}
  .card-tags {{ display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }}
  .card-tag {{
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-dim);
    padding: 1px 8px;
    border-radius: 3px;
    font-size: 11px;
    font-family: var(--mono);
  }}
  .card-links {{ display: flex; gap: 12px; font-size: 13px; }}
  .card-links a {{
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dotted transparent;
  }}
  .card-links a:hover {{ border-bottom-color: var(--accent); }}

  .empty {{
    text-align: center;
    color: var(--text-dim);
    padding: 60px 20px;
    font-style: italic;
  }}
</style>
</head>
<body>

<script type="application/json" id="archive-data">
{payload}
</script>

<div class="container">
  <header>
    <h1>Archive de Specs</h1>
    <div class="subtitle"><span class="count" id="count"></span> features arquivadas</div>
  </header>

  <div class="filters">
    <div class="filter-row">
      <input type="text" id="search" placeholder="Buscar por objetivo, motivação, ID, resumo...">
    </div>
    <div class="filter-row">
      <label>Domínios:</label>
      <div id="dominio-chips"></div>
    </div>
    <div class="filter-row">
      <label>Tags:</label>
      <div id="tag-chips"></div>
    </div>
  </div>

  <div id="results"></div>
</div>

<script>
const data = JSON.parse(document.getElementById('archive-data').textContent);
const state = {{
  search: '',
  dominios: new Set(),
  tags: new Set()
}};

const allDominios = [...new Set(data.map(f => f.dominio))].sort();
const allTags = [...new Set(data.flatMap(f => f.tags))].sort();

function renderChips(containerId, items, selectedSet) {{
  const c = document.getElementById(containerId);
  c.innerHTML = '';
  items.forEach(item => {{
    const chip = document.createElement('span');
    chip.className = 'chip' + (selectedSet.has(item) ? ' active' : '');
    chip.textContent = item;
    chip.addEventListener('click', () => {{
      if (selectedSet.has(item)) selectedSet.delete(item);
      else selectedSet.add(item);
      renderAll();
    }});
    c.appendChild(chip);
  }});
}}

function escapeHtml(s) {{
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}}

function filter(features) {{
  return features.filter(f => {{
    if (state.dominios.size > 0 && !state.dominios.has(f.dominio)) return false;
    if (state.tags.size > 0 && !f.tags.some(t => state.tags.has(t))) return false;
    if (state.search) {{
      const q = state.search.toLowerCase();
      const haystack = (f.feature_id + ' ' + f.objetivo + ' ' + f.motivacao + ' ' + f.resumo + ' ' + f.autor).toLowerCase();
      if (!haystack.includes(q)) return false;
    }}
    return true;
  }});
}}

function renderResults(features) {{
  const r = document.getElementById('results');
  if (features.length === 0) {{
    r.innerHTML = '<div class="empty">Nenhuma feature encontrada com esses filtros.</div>';
    return;
  }}
  r.innerHTML = features.map(f => `
    <div class="feature-card">
      <div class="card-header">
        <span class="card-id">${{escapeHtml(f.feature_id)}}</span>
        <span class="card-title">${{escapeHtml(f.objetivo || '(sem objetivo)')}}</span>
        <span class="card-dominio">${{escapeHtml(f.dominio)}}</span>
        ${{f.arquivada_em ? `<span class="card-date">${{escapeHtml(f.arquivada_em)}}</span>` : ''}}
      </div>
      ${{f.resumo ? `<div class="card-summary">${{escapeHtml(f.resumo)}}</div>` : ''}}
      ${{f.tags.length ? `<div class="card-tags">${{f.tags.map(t => `<span class="card-tag">${{escapeHtml(t)}}</span>`).join('')}}</div>` : ''}}
      <div class="card-links">
        <a href="${{escapeHtml(f.caminho)}}/spec.html">spec</a>
        <a href="${{escapeHtml(f.caminho)}}/plan.html">plan</a>
        <a href="${{escapeHtml(f.caminho)}}/tasks.md">tasks</a>
        <a href="${{escapeHtml(f.caminho)}}/ARCHIVED.md">ARCHIVED.md</a>
      </div>
    </div>
  `).join('');
}}

function renderAll() {{
  renderChips('dominio-chips', allDominios, state.dominios);
  renderChips('tag-chips', allTags, state.tags);
  const filtered = filter(data);
  document.getElementById('count').textContent = filtered.length + (filtered.length !== data.length ? ' / ' + data.length : '');
  renderResults(filtered);
}}

document.getElementById('search').addEventListener('input', (e) => {{
  state.search = e.target.value;
  renderAll();
}});

renderAll();
</script>
</body>
</html>
"""


def main():
    if len(sys.argv) > 1:
        start = Path(sys.argv[1])
    else:
        start = Path.cwd()

    archive_root = find_archive_root(start)
    features = collect_features(archive_root)

    html_content = render_html(features)
    output = archive_root / "index.html"
    output.write_text(html_content, encoding="utf-8")

    print(f"✓ Índice gerado: {output}")
    print(f"  {len(features)} feature(s) arquivada(s)")
    if features:
        by_dom = {}
        for f in features:
            by_dom.setdefault(f["dominio"], 0)
            by_dom[f["dominio"]] += 1
        for dom, n in sorted(by_dom.items()):
            print(f"  - {dom}: {n}")


if __name__ == "__main__":
    main()
