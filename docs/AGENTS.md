# AGENTS.md — Handoff for continuing Srijan

Read this first if you are picking up the build. Then read `PLAN.md`, `DESIGN.md`,
`MILESTONES.md` in this folder.

## TL;DR state

- **Backend (`api/`) works and is runnable.** Go + Gin + GORM, seeded demo data, REST at
  `/api/v1`. Smoke-tested OK.
- **Frontend (`web/`) scaffold is incomplete** — `create-next-app` aborted on a pnpm
  build-script approval prompt. Re-run cleanly (see Known issues).
- **Prototype `index.html`** at repo root is the working reference UI (vanilla JS port of
  the original `Srijan.dc.html` design). Use it as the source of truth for screens 2–6.
- Auth, S3, Postgres, Helm, CI/CD, ArgoCD = not started.

## How to run what exists

```bash
cd api && go run ./cmd/server     # http://localhost:8080  (seeds ./srijan.db)
curl localhost:8080/api/v1/opportunities
open ../index.html                # prototype UI in browser
```

## Conventions

- **Go**: package-per-concern under `internal/`. Handlers are thin structs holding `*gorm.DB`.
  JSON tags are camelCase to match the frontend. Keep demo/static dashboard data in
  `handlers/dashboard.go` until real tables exist.
- **DB**: dev = pure-Go SQLite (`glebarez/sqlite`, no CGO). Prod = Postgres via
  `DB_DRIVER=postgres DATABASE_URL=...`. `StringSlice` persists `[]string` as JSON text so
  it works on both.
- **Config** via env (see `internal/config/config.go`): `PORT`, `DB_DRIVER`, `DATABASE_URL`,
  `JWT_SECRET`, `CORS_ORIGIN`.
- **Frontend** (target): App Router, server components for shells, client components for
  interactive bits. TanStack Query for all API reads; Zustand only for local UI state
  (filters, form drafts, sidebar). shadcn/ui components. Tokens from `DESIGN.md`.
- Brand is **Srijan** everywhere. The dashboard mockup says "Yukti" — ignore that name.

## Known issues / gotchas

1. **web scaffold aborted.** pnpm blocked `sharp` / `unrs-resolver` build scripts and
   `create-next-app` treated it as failure. Fix by re-creating then approving builds:
   ```bash
   cd /Users/shivamkumar/Desktop/srijan-kimbal
   rm -rf web
   pnpm create next-app@latest web --ts --tailwind --eslint --app --src-dir \
     --import-alias "@/*" --use-pnpm --turbopack --yes
   cd web && pnpm approve-builds   # approve sharp + unrs-resolver, or:
   # echo 'enable-pre-post-scripts=true' is not needed; instead add to web/.npmrc:
   #   public-hoist-pattern[]=*
   # simplest: pnpm config set --location project ... then pnpm install
   ```
   If `create-next-app@latest` installs Next 16 and you specifically need **15**, run
   `pnpm create next-app@15 ...` instead. (Current scaffold pulled Next 16.2.9.)
2. **JWT middleware exists but is not attached** to any route group yet. Wire it in
   `cmd/server/main.go` once auth is real (M4).
3. **No tests yet.** Add Go table tests for handlers and a Playwright/RTL smoke for web.
4. `api/srijan.db` is a local artifact — gitignore it (see below).

## Suggested .gitignore (root)

```
api/srijan.db
api/server
web/node_modules
web/.next
web/.env*.local
.DS_Store
```

## Definition of done for MVP

Dashboard + Explore + Detail/Proposal + Profile + Insights all rendering live API data,
behind Azure AD login, deployable to K8s via Helm + ArgoCD with GitHub Actions building
images. Track against `MILESTONES.md`.

## Task templates for delegating to another agent

- "Re-run the `web/` Next.js scaffold per AGENTS.md Known issues #1, init shadcn/ui with the
  tokens in DESIGN.md, add TanStack Query + Zustand providers, and build the app shell
  (sidebar + topbar) from DESIGN.md. Don't touch `api/`."
- "Build the Explore page: a TanStack Query hook `useOpportunities(type)` hitting
  `GET /api/v1/opportunities`, render the 2-col card grid + type filter chips exactly like
  `index.html`'s board view, using shadcn Card/Badge."
- "Build Opportunity Detail + proposal form wired to `GET /:id` and
  `POST /:id/proposals`; show success state on submit."
