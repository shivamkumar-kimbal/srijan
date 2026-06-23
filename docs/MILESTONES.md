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

## M2 — Frontend scaffold  🟡
- 🟡 `pnpm create next-app web` (Next 16/15, TS, Tailwind v4, App Router, src dir) — **install aborted on pnpm build-script approval; needs re-run** (see AGENTS.md "Known issues")
- ⬜ shadcn/ui init + theme tokens from DESIGN.md
- ⬜ TanStack Query provider + Zustand store
- ⬜ API client (`lib/api.ts`) reading `NEXT_PUBLIC_API_URL`
- ⬜ App shell: sidebar + topbar layout

## M3 — Core pages wired to API  ⬜
- ⬜ Dashboard (reference layout)
- ⬜ Explore / Opportunity Board (GET /opportunities, type filter)
- ⬜ Opportunity Detail + Proposal form (GET /:id, POST /:id/proposals)
- ⬜ My Projects Kanban (GET /board)
- ⬜ Profile (GET /profile)
- ⬜ Leaderboards / Insights (GET /insights)

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
- Backend: ~35% · Frontend: ~5% · Auth: 0% · Infra/Deploy: 0% · Docs: 90%
- Overall MVP: ~15%

## Immediate next 3 tasks
1. Re-run web scaffold cleanly (M2), commit.
2. shadcn init + app shell + Dashboard page.
3. Explore + Detail + Proposal flow wired to live API.
