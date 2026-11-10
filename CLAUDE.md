# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Stack (decided 2026-09-18): **Next.js 16 App Router in JavaScript/JSX**, npm, **Supabase** (Postgres + Auth via `@supabase/ssr`), deployed on **Vercel**. Design system "Ordens Inglesas" (Claude Design) mirrored in `.claude/skills/ordens-inglesas-design/` and vendored for the app in `src/ds/` (see `src/ds/README.md` for the two adjustments).

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run db:start`/`db:stop`/`db:reset` (local Supabase via Docker, applies migrations + seed), `npm run db:push` (Supabase CLI, needs `supabase link`). Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (`.env.example`); both are inlined at build time. After `db:reset`, recreate the local user and run `select public.oficial_definir('<email>', 'administrador')` (README). Production checklist: README, section "Publicar em produção". CI (`.github/workflows/ci.yml`) runs lint and build on PRs.

Conventions that differ from defaults:
- UI text is Brazilian Portuguese; follow the content rules in `.claude/skills/ordens-inglesas-design/readme.md` (sentence case, no emoji, one-word uppercase states).
- Import design-system components only from `@/ds` (barrel), never from `src/ds/components/**`.
- Styling is inline styles + design tokens (`var(--…)`); no CSS framework.
- Next 16: the request interceptor is `src/proxy.js` (not `middleware.js`); `cookies()`, `params` and `searchParams` are async.
- Data access happens in Server Components (`src/lib/dados.js`) and mutations in Server Actions (`actions.js` next to each route).
- Access: a session is not enough. Only accounts listed in table `oficial` read anything (RLS via `papel_atual()`); roles are `administrador | oficial | leitura`. `oficial` and `administrador` write; only `administrador` manages officers (`oficial_definir`/`oficial_remover` RPCs) and `caixa_fechamento`; `anon` has nothing. Layouts gate on `obterAcesso` (`src/lib/acesso.js`) and show `AcessoPendente` otherwise. Every mutating Server Action calls `recusaDeGravacao` first: under RLS an UPDATE/DELETE by a read-only user fails silently (0 rows), so the database alone gives no error to show.
- Cash book rules enforced in the database: `lancamento_caixa.numero` is an identity column (never set it); trigger `barrar_periodo_fechado` rejects any insert/update/delete dated on or before `caixa_fechamento.fechado_ate` with SQLSTATE `KS001`; trigger `registrar_historico_lancamento` writes every change to `lancamento_caixa_historico` (select-only). Custom SQLSTATEs: `KS001` closed period, `KS002` account not found, `KS003` last administrator.
- Members who leave are not deleted: each Order record has `situacao` (`ativo | licenciado | desligado`) and `macom.data_falecimento` marks a death. `listarIrmaosDaOrdem` and `contagens` exclude `desligado` and deceased.
- Every `DataTable` with `render` functions lives in a client component (functions cannot cross the server/client boundary).
- Forms with typed fields submit through `useEnvio` (`src/lib/useEnvio.js`, `<form onSubmit={enviar}>`), not `<form action={action}>`: React 19 resets the form when an action passed to `action` returns, even on a validation error, and a `<select>` snaps back to its initial value even when controlled.
- Order keys: the UI, URLs and design system use `arco-real | marca | nautas`; the database (table names and the `ordem_inglesa` enum) uses `arco_real | marca | nauta`. Convert with `ORDEM_DB` / `ORDEM_UI` and validate URL input with `lerOrdem` (`src/lib/formatar.js`). `src/lib/dados.js` returns UI keys.
- Money is `NUMERIC(12,2)` in the database and integer cents in JavaScript (`centavos`, `formatarMoeda`, `lerMoeda`). Never sum a fetched list to get a balance: the Supabase API caps responses at 1000 rows, so totals come from the SQL function `caixa_resumo` (`resumoCaixa`) and lists are read in pages (`listarLancamentos`).
- Dates: "today" and date-time formatting are pinned to `America/Sao_Paulo` (`hojeISO`, `formatarDataHora`); the Vercel server runs in UTC.
- Printable documents live under `src/app/imprimir/` (own layout, no Shell, requires a session). Print rules (`@page`, `@media print`) are in `src/app/imprimir/imprimir.css`, the one page-level stylesheet besides `globals.css`; pages compose `Folha`/`Secao` (`src/components/Folha.jsx`) and print through the browser (no PDF dependency). `src/components/FichaIrmao.jsx` holds the whole ficha layout.

Database: PostgreSQL on Supabase. Migrations in `supabase/migrations/` (001 schema, 002 audit columns + cascade + RLS, 003 caixa das Ordens: categories, entries, `caixa_resumo`; 004 officers and roles, role-based RLS, situação per Order, entry number and payment method, cash closing, entry history), seed in `supabase/seed.sql`. Never edit an applied migration; add a new one. New tables need RLS, policies based on `papel_atual()`/`pode_gravar()` (never `USING (true)`), `REVOKE ALL ... FROM anon, authenticated` and explicit `GRANT`s; new functions need `REVOKE EXECUTE ... FROM PUBLIC, anon`. Validate SQL against the local stack (`npm run db:start`, Docker) or a Supabase project. Spec `001-modelagem-banco-dados` defines the cadastro entities; spec `002-mvp-fichas-e-caixa` defines the cash book and the printable documents, and lists the business rules (`precisa_esclarecer`): the ones closed on 2026-11-10 carry the decision in `resposta`, the ones still open carry the provisional behaviour.

Specs live in `.claude/specs/` (spec-driven-dev workflow — see `.claude/skills/spec-driven-dev/SKILL.md`).

## Licensing

Licensed under GPL-3.0 (`LICENSE`). Any dependency added must be GPLv3-compatible; flag license incompatibility before adding a dependency.

## Git conventions

Full rules in `CONTRIBUTING.md` (Portuguese). Summary:

- `main` is the only long-lived branch and is what Vercel deploys to production. No `develop` or release branches; each PR's Vercel preview is the staging environment.
- Never commit or push directly to `main`. Branch from an up-to-date `main` and open a PR, including for docs and urgent fixes.
- Branch names: `<type>/<short-kebab-description>` with type `feat`, `fix`, `docs`, `refactor`, `test` or `chore`. Rename auto-generated names (`claude/...`) before opening the PR.
- Commit messages and PR titles follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`), optional scope, lowercase imperative summary.
- Before opening a PR run `npm run lint` and `npm run build` (plus `npm run db:reset` when it has a migration) and fill in `.github/pull_request_template.md`.
- PRs are merged with a merge commit (no squash, no rebase merge) and the branch is deleted afterwards. A person reviews agent-written work before merge.
- Never rewrite `main` history; undo with `git revert` in a PR.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
