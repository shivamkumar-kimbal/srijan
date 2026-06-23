# Srijan — Testing Strategy

## Goals
Catch regressions in the proposal/team flows and API contract; keep dev fast. Pragmatic
coverage over 100% numbers.

## Layers

### Backend (Go)
- **Unit/handler tests** with `httptest` + in-memory SQLite store. Cover: list filter by
  type, get 404, create validation, proposal submit increments count, proposals list.
- **Store tests**: AutoMigrate + seed idempotency; StringSlice round-trip on both drivers.
- Target: ≥70% on `handlers` and `store`.
- Run: `cd api && go test ./...`

### Frontend (Next.js)
- **Component/unit**: Vitest + React Testing Library for primitives & cards (props → render),
  query hooks with a mocked fetch.
- **E2E**: Playwright — board loads, filter switches list, open detail, submit proposal →
  success banner, nav between pages. Run against `pnpm dev` + live/mocked API.
- Target: smoke E2E green on each PR; RTL for critical components.
- Run: `cd web && pnpm test` (unit) / `pnpm e2e` (Playwright). (scripts TODO)

## Contract
- OpenAPI spec (once generated) validated in CI; FE types in `web/src/lib/types.ts` kept in
  sync with backend JSON. Consider generating types from the spec later.

## CI
GitHub Actions matrix: `go test`, `go vet`, `golangci-lint`; `pnpm lint`, `pnpm build`,
unit + Playwright. Block merge on failure. See `DEPLOYMENT.md`.

## Conventions
- Table-driven Go tests. One behavior per `t.Run`.
- Deterministic data; no network in unit tests (mock fetch / use httptest).
- Name: `TestThing_condition_expected`. Frontend: `*.test.tsx` next to component.

## Status
No tests yet (M1 was vertical-slice scaffold). First additions: handler tests for
opportunities + proposals; Playwright proposal smoke. Tracked in `TASKS.md` P2.
