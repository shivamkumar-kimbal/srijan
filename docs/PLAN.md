# Srijan — Build Plan

> सृजन — "Creation & Innovation". Internal Talent & Innovation Marketplace for large orgs.

## 1. Product Vision

Internal company marketplace where employees discover opportunities beyond their day job.
Combines: Internal Gig Marketplace · Talent Marketplace · Innovation Hub · Automation
Marketplace · Internal Mobility · Rewards & Recognition.

Goal: unlock hidden talent, drive cross-functional collaboration, accelerate automation,
improve retention, create internal career growth.

Tagline: **"Where Ideas Become Impact."**

## 2. User Types & Permissions

| Role | Can do |
|------|--------|
| **Employee** | Discover projects, submit proposals, join teams, earn rewards, build reputation, apply to internal jobs, publish automation assets |
| **Project Owner** | Create projects, review proposals, select team, track progress, approve deliverables, award rewards |
| **Manager** | View participation, approve involvement, monitor workload, track impact |
| **Leadership/Admin** | Launch innovation challenges, org-wide analytics, measure cost savings, monitor mobility, manage rewards |

## 3. Modules (target scope)

1. **Opportunity Marketplace** — post automation/AI/cost/tools/docs/research/security/innovation projects
2. **Proposal System** — employees bid (cannot join directly): Created → Proposal → Review → Team Selection → Execution
3. **Team Collaboration** — accept ≤10 members, assign roles (Lead/Engineer/Reviewer/Tester/Designer/Docs), milestones, deliverables
4. **Automation Marketplace** — publish Terraform/Actions/Jenkins/K8s/scripts/agents; show downloads, reuse, hours saved, cost saved, ratings
5. **Internal Job Marketplace** — openings, temp assignments, transfers, leadership roles
6. **Innovation Challenges** — leadership-launched competitions; employees submit & compete
7. **Reputation & Rewards** — Innovation/Leadership/Collaboration/Automation points; badges (Innovator, Builder, Mentor, Automation Champion, Rising Star, Problem Solver); rewards (cash, gift cards, recognition, promotion credits, learning budget, conference sponsorship)
8. **Talent Profile** — skills, certs, dept, reputation, completed projects, earnings, impact, portfolio ("LinkedIn inside the company")
9. **AI Talent Matching** — recommend best candidates / similar projects / experts / mentors by skills, reputation, past projects, availability, dept
10. **Analytics Dashboards** — Employee / Manager / Executive views

## 4. Tech Stack (target)

**Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui, TanStack Query (server state), Zustand (client state).
**Backend:** Go 1.25+, Gin, GORM (SQLC optional later), JWT middleware, OpenAPI/Swagger.
**DB:** PostgreSQL 17 (dev uses pure-Go SQLite for zero-setup).
**Auth:** Azure AD (Microsoft Entra ID) — OIDC; dev uses shared-secret JWT stub.
**Storage:** AWS S3 (automation assets, attachments).
**Deploy:** Kubernetes + Helm + GitHub Actions + ArgoCD (GitOps).

## 5. Repo Layout

```
srijan-kimbal/
├── index.html          # original .dc.html prototype ported to vanilla JS (reference UI)
├── api/                # Go backend (RUNNABLE NOW)
│   ├── cmd/server/main.go
│   ├── internal/
│   │   ├── config/     # env config
│   │   ├── models/     # GORM models (Opportunity, Role, Proposal) + StringSlice JSON type
│   │   ├── store/      # gorm open + AutoMigrate + Seed (demo data)
│   │   ├── handlers/   # opportunities, proposals, dashboard(profile/insights/board)
│   │   └── middleware/ # JWT
│   └── go.mod
├── web/                # Next.js frontend (SCAFFOLD IN PROGRESS — see MILESTONES)
├── deploy/             # helm / argocd (TODO)
├── .github/workflows/  # CI/CD (TODO)
└── docs/               # this folder
```

## 6. API Contract (current, /api/v1)

| Method | Path | Purpose |
|--------|------|---------|
| GET | /healthz | liveness |
| GET | /api/v1/opportunities?type= | list, filter by type |
| GET | /api/v1/opportunities/:id | detail + roles |
| POST | /api/v1/opportunities | create |
| GET | /api/v1/opportunities/:id/proposals | owner: list proposals |
| POST | /api/v1/opportunities/:id/proposals | submit proposal (bumps count) |
| GET | /api/v1/profile | talent profile (demo) |
| GET | /api/v1/insights | exec analytics (demo) |
| GET | /api/v1/board | kanban for active project (demo) |

Opportunity `type` enum: `automation | innovation | cost | docs | techdebt | transfer`.

## 7. Run Locally

```bash
# Backend
cd api && go run ./cmd/server        # :8080, seeds SQLite srijan.db
# Frontend (once scaffolded)
cd web && pnpm dev                   # :3000, set NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 8. Build Sequence (recommended for next agent)

1. Finish `web/` scaffold (Next.js 15, Tailwind, shadcn init, TanStack Query provider, Zustand store).
2. Build **Dashboard** page matching `docs/DESIGN.md` (Yukti-style layout, Srijan brand).
3. Wire pages to API via TanStack Query hooks: Explore (board), Opportunity detail + proposal, My Projects (kanban), Profile, Leaderboards/Insights.
4. Auth: Azure AD OIDC (NextAuth/MSAL) → backend JWT validation via JWKS.
5. Remaining modules: Automation Hub, Internal Jobs, Innovation Challenges, Rewards, AI Matching.
6. Postgres 17 + migrations; S3 wiring.
7. Dockerfiles, Helm charts, GitHub Actions, ArgoCD apps.

See `docs/MILESTONES.md` for status of each.
