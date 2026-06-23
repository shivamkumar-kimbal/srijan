# Srijan — Backlog

Machine-readable task list for agents. Check off as completed; keep priorities ordered.
P1 = MVP-critical · P2 = MVP-nice · P3 = post-MVP.

## P1

### Backend
- [x] Gin server + CORS + healthz
- [x] Models: Opportunity, Role, Proposal
- [x] Store: open/migrate/seed (sqlite dev / postgres prod)
- [x] Handlers: opportunities (list/get/create), proposals (submit/list), profile, insights, board
- [ ] Wire JWT middleware to `/api/v1` group (after Entra)
- [ ] `users` table + auth-derived principal
- [ ] Validation + standard error envelope + request id
- [ ] Postgres migrations (golang-migrate)

### Frontend
- [x] Theme tokens (Tailwind v4) + fonts (Hanken/JetBrains)
- [x] Providers (TanStack Query) + Zustand store
- [x] API client + typed hooks
- [x] UI primitives (Button, Card, Badge)
- [x] App shell: sidebar + topbar
- [x] Dashboard page (reference layout)
- [x] Explore / Opportunity Board (filter + grid)
- [x] Opportunity Detail + Proposal form (mutation + success)
- [x] My Projects kanban (GET /board)
- [x] Profile page (GET /profile)
- [x] Leaderboards / Insights (GET /insights)
- [ ] Fix `/_not-found` prod-build prerender (Turbopack/React 19.2) — see AGENTS.md
- [x] Wire "Post Opportunity" form → POST /opportunities (`/post` page)
- [ ] Mobile responsive (sidebar → sheet)

### Auth
- [ ] Entra ID app registration (redirect URIs, scopes)
- [ ] Next.js OIDC (NextAuth or MSAL) + session
- [ ] Backend JWKS validation, aud/iss/exp checks
- [ ] Role/group → RBAC gates

## P2
- [ ] Team management (accept proposal → member, roles, milestones)
- [ ] Notifications (proposal submitted/accepted, team formed)
- [ ] Internal Jobs as first-class (beyond type:transfer)
- [ ] Innovation Challenges submit + judge flow
- [ ] Profile edit
- [ ] Swagger/OpenAPI published
- [ ] Tests: Go handler tests, web RTL/Playwright smoke

## P3
- [ ] Automation Marketplace + S3 upload
- [ ] Rewards/badges engine + ledger
- [ ] AI talent matching (heuristic → ML)
- [ ] Manager dashboard
- [ ] Redis cache / rate limiting
- [ ] Audit log + admin console

## Dependencies
- Frontend pages depend on backend endpoints (mostly done) + auth (M4).
- Team/Rewards depend on `users` table.
- Deploy (Helm/ArgoCD) depends on Dockerfiles + Postgres.
