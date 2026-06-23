# Srijan — Environment & Setup

## Prerequisites
- Go 1.26+ · Node 24+ · pnpm 11+ · Docker · (Postgres 17 for prod-like dev) · gh CLI.

## Backend env (`api/`)
| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | `8080` | HTTP port |
| `DB_DRIVER` | `sqlite` | `sqlite` (dev) or `postgres` |
| `DATABASE_URL` | `srijan.db` | sqlite file path, or Postgres DSN |
| `JWT_SECRET` | `dev-secret-change-me` | legacy dev JWT stub secret |
| `CORS_ORIGIN` | `http://localhost:3000` | allowed frontend origin |
| `AZURE_TENANT_ID` | — | Entra tenant; set with `AZURE_CLIENT_ID` to **enforce** JWKS auth |
| `AZURE_CLIENT_ID` | — | Entra app (API audience). Both set ⇒ API requires valid token |

> Auth is **enforced only when both `AZURE_TENANT_ID` and `AZURE_CLIENT_ID` are set**.
> Unset (dev) ⇒ API is open. Validation uses Entra JWKS (`login.microsoftonline.com/<tenant>/discovery/v2.0/keys`).

Postgres DSN example:
`postgres://srijan:secret@localhost:5432/srijan?sslmode=disable`

## Frontend env (`web/.env.local`)
| Var | Default | Purpose |
|-----|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | backend base URL |
| `AUTH_ENABLED` | `false` | `true` ⇒ require Entra login (middleware + sign-in) |
| `AUTH_SECRET` | `dev-secret-not-for-prod` | Auth.js session secret (`openssl rand -base64 32` for prod) |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | — | Entra app client ID |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | — | Entra app client secret |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | — | `https://login.microsoftonline.com/<tenant>/v2.0` |
| `AUTH_API_SCOPE` | — | API scope to request (e.g. `api://<client-id>/access_as_user`) |

### Enable Entra login (prod)
1. Register an app in Entra ID; add redirect URI `https://<host>/api/auth/callback/microsoft-entra-id`.
2. Create a client secret; expose an API scope; note tenant + client IDs.
3. Frontend: set `AUTH_ENABLED=true` + the `AUTH_*` vars above.
4. Backend: set `AZURE_TENANT_ID` + `AZURE_CLIENT_ID` (audience) so the Go API validates the token.
5. The frontend sends the Entra access token as `Bearer` on every API call (see `lib/api.ts`).

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
