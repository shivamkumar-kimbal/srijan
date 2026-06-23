# Srijan — Architecture

## Overview

```
                ┌──────────────┐
  Browser ───▶  │  Next.js 15  │  App Router (SSR + client components)
                │  TanStack Q  │  TailwindCSS + shadcn/ui, Zustand (UI state)
                └──────┬───────┘
                       │ HTTPS, Bearer JWT
                       ▼
                ┌──────────────┐
                │  Go / Gin    │  REST /api/v1, JWT middleware
                │  GORM        │
                └──────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  PostgreSQL 17    AWS S3        Azure AD (Entra ID)
  (primary data)  (assets)      (OIDC / JWKS)
```

## Frontend

- Next.js 15 App Router. Server components for shells/data-light pages; client components
  for interactive views (board filter, proposal form, kanban).
- **TanStack Query** owns all server state (caching, refetch, mutation invalidation).
- **Zustand** owns ephemeral UI state only (active filter, availability toggle, drafts).
- shadcn/ui + Tailwind v4 (CSS-first tokens in `globals.css`). Tokens from `DESIGN.md`.
- API access via `lib/api.ts` (typed fetch wrapper) + `lib/queries.ts` (hooks).

## Backend

- Go + Gin. Thin handlers holding `*gorm.DB`. Packages under `internal/`:
  `config`, `models`, `store` (open/migrate/seed), `handlers`, `middleware`.
- JSON camelCase to match frontend types.
- GORM AutoMigrate for dev; golang-migrate for prod (TODO).
- OpenAPI/Swagger generation (TODO) → published contract.

## Database

PostgreSQL 17 in prod; pure-Go SQLite in dev (zero-setup, no CGO). `StringSlice` custom
type stores `[]string` as JSON text → portable across both. See `DATABASE.md`.

## Auth flow

1. Browser → Next.js → Entra ID OIDC (auth code + PKCE).
2. Next.js session holds ID/access token.
3. Frontend sends `Authorization: Bearer <access_token>` to Go API.
4. Go middleware validates signature against Entra **JWKS**, checks `aud`/`iss`/`exp`,
   extracts roles/groups → sets request principal.
5. Role claims map to Employee/Owner/Manager/Admin gates.

(Dev stub today: shared-secret HS256 JWT in `middleware/auth.go`, not yet attached.)

## Storage

AWS S3 for automation assets, proposal attachments, portfolio files. Pre-signed URLs for
upload/download; metadata rows in Postgres.

## Caching / performance

- TanStack Query client cache (staleTime 30s).
- HTTP cache headers on read endpoints (TODO).
- DB indexes on `opportunities.type`, `proposals.opportunity_id` (see `DATABASE.md`).
- Optional Redis later for sessions/rate-limit counters (not MVP).

## Async / events (future)

Notifications (proposal submitted/accepted, team formed) via a lightweight outbox →
worker. Queue tech TBD (NATS/SQS). Not in MVP.

## Deployment

Docker images (api, web) → Helm chart → ArgoCD GitOps → K8s. CI builds/pushes via GitHub
Actions. See `DEPLOYMENT.md`.

## Key cross-cutting decisions

See `DECISIONS.md` (ADRs).
