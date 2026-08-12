# Fluxo HTML ↔ JSON (spec e plan)

Esta referência explica em detalhe como `spec`/`plan` vivem como par JSON+HTML, como o ciclo funciona nos dois sentidos, e os edge cases que importam.

## Arquitetura em uma linha

> O **JSON é a fonte da verdade**. O **HTML é uma casca renderizada a partir do JSON** que humanos editam no navegador e que serializa de volta para JSON ao salvar.

## Por que essa arquitetura

**Por que não markdown puro?** Markdown denso (várias seções, tabelas, listas aninhadas) é ruim de ler num editor de texto comum, e marcadores como `PRECISA ESCLARECER` ficam invisíveis. Humanos querem checkbox clicável, badge de status colorido, seções colapsáveis.

**Por que não HTML como fonte da verdade?** HTML editado por IA é frágil — qualquer descuido com tags quebra a renderização, e parsear HTML para extrair dados é trabalho repetido. Mudanças de schema viram refactor pesado.

**Por que não HTML gerado de markdown?** Perde-se interatividade (checkboxes que persistem, mudança de status que valida). Vira só "leitura bonita".

**Por que JSON + HTML?** JSON é trivial pra IA editar e validar contra schema. HTML é onde o humano interage. A serialização nos dois sentidos é direta porque os campos têm correspondência 1:1.

## O par de arquivos por feature

Para cada feature em `.claude/specs/current/<NNN-slug>/`:

```
spec.html       ← UI standalone (humano edita aqui)
plan.html       ← idem
tasks.md        ← markdown puro (sem HTML, IA e humano editam diretamente)
.data/
├── spec.json   ← dado bruto da spec (IA edita aqui)
└── plan.json   ← dado bruto do plan (IA edita aqui)
```

A pasta `.data/` (com ponto) fica oculta em listagens padrão — reforça visualmente que é "interno". Quem entra na pasta da feature vê só os três arquivos relevantes pra trabalhar.

Os schemas dos JSONs estão em `templates/spec.schema.json` e `templates/plan.schema.json`. Sempre cheque o schema antes de editar JSON novo — campos opcionais, tipos, valores enum.

## Ciclo 1: IA edita (caminho mais comum)

```
┌──────────────────┐    ┌──────────────────────┐    ┌─────────────┐
│ IA edita         │───▶│ scripts/sync-html.sh │───▶│ humano abre │
│ .data/spec.json  │    │ <feature-id>         │    │ spec.html   │
└──────────────────┘    └──────────────────────┘    └─────────────┘
```

Passos:

1. IA abre `.data/spec.json`, edita campos conforme schema
2. IA roda `bash scripts/sync-html.sh <NNN-slug>` (da raiz do repo)
3. Script regenera `spec.html` (e `plan.html` se `.data/plan.json` existir) a partir do JSON
4. Humano abre `spec.html` no navegador para revisar

**Atenção:** depois de mudar o JSON, **sempre** rode `sync-html.sh`. Senão o HTML fica desatualizado e o humano vê a versão antiga.

## Ciclo 2: humano edita

```
┌─────────────┐    ┌────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│ humano abre │───▶│ humano clica em│───▶│ scripts/sync-json.sh │───▶│ .data/spec.json  │
│ spec.html   │    │ "💾 Salvar"   │    │ <html> <json>        │    │ atualizado       │
└─────────────┘    └────────────────┘    └──────────────────────┘    └──────────────────┘
```

Passos:

1. Humano abre `spec.html` no navegador (Chrome, Firefox, Safari — qualquer um)
2. Edita campos, marca checkboxes, adiciona itens
3. Clica em **"💾 Salvar (baixar HTML)"** → navegador baixa um novo arquivo `spec-<feature-id>.html` para a pasta de Downloads
4. IA (ou humano) roda:
   ```bash
   bash scripts/sync-json.sh ~/Downloads/spec-001-login.html .claude/specs/current/001-login/.data/spec.json
   ```
   Isso extrai o JSON do HTML baixado e sobrescreve o `.data/spec.json`
5. Opcional: rodar `sync-html.sh` para regenerar o HTML no lugar certo (descarta o do Downloads)

**Por que o navegador "baixa" em vez de salvar direto?** Limitação de segurança: páginas HTML standalone não conseguem escrever no disco. O download é o jeito mais simples e funciona em qualquer navegador.

## Botões na UI

O HTML tem três botões na barra fixa de baixo:

- **💾 Salvar (baixar HTML)** — gera um novo HTML com o JSON atualizado embutido e dispara o download
- **{ } Ver JSON** — abre modal mostrando o JSON formatado, útil pra debug ou pra copiar pra IA num chat
- **📋 Copiar JSON** — copia o JSON pro clipboard direto, sem abrir modal

