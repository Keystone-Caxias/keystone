# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Stack (decided 2026-09-18): **Next.js 16 App Router in JavaScript/JSX**, npm, **Supabase** (Postgres + Auth via `@supabase/ssr`), deployed on **Vercel**. Design system "Ordens Inglesas" (Claude Design) mirrored in `.claude/skills/ordens-inglesas-design/` and vendored for the app in `src/ds/` (see `src/ds/README.md` for the two adjustments).

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run db:start`/`db:stop`/`db:reset` (local Supabase via Docker, applies migrations + seed), `npm run db:push` (Supabase CLI, needs `supabase link`). Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (`.env.example`).

Conventions that differ from defaults:
- UI text is Brazilian Portuguese; follow the content rules in `.claude/skills/ordens-inglesas-design/readme.md` (sentence case, no emoji, one-word uppercase states).
- Import design-system components only from `@/ds` (barrel), never from `src/ds/components/**`.
- Styling is inline styles + design tokens (`var(--…)`); no CSS framework.
- Next 16: the request interceptor is `src/proxy.js` (not `middleware.js`); `cookies()`, `params` and `searchParams` are async.
- Data access happens in Server Components (`src/lib/dados.js`) and mutations in Server Actions (`actions.js` next to each route). RLS allows any authenticated user full access to every table (the five cadastro tables plus `categoria_caixa` and `lancamento_caixa`); `anon` has none.
- Every `DataTable` with `render` functions lives in a client component (functions cannot cross the server/client boundary).
- Forms with typed fields submit through `useEnvio` (`src/lib/useEnvio.js`, `<form onSubmit={enviar}>`), not `<form action={action}>`: React 19 resets the form when an action passed to `action` returns, even on a validation error, and a `<select>` snaps back to its initial value even when controlled.
- Order keys: the UI, URLs and design system use `arco-real | marca | nautas`; the database (table names and the `ordem_inglesa` enum) uses `arco_real | marca | nauta`. Convert with `ORDEM_DB` / `ORDEM_UI` and validate URL input with `lerOrdem` (`src/lib/formatar.js`). `src/lib/dados.js` returns UI keys.
- Money is `NUMERIC(12,2)` in the database and integer cents in JavaScript (`centavos`, `formatarMoeda`, `lerMoeda`). Never sum a fetched list to get a balance: the Supabase API caps responses at 1000 rows, so totals come from the SQL function `caixa_resumo` (`resumoCaixa`) and lists are read in pages (`listarLancamentos`).
- Dates: "today" and date-time formatting are pinned to `America/Sao_Paulo` (`hojeISO`, `formatarDataHora`); the Vercel server runs in UTC.
- Printable documents live under `src/app/imprimir/` (own layout, no Shell, requires a session). Print rules (`@page`, `@media print`) are in `src/app/imprimir/imprimir.css`, the one page-level stylesheet besides `globals.css`; pages compose `Folha`/`Secao` (`src/components/Folha.jsx`) and print through the browser (no PDF dependency). `src/components/FichaIrmao.jsx` holds the whole ficha layout.

Database: PostgreSQL on Supabase. Migrations in `supabase/migrations/` (001 schema, 002 audit columns + cascade + RLS, 003 caixa das Ordens: categories, entries, `caixa_resumo`), seed in `supabase/seed.sql`. Never edit an applied migration; add a new one. New tables need RLS, a policy and explicit `GRANT`s to `authenticated`. Validate SQL against the local stack (`npm run db:start`, Docker) or a Supabase project. Spec `001-modelagem-banco-dados` defines the cadastro entities; spec `002-mvp-fichas-e-caixa` defines the cash book and the printable documents, and lists the business rules still open (`precisa_esclarecer`) with the provisional behaviour adopted for each.

Specs live in `.claude/specs/` (spec-driven-dev workflow — see `.claude/skills/spec-driven-dev/SKILL.md`).

## Licensing

Licensed under GPL-3.0 (`LICENSE`). Any dependency added must be GPLv3-compatible; flag license incompatibility before adding a dependency.

## Git conventions

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- Never commit directly to `main`. Create a branch and open a PR.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
