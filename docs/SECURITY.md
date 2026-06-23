# Srijan — Security

## Authentication
- Prod: Azure AD (Entra ID) OIDC, auth-code + PKCE. Frontend holds session; backend
  validates access tokens against Entra **JWKS** (verify signature, `iss`, `aud`, `exp`, `nbf`).
- Dev: shared-secret HS256 JWT stub (`JWT_SECRET`) — never use in prod.
- Tokens passed as `Authorization: Bearer`. No tokens in URLs or logs.

## Authorization (RBAC)
- Roles: Employee, Project Owner, Manager, Leadership/Admin (from Entra groups/app roles).
- Enforce server-side on every mutating route. Examples:
  - Create challenge → Leadership only.
  - Review/accept proposal → Owner of that opportunity.
  - Award rewards → Owner/Leadership.
- Never trust client-side role checks for enforcement (UI gating is UX only).

## Secrets
- No secrets in repo. Local: `.env*.local` (gitignored). Cluster: K8s Secrets / external
  secrets operator. Rotate `JWT_SECRET`, DB creds, AWS keys regularly.
- `api/srijan.db` and `.env*` are gitignored.

## Input validation
- Bind + validate all request bodies (Gin binding tags). Reject oversized payloads.
- Parameterized queries via GORM (no string-built SQL). Validate `:id` is numeric.

## OWASP Top-10 checklist
- A01 Broken Access Control → server-side RBAC, ownership checks.
- A02 Crypto Failures → TLS everywhere; tokens validated; secrets encrypted at rest.
- A03 Injection → GORM params; no raw SQL; sanitize search input.
- A04 Insecure Design → proposal flow prevents direct join; least-privilege roles.
- A05 Misconfig → tighten CORS (`CORS_ORIGIN`, no `*` in prod); security headers.
- A07 AuthN failures → Entra MFA inherited; short token TTL; refresh handled by IdP.
- A08 Integrity → signed images, pinned deps, ArgoCD drift detection.
- A09 Logging → audit reward/approval events; no PII/tokens in logs.
- A10 SSRF → validate/allow-list any outbound (Slack/webhooks) targets.

## Rate limiting
- Per-user/IP limits on write endpoints (proposals, uploads). Implement at gateway or
  middleware (Redis token bucket). TODO.

## File uploads (Automation Marketplace)
- S3 presigned, size/type limits, content scanning before publish, no executable rendering.

## Data / compliance
- Internal-only data; respect org data residency. PII = names/emails from Entra only.
- Auditable rewards ledger and approval trail. Soft-delete + retention policy (TODO).

## Current gaps (track in TASKS.md)
JWT not yet enforced on routes; no rate limiting; no audit log; CORS dev-permissive.
