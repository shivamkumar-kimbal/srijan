# Srijan — Deployment

## Environments
| Env | Purpose | Branch | Notes |
|-----|---------|--------|-------|
| local | dev | any | sqlite, FE :3000, API :8080 |
| dev | shared integration | `main` | auto-deploy via ArgoCD |
| staging | pre-prod | `release/*` | Postgres, Entra (test tenant) |
| prod | production | tag `v*` | gated promotion |

## Build artifacts (TODO)
- `api/Dockerfile` — multi-stage: `golang:1.26` build → `gcr.io/distroless/base` runtime,
  static binary `CGO_ENABLED=0` (pure-Go sqlite makes this clean), expose 8080.
- `web/Dockerfile` — `node:24` build (`next build`, output: standalone) → minimal runtime, 3000.
- Optional `docker-compose.yml` (api + web + postgres) for local full-stack.

## CI — GitHub Actions (`.github/workflows/`) (TODO)
- `ci.yml`: on PR — `go vet`/`golangci-lint`/`go test`; `pnpm lint`/`build`/test (path-filtered).
- `images.yml`: on push to `main`/tags — build & push `api` and `web` images to registry
  (GHCR/ECR), tag with sha + semver.

## GitOps — ArgoCD (`deploy/argocd/`) (TODO)
- `Application` per env pointing at `deploy/helm` with env `values-<env>.yaml`.
- Auto-sync + self-heal on dev; manual sync/promotion on prod. Image updater bumps tags.

## Helm (`deploy/helm/`) (TODO)
- Subcharts/templates: `api` Deployment+Service+HPA, `web` Deployment+Service, Ingress
  (TLS), ConfigMap (non-secret env), Secret refs (DB URL, JWT/Entra, AWS).
- Values: replicas, image tags, resources, `DB_DRIVER=postgres`, `DATABASE_URL`,
  `CORS_ORIGIN`, Entra IDs, S3 bucket/region.

## Config per env
Set via Helm values + K8s Secrets. See `ENVIRONMENT.md` for the full var list.

## Migrations
Run `golang-migrate` as a K8s Job / init-container before API rollout (once SQL migrations
exist). Never AutoMigrate in prod.

## Rollback
- ArgoCD: revert to previous synced revision (Git revert or app history).
- Helm: `helm rollback srijan <REVISION>`.
- Images are immutable (sha-tagged) → safe pin-back. DB: forward-only migrations; keep
  backups + tested down-migrations for emergencies.

## Health & observability
- `/healthz` liveness/readiness probes. Add `/metrics` (Prometheus) + structured logs +
  tracing (OpenTelemetry) — TODO.

## Status
All deploy artifacts are TODO (M6–M7). Backend/Frontend run locally today.
