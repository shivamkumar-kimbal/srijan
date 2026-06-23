# Srijan — Database

PostgreSQL 17 (prod) · pure-Go SQLite (dev). GORM models in `api/internal/models`.

## ERD (current + planned)

```
opportunities 1───* roles
opportunities 1───* proposals
users 1───* proposals            (planned)
users 1───* opportunities (owner)(planned)
opportunities *───* users (team) (planned, via team_members)
users 1───* automation_assets    (planned)
challenges 1───* submissions      (planned)
```

## Tables — implemented

### opportunities
| col | type | notes |
|-----|------|-------|
| id | uint PK | |
| type | text | automation\|innovation\|cost\|docs\|techdebt\|transfer |
| title | text | |
| desc | text | short card description |
| long_desc | text | full detail |
| skills | text (JSON array) | StringSlice |
| match | int | heuristic skill-match % |
| days | int | days until proposal deadline |
| team | text | e.g. "3 / 10" |
| proposals | int | denormalized count |
| owner_name / owner_dept / owner_init | text | |
| reward_big / reward_label / match_pct | text | |
| reward_chips | text (JSON array) | StringSlice |
| created_at | timestamp | |

### roles
| col | type | notes |
| id | uint PK | |
| opportunity_id | uint FK → opportunities | |
| name | text | Lead/Developer/Reviewer/... |
| status | text | open\|filled |
| slots | text | e.g. "2 / 4" |

### proposals
| col | type | notes |
| id | uint PK | |
| opportunity_id | uint FK → opportunities | |
| author_name | text | (→ user_id once auth lands) |
| why | text | |
| experience | text | |
| weekly_hours | int | |
| status | text | submitted\|accepted\|rejected |
| created_at | timestamp | |

## Tables — planned

- **users** (id, entra_oid, name, email, dept, title, initials, role, reputation, points, available, weekly_hours)
- **team_members** (opportunity_id, user_id, role, joined_at)
- **milestones** (opportunity_id, title, due, status)
- **automation_assets** (id, owner_id, kind, name, description, s3_key, downloads, reuse_count, hours_saved, cost_saved, rating)
- **challenges** (id, type, title, prize_pool, deadline, owner_dept) + **submissions**
- **badges** (user_id, badge, awarded_at), **rewards_ledger** (user_id, kind, amount, source, awarded_at)
- **skills** / **user_skills** (user_id, skill, level, pct)

## Indexing strategy

- `opportunities(type)` — board filter.
- `proposals(opportunity_id)` — owner proposal list.
- `team_members(user_id)` / `team_members(opportunity_id)`.
- `automation_assets(kind)`, GIN on `to_tsvector(title||description)` for search.
- Unique `users(entra_oid)`, `users(email)`.

## Migrations

- Dev: GORM `AutoMigrate` in `store.Open`.
- Prod: switch to **golang-migrate** SQL files under `api/migrations/` (TODO). Never rely on
  AutoMigrate in prod for destructive changes.

## Seeding

`store.Seed` loads 6 demo opportunities idempotently (skips if rows exist). Split into
dev-only seed before prod (TODO).
