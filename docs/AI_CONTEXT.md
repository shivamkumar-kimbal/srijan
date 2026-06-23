# Srijan — AI Context (source of truth for agents)

Read this + `AGENTS.md` before coding. This file states the hard rules.

## Mission
Srijan (सृजन) = internal Talent & Innovation Marketplace SaaS. Employees discover internal
opportunities, bid via proposals, form teams, earn rewards, grow careers. "Where Ideas
Become Impact." Brand is **Srijan** everywhere (the dashboard mockup labeled "Yukti" — rename).

## Tech stack
Next.js 15 (App Router, TS) · TailwindCSS v4 · shadcn/ui · TanStack Query · Zustand —
frontend. Go + Gin + GORM · JWT · OpenAPI — backend. PostgreSQL 17 (dev SQLite) · Azure AD
(Entra ID) · AWS S3 · K8s + Helm + GitHub Actions + ArgoCD.

## Folder conventions
```
api/internal/{config,models,store,handlers,middleware}   # Go, package-per-concern
api/cmd/server/main.go                                    # entrypoint + routes
web/src/app/         # App Router pages/layouts
web/src/components/  # UI (components/ui = primitives)
web/src/lib/         # api.ts, queries.ts, types.ts, store.ts, utils.ts
docs/                # all project docs
```

## Coding standards
- **Go:** thin handlers `struct{ DB *gorm.DB }`; JSON tags camelCase; wrap errors with
  context; `gofmt` + `go vet` clean. No raw SQL — GORM params.
- **TS/React:** server components by default, `"use client"` only when interactive. No `any`.
  `cn()` for classes. Files: components in `components/`, data/hooks in `lib/`.

## State management rules
- **Server state → TanStack Query only** (hooks in `lib/queries.ts`). Never store fetched
  API data in Zustand.
- **UI/local state → Zustand** (`lib/store.ts`): filters, toggles, drafts.
- Mutations invalidate the relevant query keys.

## API patterns
- All calls go through `lib/api.ts` (typed). Base = `NEXT_PUBLIC_API_URL`, prefix `/api/v1`.
- Backend routes grouped under `/api/v1`; versioned path. camelCase JSON. Error `{"error":...}`
  (moving to enveloped). See `API.md`.

## Component patterns
- Compose from `components/ui` primitives (Button, Card, Badge, ...). Match `DESIGN.md`
  tokens — no ad-hoc hex outside the token set / type-color map in `types.ts`.
- Opportunity type colors + avatar colors live in `web/src/lib/types.ts` (`TYPE_META`,
  `AVATAR_COLORS`) — reuse, don't redefine.

## Security rules
- Server-side RBAC on every mutation (Employee/Owner/Manager/Admin). UI gating is UX only.
- No secrets in repo. Validate all input. See `SECURITY.md`.

## Performance
- Query staleTime 30s; avoid waterfalls (parallel queries). Index DB per `DATABASE.md`.
- Keep images small (distroless/standalone). Lazy-load heavy client views.

## Definition of done (an agent must satisfy ALL)
1. Builds: `go build ./...` and `pnpm build` pass.
2. Lints/vets clean; types sound (no stray `any`).
3. Matches `DESIGN.md` tokens + the relevant screen spec.
4. Server data via TanStack Query; UI state via Zustand; no mixing.
5. Docs updated (`API.md`/`DATABASE.md`/`FEATURES.md` as relevant) + `MILESTONES.md`/
   `TASKS.md` checkboxes + `CHANGELOG.md` entry.
6. No secrets committed; gitignore respected.
7. Smoke-verified (run it; for API `curl`, for web load the page).

## Gotchas
- Next 16.2.9 installed (App Router compatible); pin to 15 only if explicitly required.
- pnpm build-script approval (`sharp`/`unrs-resolver`) not needed for dev.
- JWT middleware exists but is NOT wired to routes yet (waits on Entra, M4).
- Dashboard demo data (profile/insights/board) is static in `handlers/dashboard.go` until
  real tables exist.
