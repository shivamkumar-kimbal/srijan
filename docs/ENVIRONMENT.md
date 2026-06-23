# Srijan — Environment & Setup

## Prerequisites
- Go 1.26+ · Node 24+ · pnpm 11+ · Docker · (Postgres 17 for prod-like dev) · gh CLI.

## Backend env (`api/`)
| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | `8080` | HTTP port |
| `DB_DRIVER` | `sqlite` | `sqlite` (dev) or `postgres` |
| `DATABASE_URL` | `srijan.db` | sqlite file path, or Postgres DSN |
| `JWT_SECRET` | `dev-secret-change-me` | dev JWT stub secret (replace w/ Entra in prod) |
| `CORS_ORIGIN` | `http://localhost:3000` | allowed frontend origin |

Postgres DSN example:
`postgres://srijan:secret@localhost:5432/srijan?sslmode=disable`

## Frontend env (`web/.env.local`)
| Var | Default | Purpose |
|-----|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | backend base URL |
| `AZURE_AD_CLIENT_ID` | — | Entra app (M4) |
| `AZURE_AD_TENANT_ID` | — | Entra tenant (M4) |
| `AZURE_AD_CLIENT_SECRET` | — | Entra secret (M4) |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | — | session (M4) |

## Third-party services
- **Azure AD (Entra ID)** — SSO/OIDC. Register app, set redirect URIs, expose API scope,
  add app roles/groups for RBAC.
- **AWS S3** — bucket + IAM (least-priv) for automation assets. Vars: `AWS_REGION`,
  `S3_BUCKET`, creds via IRSA/secret (M5).

## Local run
```bash
# backend
cd api && go run ./cmd/server          # :8080, seeds ./srijan.db

# frontend
cd web && cp .env.example .env.local    # (create; set NEXT_PUBLIC_API_URL)
pnpm install && pnpm dev                # :3000
```

## Postgres locally (optional)
```bash
docker run -d --name srijan-pg -e POSTGRES_USER=srijan -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=srijan -p 5432:5432 postgres:17
DB_DRIVER=postgres DATABASE_URL='postgres://srijan:secret@localhost:5432/srijan?sslmode=disable' \
  go run ./cmd/server
```

## Notes
- pnpm may prompt to approve native build scripts (`sharp`, `unrs-resolver`); not required
  for dev. Run `pnpm approve-builds` if you need image optimization in prod build.
- Create `web/.env.example` documenting the vars above (TODO).
