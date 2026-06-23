# Srijan — docs index

Handoff pack so any agent (or human) can continue the build when a session ends.

| Doc | What it covers |
|-----|----------------|
| [AGENTS.md](./AGENTS.md) | **Start here.** Current state, how to run, known issues, conventions, delegation task templates |
| [AI_CONTEXT.md](./AI_CONTEXT.md) | Hard rules for agents: stack, conventions, state rules, definition-of-done |
| [PRD.md](./PRD.md) | Problem, goals, user stories, success metrics, scope, non-goals |
| [PLAN.md](./PLAN.md) | Vision, user types, 10 modules, stack, repo layout, API contract, build sequence |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System diagram, services, auth flow, caching, deployment |
| [DATABASE.md](./DATABASE.md) | ERD, tables, relationships, indexing, migrations |
| [API.md](./API.md) | Endpoints, request/response examples, errors, auth |
| [FEATURES.md](./FEATURES.md) | Per-module specs: stories, acceptance, edge cases, permissions |
| [DESIGN.md](./DESIGN.md) | Brand, color/type tokens, layout, screen specs, shadcn mapping |
| [TASKS.md](./TASKS.md) | Machine-readable backlog (P1/P2/P3) with checkboxes |
| [MILESTONES.md](./MILESTONES.md) | Milestones M0–M7 with ✅/🟡/⬜ status and % complete |
| [DECISIONS.md](./DECISIONS.md) | ADRs — why each choice, alternatives rejected |
| [SECURITY.md](./SECURITY.md) | Auth, RBAC, secrets, OWASP, rate limits, compliance |
| [TESTING.md](./TESTING.md) | Unit/integration/E2E strategy, coverage targets, conventions |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Environments, CI/CD, Helm/ArgoCD, rollback |
| [ENVIRONMENT.md](./ENVIRONMENT.md) | Env vars, setup steps, third-party services |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Branching, PR rules, coding standards |
| [CHANGELOG.md](./CHANGELOG.md) | Release history and major changes |
| [ROADMAP.md](./ROADMAP.md) | Post-MVP plans and future priorities |

Repo root also has `CLAUDE.md` (auto-loaded by Claude Code) and `index.html` (reference UI prototype).

## One-paragraph status

Backend (`api/`, Go+Gin+GORM) is runnable and seeded with the demo dataset; REST API at
`/api/v1` is smoke-tested. Frontend (`web/`, Next.js) scaffold needs a clean re-run. Auth
(Azure AD), S3, Postgres 17, Helm, GitHub Actions, ArgoCD are not started. MVP ~15%.
