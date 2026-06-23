# Changelog

All notable changes to Srijan. Format loosely follows Keep a Changelog; dates ISO.
Unreleased = on `main`, not yet tagged.

## [Unreleased]

### Added
- Backend (`api/`): Go + Gin server, CORS, `/healthz`.
- GORM models: Opportunity, Role, Proposal (+ `StringSlice` JSON column type).
- Store: gorm open (sqlite dev / postgres prod), AutoMigrate, idempotent Seed (6 demo opportunities).
- REST `/api/v1`: list/get/create opportunities; submit/list proposals; profile; insights; board.
- JWT middleware (shared-secret stub; not yet wired to routes).
- `index.html`: vanilla-JS prototype of core screens (ported from `Srijan.dc.html`).
- Frontend (`web/`): Next.js scaffold; theme tokens + Hanken/JetBrains fonts; TanStack Query
  providers; Zustand UI store; typed API client + query hooks; UI primitives (Button, Card, Badge).
- Docs pack: AGENTS, PLAN, DESIGN, MILESTONES, PRD, ARCHITECTURE, DATABASE, API, FEATURES,
  TASKS, DECISIONS, SECURITY, TESTING, DEPLOYMENT, ENVIRONMENT, CONTRIBUTING, AI_CONTEXT,
  CHANGELOG, ROADMAP + root CLAUDE.md, .gitignore.
- Repo pushed to github.com/shivamkumar-kimbal/srijan (`main`).

### Notes
- Scaffold uses Next 16.2.9 (App Router compatible) rather than 15.

### Pending (see TASKS.md)
- App shell + Dashboard/Explore/Detail/Profile/Insights pages wired to API.
- Azure AD auth, Postgres migrations, S3, Helm/CI/ArgoCD, tests.
