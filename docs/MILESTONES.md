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

## M4 — Auth  ⬜
- ⬜ Azure AD (Entra ID) app registration + OIDC in Next.js (NextAuth or MSAL)
- ⬜ Backend: validate Entra JWT via JWKS (replace shared-secret stub)
- ⬜ Role claims → Employee/Owner/Manager/Admin gating

## M5 — Remaining modules  ⬜
- ⬜ Automation Marketplace (assets, downloads, reuse, ratings) + S3 upload
- ⬜ Internal Job Marketplace
- ⬜ Innovation Challenges (launch + submit + judge)
- ⬜ Rewards & Badges engine
- ⬜ AI Talent Matching (skills/reputation/availability scoring)
- ⬜ Team collaboration: milestones, deliverables, member management

## M6 — Data & infra  ⬜
- ⬜ PostgreSQL 17 + migrations (golang-migrate), seed split dev/prod
- ⬜ Dockerfiles (api multi-stage; web standalone)
- ⬜ docker-compose for local (api + web + postgres)

## M7 — Deployment  ⬜
- ⬜ Helm chart (api, web, ingress, secrets)
- ⬜ GitHub Actions (lint, test, build, push images)
- ⬜ ArgoCD app manifests (GitOps)
- ⬜ K8s manifests / values per env (dev/staging/prod)

## % Complete (rough)
- Backend: ~35% · Frontend: ~55% · Auth: 0% · Infra/Deploy: 0% · Docs: 95%
- Overall MVP: ~35%

## Immediate next 3 tasks
1. Fix `/_not-found` prod-build prerender (Turbopack/React 19.2) — see AGENTS.md.
2. Mobile responsive (sidebar → sheet); wire "Post Opportunity" form to POST /opportunities.
3. Auth: Azure AD OIDC in Next.js + JWKS validation in Go (M4).
