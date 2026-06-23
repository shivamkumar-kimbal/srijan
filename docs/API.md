# Srijan — API Reference

Base URL: `${NEXT_PUBLIC_API_URL}` (dev `http://localhost:8080`). Prefix `/api/v1`.
Content-Type `application/json`. Auth: `Authorization: Bearer <jwt>` (enforcement = M4; open in dev).

## Health

`GET /healthz` → `200 {"status":"ok"}`

## Opportunities

### List
`GET /api/v1/opportunities?type=automation`
- `type` optional; one of `automation|innovation|cost|docs|techdebt|transfer|all`.
- `200` → `Opportunity[]` (each includes `roles[]`).

### Get
`GET /api/v1/opportunities/:id` → `200 Opportunity` | `404 {"error":"not found"}`

### Create
`POST /api/v1/opportunities`
```json
{
  "type": "automation",
  "title": "Automate X",
  "desc": "short",
  "longDesc": "full",
  "skills": ["Go","K8s"],
  "days": 21,
  "team": "0 / 5",
  "ownerName": "Shivam Kumar",
  "ownerDept": "Payments",
  "ownerInitials": "SK",
  "rewardBig": "₹10,000",
  "rewardLabel": "cash + points",
  "rewardChips": ["₹10,000 cash"]
}
```
`201` → created `Opportunity` (server sets `match`/`matchPct` default). `400` on bad body.

## Proposals

### Submit
`POST /api/v1/opportunities/:id/proposals`
```json
{ "why": "...", "experience": "...", "weeklyHours": 8, "authorName": "Shivam Kumar" }
```
`201` → `Proposal` (`status:"submitted"`); increments opportunity `proposals`.
`404` if opportunity missing, `400` on bad body. `authorName`/`weeklyHours` defaulted if omitted.

### List (owner)
`GET /api/v1/opportunities/:id/proposals` → `200 Proposal[]` (newest first).

## Dashboard (demo data until tables land)

`GET /api/v1/profile` → `Profile` (stats, skills, depts, completedProjects, reviews, promotionReadiness)
`GET /api/v1/insights` → `Insights` (kpis, costBars, performers)
`GET /api/v1/board` → `Board` (project, teamAvatars, columns[].tasks[])

## Types

See `web/src/lib/types.ts` (source of truth) and `DATABASE.md`.

## Error format

Currently `{"error": "<message>"}` with appropriate status. **TODO:** standard envelope
`{"error":{"code","message","details"}}` + request id.

## Auth (planned, M4)

All `/api/v1/*` except `/healthz` require a valid Entra ID access token. 401 on
missing/invalid; 403 when role lacks permission (e.g. employee creating a challenge).

## Versioning

Path-versioned (`/api/v1`). Breaking changes → `/api/v2`. OpenAPI spec to be generated and
committed at `api/openapi.yaml` (TODO).
