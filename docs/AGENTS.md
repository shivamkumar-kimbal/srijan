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

1. **Prod build fails prerendering the builtin error pages** (`/_not-found`,
   `/_global-error`): `TypeError: Cannot read properties of null (reading 'useContext'/'useState')`.
   Reproduces on **both** Turbopack and `--webpack`, with React 19.2.4 **and** 19.1.1,
   single React copy, and even with a custom `global-error.tsx` — the crash is inside Next's
   own dist chunk during the static-export worker. Conclusion: a **Next 16.2.9 + React 19.x
   framework prerender bug in this sandbox**, not app code. `pnpm dev` renders every route
   200 with live data. Already applied: providers/shell moved into the `(app)` route group
   so app pages don't pollute the root error pages (`src/app/(app)/layout.tsx`); that fixed
   the providers-in-root case. Remaining fix paths to try when unblocked:
   - Bump Next to a patch that fixes error-page prerender (preferred), or downgrade Next to a
     known-good 15.x with React 19.0.x.
   - As a stopgap for deploys, serve via `next dev`/a custom server, or investigate
     `export const dynamic` / disabling static export of error routes.
   This blocks ONLY `next build`; development and the running app are unaffected.
2. **pnpm 11 build-scripts / deps-check.** Settings live in `web/pnpm-workspace.yaml`
   (`verifyDepsBeforeRun: false`, `onlyBuiltDependencies: [sharp, unrs-resolver]`), NOT the
   `pnpm` field in package.json (ignored) or `.npmrc`. An IDE linter may re-inject a
   malformed `allowBuilds:` block — delete it if builds start failing.
3. **JWT middleware exists but is not attached** to any route group yet. Wire it in
   `cmd/server/main.go` once auth is real (M4).
4. **No tests yet.** Add Go table tests for handlers and a Playwright/RTL smoke for web.
5. `api/srijan.db` is a local artifact — gitignored.

## Run the full stack (verified working)
```bash
cd api && PORT=8080 go run ./cmd/server     # terminal 1
cd web && pnpm dev                          # terminal 2 → http://localhost:3000
```
All routes return 200; Dashboard/Explore/Detail/Profile/Leaderboards/Projects pull live API
data (CORS allows :3000). Frontend files: `web/src/app/*` (pages), `web/src/components`,
`web/src/lib` (api/queries/types/store/utils).

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
