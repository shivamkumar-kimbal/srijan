# Srijan — Design System

Modern enterprise SaaS. Inspiration: Linear, Notion, Jira, LinkedIn, Upwork, GitHub.
Clean white background, premium minimal, purple primary, Sanskrit-inspired branding,
card-based layout, mobile responsive.

## Brand

- Name: **Srijan** (सृजन). Logo: gradient purple rounded square + spark/star glyph.
- Subline option: "सृजन: कर्मसु कौशलम्" (skill in action).

## Color Tokens

| Token | Hex | Use |
|-------|-----|-----|
| primary | `#5046E5` | brand, buttons, active nav, links |
| primary-2 | `#7C5BF0` | gradient end |
| primary-bg | `#EEEDFD` / `#F0EFFE` | active nav bg, chips |
| ink | `#1C1B1A` | primary text |
| ink-2 | `#3C3B38` | body text |
| muted | `#76746E` | secondary text |
| muted-2 | `#9A988F` / `#A8A69D` | tertiary/labels |
| bg | `#F7F7F5` | app background |
| surface | `#FFFFFF` | cards |
| border | `#ECEBE6` / `#E7E6E0` | card/input borders |
| green | `#1F8A5B` bg `#E6F4EC` | success, high match, savings |
| gold | `#9A6E1A`/`#C99528` bg `#FBF3E2` | points, rewards, warnings |
| purple-alt | `#8B3FD1` bg `#F3EAFB` | innovation |
| orange | `#C2552E` bg `#FCEEE9` | tech debt |
| blue | `#2A6FDB` | testing/QA |

### Opportunity type colors
- automation `#5046E5`/`#EEEDFD` · innovation `#8B3FD1`/`#F3EAFB` · cost `#1F8A5B`/`#E6F4EC`
- docs `#B07F1E`/`#FBF3E2` · techdebt `#C2552E`/`#FCEEE9` · transfer `#5B5A55`/`#EEEFF1`

## Typography

- UI font: **Hanken Grotesk** (400–800).
- Mono (numbers, IDs, points, tags): **JetBrains Mono** (400–600).
- H1 27–28px/800/-0.6 · H3 card title 16.5px/700 · body 13.5–15px · labels 11–12px uppercase 600.

## Layout

- **Sidebar** 250px: logo, Workspace nav (Dashboard, Explore Projects, My Proposals, My Projects, Automation Hub, Internal Jobs, My Profile, Leaderboards, Rewards, Learning, Help), availability toggle, "Post Project" CTA, user card.
- **Topbar** 60px: page title / global search (300px), notifications, points badge, avatar.
- **Content** max-width ~1180px, 30–34px padding, card grid.
- Radius: cards 13–14px, chips/inputs 7–9px, pills 20px.
- Card hover: `box-shadow:0 8px 24px rgba(28,27,26,.08); translateY(-2px)`.

## Key Screens (build order)

1. **Dashboard** (primary — matches reference image):
   - Hero banner (gradient lilac): "Collaborate. Build. Grow." + illustration + "Explore Projects" CTA.
   - **Featured Projects** list: icon, title+New badge, desc, skill chips, Reward, Max Team Size, Proposal Deadline (red), View Details.
   - Filter chips: All / Automation / Innovation / Cost Optimization / Internal Tools / More + Filter.
   - **How It Works** 5-step: Post Idea → Submit Proposal → Get Selected → Collaborate & Build → Review & Earn.
   - Right rail: **Your Impact** (Points, Projects Completed, Earnings, Rank) + **Badges Earned** + **My Active Projects** (progress bars: In Progress/In Review) + **Internal Opportunities** (role, dept, location, Apply) + **Top Contributors** (rank, avatar, pts).
2. **Explore / Opportunity Board** — 2-col card grid, type filter chips w/ counts, match %, reward, team, proposals.
3. **Opportunity Detail** — left: type+match badges, title, owner, long desc, required skills, team & roles; right sticky: reward card, stats (team size/proposals/closes-in/match), "Submit a Proposal" → form (why, experience, weekly-hours slider) → success banner.
4. **My Projects (Kanban)** — 5 columns Backlog→In Progress→Review→Testing→Completed, draggable task cards (tag, title, assignee avatar, SRJ-id), team avatars.
5. **Profile** — avatar, promotion-ready badge, certs, 4 stat cards, promotion-readiness bar, skill bars, depts, completed projects, peer reviews.
6. **Leaderboards / Insights** — 6 KPI cards w/ deltas, cost-saved-by-category bars, top contributors.
7. **Rewards / Badges**, **Automation Hub**, **Internal Jobs**, **Innovation Challenges** — TODO.

## Reference

- `index.html` at repo root = working vanilla-JS prototype of screens 2–6 (exact tokens/data). Port these to React/shadcn.
- Reference dashboard screenshot (provided by user) = target for screen 1. Named "Yukti" in mockup; **use brand "Srijan"** instead.

## shadcn/ui mapping

button, card, badge, input, textarea, slider, tabs, avatar, progress, dropdown-menu,
dialog, sheet (mobile sidebar), tooltip, separator, scroll-area. Theme: set `--primary`
to `#5046E5`, base radius 0.75rem, font Hanken Grotesk.
