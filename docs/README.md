# Srijan — docs index

Handoff pack so any agent (or human) can continue the build when a session ends.

| Doc | What it covers |
|-----|----------------|
| [AGENTS.md](./AGENTS.md) | **Start here.** Current state, how to run, known issues, conventions, delegation task templates |
| [PLAN.md](./PLAN.md) | Vision, user types, 10 modules, stack, repo layout, API contract, build sequence |
| [DESIGN.md](./DESIGN.md) | Brand, color/type tokens, layout, screen specs, shadcn mapping |
| [MILESTONES.md](./MILESTONES.md) | Milestones M0–M7 with ✅/🟡/⬜ status and % complete |

Repo root also has `CLAUDE.md` (auto-loaded by Claude Code) and `index.html` (reference UI prototype).

## One-paragraph status

Backend (`api/`, Go+Gin+GORM) is runnable and seeded with the demo dataset; REST API at
`/api/v1` is smoke-tested. Frontend (`web/`, Next.js) scaffold needs a clean re-run. Auth
(Azure AD), S3, Postgres 17, Helm, GitHub Actions, ArgoCD are not started. MVP ~15%.
