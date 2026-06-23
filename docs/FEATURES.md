# Srijan — Feature Specifications

Format per module: Purpose · User stories · Acceptance criteria · Edge cases · Permissions
· API deps · UI. Status: ✅ built · 🟡 partial · ⬜ planned.

---

## 1. Opportunity Marketplace 🟡
- **Purpose:** post & discover internal gigs/projects/challenges/transfers.
- **Stories:** browse, filter by type, see match %, open detail.
- **Acceptance:** list renders by type filter w/ counts; card shows type, match, days-left,
  reward, skills, team, proposals; create persists.
- **Edge:** empty filter result; expired (days≤0) marked closed (⬜); long titles truncate.
- **Permissions:** all read; create = Owner+.
- **API:** `GET/POST /opportunities`, `GET /opportunities/:id`.
- **UI:** board (2-col grid), detail (DESIGN.md screen 2–3).

## 2. Proposal System 🟡
- **Purpose:** employees bid; no direct join.
- **Stories:** submit proposal (why, experience, weekly hours); owner reviews list.
- **Acceptance:** submit returns success state; proposal count increments; owner sees list.
- **Edge:** duplicate proposal by same user (⬜ block); submit after deadline (⬜); empty fields validated.
- **Permissions:** submit = Employee+; review/accept = Owner of that opportunity.
- **API:** `POST/GET /opportunities/:id/proposals`.
- **UI:** form in detail right rail → success banner.

## 3. Team Collaboration ⬜
- **Purpose:** owner forms team (≤10), assigns roles, tracks milestones/deliverables.
- **Roles:** Lead, Engineer, Reviewer, Tester, Designer, Documentation Owner.
- **Acceptance:** accept proposal → member added with role; kanban reflects tasks; milestone status.
- **Edge:** team full; removing lead; reassigning roles.
- **Permissions:** manage = Owner/Lead; view = members + Manager.
- **API:** team_members, milestones (⬜). **UI:** kanban (🟡 demo board exists).

## 4. Automation Marketplace ⬜
- **Purpose:** publish reusable assets (Terraform, Actions, Jenkins, K8s, scripts, agents, tools).
- **Acceptance:** upload to S3, show downloads/reuse/hours-saved/cost-saved/ratings; search.
- **Edge:** large files, versioning, malicious content scan.
- **Permissions:** publish = Employee+; rate = any authed.
- **API:** automation_assets + S3 presign (⬜).

## 5. Internal Job Marketplace 🟡
- **Purpose:** advertise openings, temp assignments, transfers, leadership roles.
- **Acceptance:** apply internally; status tracked. (Modeled today as opportunity `type:transfer`.)
- **Permissions:** post = Owner/Manager; apply = Employee+.

## 6. Innovation Challenges 🟡
- **Purpose:** leadership launches competitions; employees submit & compete.
- **Acceptance:** challenge has prize pool + deadline; submissions judged; winners awarded.
- **Edge:** tie-break, late submission, judging rubric. (Today: opportunity `type:innovation`.)
- **Permissions:** launch = Leadership; submit = Employee+.

## 7. Reputation & Rewards ⬜
- **Purpose:** points (Innovation/Leadership/Collaboration/Automation), badges, rewards.
- **Badges:** Innovator, Builder, Mentor, Automation Champion, Rising Star, Problem Solver.
- **Rewards:** cash, gift cards, recognition, promotion credits, learning budget, conference.
- **Acceptance:** points accrue from events; badge thresholds; rewards ledger auditable.
- **Permissions:** award = Owner/Leadership; view own = Employee.

## 8. Talent Profile 🟡
- **Purpose:** "LinkedIn inside the company."
- **Acceptance:** skills w/ levels, certs, dept, reputation, completed projects, earnings,
  promotion-readiness, peer reviews. (`GET /profile` demo data today.)
- **Permissions:** edit own; others read.

## 9. AI Talent Matching ⬜
- **Purpose:** recommend candidates/experts/mentors/similar projects per opportunity.
- **Acceptance:** score by skills, reputation, past projects, availability, dept. Start heuristic.
- **Permissions:** Owner sees recommended candidates; Employee sees recommended opportunities.

## 10. Analytics Dashboards 🟡
- **Employee:** active projects, earnings, reputation, skills growth, applications.
- **Manager:** team participation, employee impact, innovation metrics. (⬜)
- **Executive:** cost savings, automation delivered, mobility rate, retention, innovation index.
  (`GET /insights` demo data today.)
