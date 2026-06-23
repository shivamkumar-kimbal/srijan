# Contributing to Srijan

## Branching
- `main` = always deployable (auto-deploys to dev).
- Feature branches: `feat/<scope>-<short>` · fixes `fix/<scope>-<short>` · chores `chore/...`.
- Release branches `release/*`; production tags `v<major.minor.patch>`.

## Commits
- Conventional Commits: `feat(api): add proposal endpoint`, `fix(web): board filter reset`.
- Imperative, scoped, small. Reference task IDs from `TASKS.md` where useful.

## Pull requests
- One logical change per PR. Link the task/milestone. Fill: what/why/how-tested.
- Required green: lint, build, tests (CI). At least 1 review.
- Update relevant docs (`API.md`, `DATABASE.md`, `FEATURES.md`, `MILESTONES.md`,
  `CHANGELOG.md`) in the same PR.
- Don't commit secrets, `srijan.db`, `node_modules`, `.next`.

## Coding standards
### Go
- `gofmt`/`goimports`; pass `go vet` + `golangci-lint`. Errors wrapped with context.
- Thin handlers; business logic in services as it grows. JSON tags camelCase.
### TypeScript / React
- ESLint clean; no `any` unless justified. Server components by default; `"use client"`
  only when needed. TanStack Query for server data; Zustand for UI state only.
- Components in `src/components`, hooks/data in `src/lib`. Use `cn()` for class merging.
- Match design tokens from `DESIGN.md`; no ad-hoc colors.

## Definition of done
Code + tests + docs updated, CI green, matches DESIGN.md, no secrets, milestone/task
checked off. See `AI_CONTEXT.md` for the full DoD agents must satisfy.

## Local checks before PR
```bash
cd api && go vet ./... && go test ./...
cd web && pnpm lint && pnpm build
```
