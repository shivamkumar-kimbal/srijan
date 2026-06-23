# CLAUDE.md — Srijan

Guidance for any AI agent working in this repo. Full handoff lives in `docs/` —
read `docs/AGENTS.md` first, then `docs/PLAN.md`, `docs/DESIGN.md`, `docs/MILESTONES.md`.

## What this is

**Srijan** (सृजन) — internal Talent & Innovation Marketplace SaaS for large orgs.
Employees discover internal gigs/projects, bid via proposals, form teams, earn rewards,
build reputation, move internally. See `docs/PLAN.md` for full module list.

## Stack

- Frontend: Next.js 15 + TypeScript + TailwindCSS + shadcn/ui + TanStack Query + Zustand
- Backend: Go 1.25+ + Gin + GORM + JWT + OpenAPI/Swagger
- DB: PostgreSQL 17 (dev: pure-Go SQLite)
- Auth: Azure AD (Entra ID) · Storage: AWS S3
- Deploy: Kubernetes + Helm + GitHub Actions + ArgoCD

## Layout

```
api/        Go backend — RUNNABLE (gin, gorm, seeded). Entry: cmd/server/main.go
web/        Next.js frontend — scaffold in progress
index.html  vanilla-JS prototype of core screens (reference UI)
deploy/     helm + argocd (TODO)
docs/       plan / design / milestones / agent handoff
```

## Run

```bash
cd api && go run ./cmd/server   # :8080, seeds ./srijan.db
cd web && pnpm dev              # :3000 (once scaffolded)
```

## Working agreements

- Brand is **Srijan** everywhere (dashboard mockup says "Yukti" — ignore, rename to Srijan).
- JSON API is camelCase; Go models carry matching json tags.
- Keep dev zero-setup: SQLite default, switch to Postgres via `DB_DRIVER`/`DATABASE_URL`.
- Frontend: TanStack Query for server state, Zustand for local UI state only.
- Match the design tokens in `docs/DESIGN.md` — don't invent new colors/spacing.
- Update `docs/MILESTONES.md` when you complete a milestone item.
- Don't commit `api/srijan.db`, `web/.next`, `node_modules` (see `.gitignore`).

## Current status (2026-06-23)

Backend vertical slice done & smoke-tested. Frontend scaffold needs a clean re-run
(pnpm build-script approval aborted it — see `docs/AGENTS.md` Known issues #1).
Auth, S3, Postgres, Helm, CI/CD = not started. Overall MVP ~15%.
