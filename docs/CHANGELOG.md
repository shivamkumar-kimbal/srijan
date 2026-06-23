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

- App shell (sidebar + topbar) + UI primitives (Button/Card/Badge/SkillChip).
- Pages wired to live API: Dashboard, Explore (board + type filter), Opportunity Detail +
  proposal form (mutation + success), My Projects kanban, Profile, Leaderboards. Stub pages
  for proposals/automation/jobs/rewards/learning/help. All routes dev-verified 200.

### Notes
- Scaffold uses Next 16.2.9 (App Router compatible) rather than 15.
- pnpm 11 settings moved to `pnpm-workspace.yaml` (`verifyDepsBeforeRun`, `onlyBuiltDependencies`).

### Added (auth — gated)
- Backend Entra ID (Azure AD) JWKS validation middleware (`MicahParks/keyfunc`), enforced
  when `AZURE_TENANT_ID`+`AZURE_CLIENT_ID` set, open in dev.
- Frontend Auth.js (NextAuth v5) Microsoft Entra ID provider, `/signin` page, middleware
  guard, access-token bridge to API client. Gated by `AUTH_ENABLED` (off in dev).
- `/post` page: create opportunity form → `POST /opportunities`.

### Added (infra)
- Dockerfiles: api (golang:1.26 → distroless static, CGO off), web (node:22 standalone).
- docker-compose: postgres:17 + api + web with Postgres DSN + healthcheck.
- GitHub Actions: `ci.yml` (api vet/build/test; web lint/tsc/build on Node 22),
  `images.yml` (build+push api/web to GHCR).

### Changed
- **Pinned to Next 15.5.19 + React 19.0.0** (matches spec; was Next 16.2.9). `output: standalone`.
- Seed reduced to a single placeholder opportunity named **"test"** (no demo dataset).
- Providers + app shell moved into `(app)` route group so root error pages don't mount them.

### Notes
- Local `pnpm build` fails only due to **Node 26** (Next unsupported); CI/Docker on Node 22
  builds fine. Dev works fully. See AGENTS.md #1.

### Known issues
- `pnpm build` fails prerendering builtin error pages (`/_not-found`, `/_global-error`) —
  `useContext`/`useState` null inside Next dist; reproduces on both bundlers and React
  19.1/19.2. Framework prerender bug, not app code. Dev unaffected. See AGENTS.md #1.

### Pending (see TASKS.md)
- Fix prod-build 404 prerender; mobile responsive; Post-Opportunity form.
- Azure AD auth, Postgres migrations, S3, Helm/CI/ArgoCD, tests.