## Edge cases

### "Editei no HTML mas esqueci de salvar"
Mudanças vivem apenas em memória do navegador até o download. Fechar a aba descarta tudo. Não há autosave. **Sempre clique "Salvar" antes de fechar.**

### "Editei no JSON e no HTML ao mesmo tempo"
Não faça isso. Combine com o time: ou IA edita JSON e regenera, ou humano edita HTML e exporta. Se houver conflito, **o JSON ganha** — não tente fazer merge à mão.

### "Cliquei Salvar mas o HTML baixado parece estranho"
O HTML serializado é **idêntico ao template** com o JSON novo embutido. Se ele parece diferente:
- Pode ter abrido o HTML diretamente (não via servidor) e algum plugin do navegador injetou conteúdo. Rode `sync-json.sh` para extrair só o JSON e regenerar limpo.
- Em qualquer dúvida: `sync-json.sh` → `sync-html.sh` traz pro estado canônico.

### "JSON inválido depois de editar manualmente"
Se a IA introduziu um erro de sintaxe no JSON e `sync-html.sh` falhou, o erro aparece no terminal. Conserte o JSON e tente de novo. Para validar antes:
```bash
python3 -m json.tool .claude/specs/current/001-login/.data/spec.json > /dev/null
```

### "Status diz 'esclarecendo' mas não tem mais perguntas"
A UI não força mudança automática. A IA (Spec Architect) decide quando virar `pronto` — geralmente quando todas as perguntas em `precisa_esclarecer` estão resolvidas. O humano pode mudar via dropdown também.

### "Como adicionar um campo novo no schema?"
1. Atualize `templates/spec.schema.json` (ou `plan.schema.json`)
2. Atualize `templates/spec.html` (ou `plan.html`): adicione a seção/campo, renderização, e handler de input
3. Atualize `scripts/render-doc.py`: ajuste `empty_spec`/`empty_plan` se o campo é obrigatório
4. JSONs existentes não quebram — o JS na UI preenche valores padrão para campos ausentes

## Convenções da UI

- **Seções colapsáveis** — clique no header para colapsar/expandir. Estado da seção não é salvo (não faz parte do JSON), é só conforto visual.
- **Checkboxes em critérios de aceitação** — marcar "atendido" não muda o status da spec, é só uma marca de progresso. A definição de "spec pronta" continua sendo `precisa_esclarecer` vazio.
- **"Precisa esclarecer" com resposta** — quando você marca a pergunta como resolvida, um campo de texto aparece para registrar a resposta. Útil para histórico.
- **Botão "+ adicionar"** sempre cria um item vazio que vai pro final da lista. Pode reordenar arrastando? Não — se precisa de ordenação manual, edita o JSON direto.

## Comparando com o trio markdown clássico

| Aspecto | Markdown puro | Par JSON+HTML |
|---------|--------------|---------------|
| IA edita | Direto, fácil | Edita JSON, regenera HTML |
| Humano lê | Razoável em editor de texto | Excelente no navegador |
| Humano edita | Mexer em markdown manual | Formulário guiado |
| Validação | Ad-hoc | Schema JSON |
| Diff em PRs | Limpo | Bagunçado quando muda muita coisa (HTML inteiro re-renderiza) |
| Tamanho do arquivo | ~2KB | ~25KB (HTML) + ~1KB (JSON) |

**Sobre commitar HTMLs no repo:** a abordagem recomendada aqui é **commitar tudo** — HTMLs e JSONs. Razões:

1. **Histórico navegável.** Em qualquer momento do passado você consegue abrir um `spec.html` antigo e ver a UI completa sem precisar regenerar.
2. **Reaproveitamento cross-project.** Você pode arrastar a pasta de uma feature arquivada para outro repo e abrir direto, sem precisar rodar scripts antes.
3. **Diff verboso é problema menor que reuso comprometido.** O JSON ao lado garante que reviews focam no que mudou de fato.

**Estratégia para minimizar ruído no diff:**
- Em PRs grandes, peça pra revisor olhar primeiro o `.data/spec.json` (diff curto) e abrir o `spec.html` localmente pra revisão visual.
- Se quiser ignorar o HTML em diffs do GitHub: adicione `*.html linguist-generated=true` no `.gitattributes` dentro de `.claude/specs/` — assim o GitHub colapsa o diff por padrão.

```
# .claude/specs/.gitattributes
**/spec.html linguist-generated=true
**/plan.html linguist-generated=true
archive/index.html linguist-generated=true
```
