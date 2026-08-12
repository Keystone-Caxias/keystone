# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Greenfield repository: no application stack, manifest, build system, tests, or linting exist yet. Do not assume a language, framework, or package manager — ask before introducing one. Once a stack is chosen, add the build/test/lint commands and any style rules that differ from language defaults to this file.

Database: PostgreSQL 18, decided in `.claude/specs/current/001-modelagem-banco-dados/`. Local instance (`/Library/PostgreSQL/18`, port 5432) is used for development and schema validation; Supabase (managed Postgres) is the production target — same engine, so DDL validated locally is portable. No migrations or schema exist yet — the spec defines entities only, not DDL.

Specs live in `.claude/specs/` (spec-driven-dev workflow — see `.claude/skills/spec-driven-dev/SKILL.md`).

## Licensing

Licensed under GPL-3.0 (`LICENSE`). Any dependency added must be GPLv3-compatible; flag license incompatibility before adding a dependency.

## Git conventions

- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- Never commit directly to `main`. Create a branch and open a PR.
