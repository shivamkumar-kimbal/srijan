# Srijan — Architecture Decision Records

Format: status · context · decision · alternatives · consequences.

## ADR-001 — Next.js 15 App Router (frontend)
Accepted. Need SSR, file routing, RSC, strong Vercel/K8s deploy story. Chose App Router.
Alts: Vite SPA (no SSR), Remix (smaller ecosystem). Consequence: RSC/client boundary care;
scaffold pulled **Next 16.2.9** — acceptable (App Router compatible); pin to 15 only if required.

## ADR-002 — Go + Gin (backend)
Accepted. Want fast, statically-typed, low-footprint service for K8s. Gin = mature, simple.
Alts: Node/Nest (JS everywhere but heavier), Echo/Fiber, Java/Spring (heavy). Consequence:
two languages in repo; clear FE/BE boundary; great perf & small images.

## ADR-003 — GORM (ORM)
Accepted. Fast iteration, AutoMigrate for dev. Alts: sqlc (type-safe SQL — may adopt for hot
paths later), raw pgx. Consequence: some reflection cost; prod uses real migrations not AutoMigrate.

## ADR-004 — PostgreSQL 17 prod / pure-Go SQLite dev
Accepted. Postgres for relational integrity, JSON, full-text. Dev uses `glebarez/sqlite`
(no CGO) for zero-setup. `StringSlice` stores `[]string` as JSON text → portable.
Alts: Postgres-in-docker for dev (heavier onboarding). Consequence: keep SQL portable; verify
on Postgres in CI before prod features.

## ADR-005 — Azure AD / Entra ID (auth)
Accepted. Enterprise SSO mandatory; org standardizes on Microsoft. OIDC + JWKS validation.
Alts: Clerk/Auth0 (SaaS, less enterprise-native here), Keycloak (self-host overhead).
Consequence: dev uses shared-secret JWT stub; prod swaps to JWKS.

## ADR-006 — shadcn/ui + Tailwind v4
Accepted. Own the component code (not a locked dependency), CSS-first tokens. Matches design
system in DESIGN.md. Alts: MUI/Chakra (heavier, harder to match brand). Consequence:
maintain primitives in-repo; Tailwind v4 config lives in `globals.css`.

## ADR-007 — TanStack Query (server state) + Zustand (UI state)
Accepted. Separate server cache from local UI state. Alts: Redux Toolkit (boilerplate),
SWR (fewer mutation ergonomics). Consequence: don't put server data in Zustand.

## ADR-008 — GitOps via ArgoCD + Helm, CI via GitHub Actions
Accepted. Declarative, auditable deploys; org uses K8s. Alts: Flux, plain kubectl,
Vercel-hosted FE. Consequence: charts + Argo apps to maintain; images built in Actions.

## ADR-009 — AWS S3 for object storage
Accepted. Automation assets/attachments need durable object store + presigned URLs.
Alts: Azure Blob (matches Entra cloud — reconsider if org is Azure-first). Consequence:
AWS creds/IAM in cluster secrets.

## ADR-010 — Monorepo (api + web + deploy + docs)
Accepted. Single source of truth, atomic cross-cutting changes, shared docs. Alts: split
repos. Consequence: CI path-filters per app.
