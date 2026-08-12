# README.md como dashboard vivo (opcional)

Convenção opcional: o `README.md` do projeto também serve como **dashboard de status**, refletindo em tempo real o que está em curso.

Útil quando: projeto pequeno/médio, time enxuto, README serve mais como manual interno que como divulgação externa.

Pular quando: README é "voltado para fora" (open source, divulgação), ou o time prefere ter um `STATUS.md` separado para isso.

## Quando atualizar

Você atualiza o README **no mesmo commit** da mudança de lane:

1. **Começou uma WP** (`planejado → fazendo`)
   - Move o item da WP para "🟡 Em andamento" sob a feature
   - Ícone de status passa para 🟡

2. **Terminou uma WP** (`fazendo → revisão`)
   - Ícone passa para 🔵
   - Atualiza a barra de progresso na tabela Roadmap

3. **WP aceita** (`revisão → pronto`)
   - Move para "🟢 Concluído recentemente" com a data
   - Incrementa o progresso da feature (`2/6 → 3/6`)
   - Se todas as WPs ficam prontas, status da feature na tabela passa a 🟢

4. **Começou uma feature nova**
   - Linha nova na tabela Roadmap com 🟡
   - Bloco novo em "🟡 Em andamento"

5. **Feature arquivada**
   - Remove de "🟡 Em andamento"
   - Mantém em "🟢 Concluído recentemente" por um tempo
   - Status na tabela passa a ⚫ (ou some, se for cleanup)

6. **Sempre**
   - Atualiza "Última atualização" em "Status atual"
   - "Concluído recentemente" no máximo 5 itens; o resto vai para `archive/` implicitamente via git log

## Barra de progresso

10 blocos com `█` (cheio) e `░` (vazio), seguidos de `N/M`:

- `░░░░░░░░░░ 0/6` — não começou
- `███░░░░░░░ 2/6` — em andamento
- `██████████ 6/6` — concluído

**Arredonda para baixo.** Nunca mostre barra cheia quando ainda falta WP.

Calcular blocos: `floor((N/M) * 10)`. Para 2/6 = `floor(3.33) = 3` blocos cheios.

## Esqueleto do README como dashboard

```markdown
# <Nome do Projeto>

<1–2 linhas: o que é>

## 📊 Status atual

> Última atualização: 2026-05-19

## 🗺️ Roadmap

| # | Feature | Status | Progresso |
|---|---------|--------|-----------|
| 001 | Login via Google | 🟡 | ███░░░░░░░ 2/6 |
| 002 | Dashboard inicial | 🔵 | ░░░░░░░░░░ 0/0 |
| 003 | Export CSV | ⚫ | ██████████ 4/4 |

Legenda: 🔵 backlog · 🟡 em andamento · 🟢 concluída · ⚫ arquivada · 🔴 cancelada

## 🟡 Em andamento

### 001 — Login via Google
- 🟢 WP01 — Layout do botão
- 🟢 WP02 — Hook de autenticação
- 🔵 WP03 — Redirecionamento pós-login *(em revisão)*
- 🟡 WP04 — Persistência de sessão *(em andamento)*
- ⚪ WP05 — Logout
- ⚪ WP06 — Tratamento de erros

## 🟢 Concluído recentemente

- 2026-05-15 — Export CSV completo (4/4 WPs)
- 2026-05-10 — Filtro por categoria (3/3 WPs)
- ...

## Stack

<...>
```

## O que NÃO colocar no README

- Detalhes de implementação por WP → vivem em `tasks.md`
- Decisões ou arquitetura → vivem em `plan`
- Brainstorms → vivem em `INBOX.md`

O README é **superfície de status**, não despejo de documentação. Se uma seção cresce além de uma tela no celular, está inchada — corte.

## Anti-padrões

- **README desatualizado.** Pior que não ter dashboard. Se o time não consegue manter, melhor remover a convenção.
- **Atualizar README sem mudar a lane.** O README espelha as lanes — não é o contrário. A fonte da verdade é `tasks.md`.
- **Misturar dashboard com docs de produto.** Se o README precisa servir aos dois públicos, separe em arquivos.
