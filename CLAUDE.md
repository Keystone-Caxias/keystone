# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Stack (decided 2026-09-18): **Next.js 16 App Router in JavaScript/JSX**, npm, **Supabase** (Postgres + Auth via `@supabase/ssr`), deployed on **Vercel**. Design system "Ordens Inglesas" (Claude Design) mirrored in `.claude/skills/ordens-inglesas-design/` and vendored for the app in `src/ds/` (see `src/ds/README.md` for the two adjustments).

Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm run db:push` (Supabase CLI, needs `supabase link`). Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (`.env.example`).

Conventions that differ from defaults:
- UI text is Brazilian Portuguese; follow the content rules in `.claude/skills/ordens-inglesas-design/readme.md` (sentence case, no emoji, one-word uppercase states).
- Import design-system components only from `@/ds` (barrel), never from `src/ds/components/**`.
- Styling is inline styles + design tokens (`var(--…)`); no CSS framework.
- Next 16: the request interceptor is `src/proxy.js` (not `middleware.js`); `cookies()`, `params` and `searchParams` are async.
- Data access happens in Server Components (`src/lib/dados.js`) and mutations in Server Actions (`actions.js` next to each route). RLS allows any authenticated user full access to the five tables; `anon` has none.
- Every `DataTable` with `render` functions lives in a client component (functions cannot cross the server/client boundary).

Database: PostgreSQL on Supabase. Migrations in `supabase/migrations/` (001 schema, 002 audit columns + cascade + RLS), seed in `supabase/seed.sql`. No local Postgres is installed on this machine; validate SQL against a Supabase project. Spec `001-modelagem-banco-dados` defines the entities.

Specs live in `.claude/specs/` (spec-driven-dev workflow — see `.claude/skills/spec-driven-dev/SKILL.md`).

## Licensing

Licensed under GPL-3.0 (`LICENSE`). Any dependency added must be GPLv3-compatible; flag license incompatibility before adding a dependency.

## Git conventions

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- Never commit directly to `main`. Create a branch and open a PR.
