# Srijan — Milestones & Progress

Status legend: ✅ done · 🟡 in progress · ⬜ not started

_Last updated: 2026-06-23_

## M0 — Foundation
- ✅ Monorepo layout (`api/`, `web/`, `deploy/`, `.github/`, `docs/`)
- ✅ Original `.dc.html` design imported + ported to runnable `index.html` prototype
- ✅ Handoff docs (`docs/`)

## M1 — Backend vertical slice  ✅ (RUNNABLE)
- ✅ Go module, Gin server, CORS, `/healthz`
- ✅ GORM models: Opportunity, Role, Proposal (+ StringSlice JSON column type)
- ✅ Store: gorm open (sqlite dev / postgres prod), AutoMigrate, idempotent Seed (6 demo opportunities)
- ✅ Handlers: list/get/create opportunities; submit/list proposals; profile; insights; board
- ✅ JWT middleware (shared-secret stub; not yet wired to routes)
- ✅ Smoke-tested: health, list, proposal POST all 200
- ⬜ Swagger/OpenAPI generation
- ⬜ Wire JWT to protected routes
- ⬜ Pagination, validation hardening, error envelope

## M2 — Frontend scaffold  ✅
- ✅ Next.js (16.2.9, TS, Tailwind v4, App Router, src dir)
- ✅ Theme tokens from DESIGN.md + Hanken/JetBrains fonts
- ✅ TanStack Query provider + Zustand store
- ✅ API client (`lib/api.ts`) + typed hooks (`lib/queries.ts`) reading `NEXT_PUBLIC_API_URL`
- ✅ App shell: sidebar (11 nav items, availability toggle, Post Project) + topbar
- ✅ UI primitives (Button, Card, Badge/SkillChip)

## M3 — Core pages wired to API  ✅ (dev-verified)
- ✅ Dashboard (hero, Featured Projects from API, How It Works, Your Impact, badges, active projects, internal opps, top contributors)
- ✅ Explore / Opportunity Board (GET /opportunities, type filter chips w/ counts)
- ✅ Opportunity Detail + Proposal form (GET /:id, POST /:id/proposals, success state)
- ✅ My Projects Kanban (GET /board)
- ✅ Profile (GET /profile)
- ✅ Leaderboards / Insights (GET /insights)
- ✅ Stub pages for proposals/automation/jobs/rewards/learning/help (no 404s)
- ✅ Smoke-verified: all routes 200 via `pnpm dev` against live API, content + data render
- 🟡 **Known issue:** `pnpm build` (prod) fails only on `/_not-found` static prerender
  (`useState` null — Turbopack + React-Query + React 19.2 dispatcher quirk). Dev unaffected.
  Fix path: build w/o Turbopack, or pin React 19.0, or make providers SSR-safe. See AGENTS.md.
- ⬜ Mobile responsive (sidebar → sheet)

## M4 — Auth  🟡 (gated scaffold; needs real tenant to go live)
- ✅ Backend: Entra JWKS validation middleware (`middleware/auth.go`), enforced when
  `AZURE_TENANT_ID`+`AZURE_CLIENT_ID` set; open in dev. Build + dev-passthrough verified.
- ✅ Frontend: Auth.js (NextAuth v5) Microsoft Entra ID provider, gated by `AUTH_ENABLED`;
  middleware redirects to `/signin` when enabled; sign-in page; access token attached to
  API calls via `lib/api.ts` token bridge. tsc clean; dev (auth off) verified.
- ⬜ Real Entra app registration (tenant/client IDs/secret) — can't test login without it
- ⬜ Role/app-role claims → Employee/Owner/Manager/Admin RBAC gating (server-side)

## M5 — Remaining modules  ⬜
- ⬜ Automation Marketplace (assets, downloads, reuse, ratings) + S3 upload
- ⬜ Internal Job Marketplace
- ⬜ Innovation Challenges (launch + submit + judge)
- ⬜ Rewards & Badges engine
- ⬜ AI Talent Matching (skills/reputation/availability scoring)
- ⬜ Team collaboration: milestones, deliverables, member management

## M6 — Data & infra  🟡
- ✅ Dockerfiles: api multi-stage (golang:1.26-alpine → distroless static, CGO off);
  web standalone (node:22-alpine, `output: standalone`)
- ✅ docker-compose (postgres:17 + api + web), Postgres DSN wired, healthcheck
- ✅ `.dockerignore` for both
- ⬜ PostgreSQL 17 migrations (golang-migrate); seed split dev/prod
- ⬜ Actually build/run compose (Docker daemon was offline in dev session)

## M7 — Deployment  🟡
- ✅ GitHub Actions CI (`ci.yml`): api go vet/build/test; web pnpm install/lint/tsc/build on Node 22
- ✅ GitHub Actions images (`images.yml`): build+push api & web to GHCR on main/tags
- ⬜ Helm chart (api, web, ingress, secrets)
- ⬜ ArgoCD app manifests (GitOps)
- ⬜ K8s manifests / values per env (dev/staging/prod)

## % Complete (rough)
- Backend: ~45% · Frontend: ~60% · Auth: ~70% (gated, needs tenant) · Infra/Deploy: 0% · Docs: 95%
- Overall MVP: ~45%

## Immediate next 3 tasks
1. Register real Entra app; flip `AUTH_ENABLED=true` + `AZURE_*`; test live login + RBAC.
2. Fix `/_not-found` / `/_global-error` prod-build prerender — see AGENTS.md.
3. Mobile responsive (sidebar → sheet); then M5 modules / M6–M7 infra.
