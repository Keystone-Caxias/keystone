# Workflow detalhado

Este documento expande o fluxo geral do `SKILL.md`. Leia quando precisar do passo a passo de uma etapa específica.

## 1. Propor (Spec Architect)

**Entrada:** uma ideia. Pode vir do INBOX, de uma conversa, ou direta do usuário.

**Saída:** `spec` na pasta `current/<NNN-slug>/`.

**Passos:**

1. **Criar a pasta da feature.** Em Claude Code: `bash scripts/new-feature.sh <slug>`. Em claude.ai: criar manualmente (ver `new-feature-manual.md`).
2. **Preencher o `spec`** seguindo o template. Foco em **o quê** e **por quê**, nunca em **como**.
3. **Marcar pontos abertos** como `PRECISA ESCLARECER`. Não invente decisão — pergunte ao usuário em uma única rodada de perguntas no chat.
4. **Atualizar `ROADMAP.md`** adicionando a feature na seção "Em curso" com status 🟡.

**Quando parar:** se houver qualquer `PRECISA ESCLARECER`, status fica `esclarecendo` e não passa para o `plan`.

**Hand-off:** *"`spec` pronta. Posso seguir para o `plan`?"*

## 2. Planejar (Spec Architect)

**Entrada:** `spec` com status `pronto`.

**Saída:** `plan` + `tasks.md`.

**Passos:**

1. **Reler o `spec` inteiro** antes de começar.
2. **Esboçar abordagem geral** no `plan` — 2–4 parágrafos de estratégia técnica.
3. **Listar arquivos a tocar concretamente.** Criados / modificados / não tocados (explícito). Pode olhar código para descobrir caminhos, mas não para decidir requisitos.
4. **Anotar decisões técnicas em tabela** — escolha, alternativas, razão. Útil para auditoria depois.
5. **Quebrar em WPs no `tasks.md`.** Cada WP em 30–90 min. Se uma WP parece grande demais, divida em duas. Numerar em sequência (WP01, WP02, ...).
6. **Para cada WP, declarar `files:`** — caminhos exatos que o Software Engineer pode tocar. Esse campo é o cinto de segurança do escopo.
7. **Definição de Pronto verificável** por WP — checklists, não desejos vagos.

**Quando parar:** se ao tentar listar arquivos você precisar de leitura profunda do código, pare e peça ao usuário para trocar para Software Engineer (modo investigação) e voltar.

**Hand-off:** *"`plan` e `tasks.md` prontos. WP01 está em `planejado` — Software Engineer pode começar."*

## 3. Implementar (Software Engineer)

**Entrada:** uma WP em `lane: planejado`.

**Saída:** código + WP em `lane: revisão`.

**Passos:**

1. **Ler na ordem:** `CLAUDE.md` → `AGENTS.md` → `spec` → `plan` → bloco da WP em `tasks.md`. Não pule.
2. **Mover lane para `fazendo`** e adicionar `- AAAA-MM-DD: iniciada` no Log. Isso antes de qualquer mudança em código.
3. **Implementar.** Tocar **apenas** arquivos listados em `files:`. Se descobrir um bug fora desse escopo, registrar em `INBOX.md` como uma linha e seguir.
4. **Checar cada item da Definição de Pronto.** Se algo não dá para verificar com o código atual, pare e ajuste antes de continuar.
5. **Atualizar `README.md`** se o projeto usa README como dashboard (ver `readme-dashboard.md`).
6. **Mover lane para `revisão`** e adicionar linha no Log com resumo do que mudou.

**Quando parar:**
- Se a spec/plan parece errada → não atenda, peça troca para Spec Architect.
- Se descobrir que a WP precisa tocar arquivo fora de `files:` → não atenda, peça troca para Spec Architect (ajustar plan).
- Se a WP estourar 90min e ainda não está pronta → pare, peça troca para Spec Architect (dividir WP).

**Hand-off:** *"WP-NN pronta para revisão pelo Review Agent."*

## 4. Revisar (Review Agent)

**Entrada:** uma WP em `lane: revisão`.

**Saída:** WP em `pronto` ou de volta em `fazendo` com feedback.

**Passos:**

1. **Ler na ordem:** `CLAUDE.md` → `AGENTS.md` → `spec` → `plan` → bloco da WP em `tasks.md` → diff dos arquivos em `files:`. Nada além disso.
2. **Para cada item da Definição de Pronto, marcar ✅ ou ❌** com 1 linha de justificativa. Sem ✅ sem checagem.
3. **Conferir que nenhum arquivo fora de `files:` foi tocado.** Se foi, devolve para `fazendo` automaticamente — é scope creep.
4. **Conferir que o código segue o `plan`** — não só funciona, segue a arquitetura combinada.
5. **Decidir:**
   - Aprovada → muda lane para `pronto`, adiciona linha no Log com data e veredicto.
   - Devolvida → muda lane para `fazendo`, adiciona checklist acionável no Log. Feedback do tipo "linha 42 de Y faz Z, mas plan.md pede W", não "melhore X".

**Quando parar:**
- Se faltar contexto para revisar (ex: a Definição de Pronto fala em "performance aceitável" sem critério) → devolve para `fazendo` com instrução de ajustar com Spec Architect primeiro.

**Hand-off:**
- Aprovada e ainda há WPs em `planejado`? → *"WP-NN concluída. Próxima WP em `planejado`: WP-MM."*
- Aprovada e era a última WP? → *"Todas as WPs aprovadas. Spec Architect pode arquivar a feature."*
- Devolvida? → *"WP-NN devolvida para `fazendo`. Software Engineer precisa endereçar os itens no Log."*

## 5. Arquivar (Spec Architect)

**Entrada:** feature com todas as WPs em `pronto`.

**Saída:** feature em `archive/<período>/<NNN-slug>/` com `ARCHIVED.md` preenchido.

**Passos:**

1. **Mover a feature** de `current/` para `archive/<período>/`. Em Claude Code: `bash scripts/archive-feature.sh <NNN-slug>`. Em claude.ai: ver `archiving.md`.
2. **Preencher o `ARCHIVED.md`** — resumo de 3–5 linhas do que ficou implementado, lista de commits/PRs, desvios da spec original (se houve).
3. **Atualizar `ROADMAP.md`** — remover da seção "Em curso", adicionar em "Concluídas recentemente" (mantendo no máximo 5 itens).
4. **Atualizar `README.md`** se o projeto usa README como dashboard.

**Hand-off:** *"Feature arquivada em `archive/<período>/<NNN-slug>/`. Próxima feature no roadmap: <nome>."*

## Loop de feedback

Se durante a implementação ou revisão você descobrir que a spec/plan está errada ou incompleta:

- **Software Engineer:** pare. Não corrija a spec — peça troca para Spec Architect.
- **Spec Architect:** edite a spec/plan **antes** de qualquer outra mudança. A spec é autoritativa. Depois sinalize ao Software Engineer que pode retomar.

Esse vai-e-volta é desejado, não falha. O que **não** se faz é deixar código e spec divergirem em silêncio.
