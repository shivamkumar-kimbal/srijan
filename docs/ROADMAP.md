# Srijan — Roadmap

Direction beyond MVP. Priorities shift with feedback; treat as intent, not contract.
See `MILESTONES.md` for current execution status and `TASKS.md` for the live backlog.

## Now (MVP — Q3)
Opportunity marketplace, proposal flow, team kanban, talent profile, leadership insights,
Azure AD auth, RBAC, deploy to K8s. Goal: usable internal pilot with one or two departments.

## Next (post-MVP)
- **Team collaboration depth**: milestones, deliverables, member management, progress signals.
- **Notifications**: in-app + email/Slack on proposal submitted/accepted, team formed, rewards.
- **Internal Jobs** as first-class module (beyond `type:transfer`): openings, temp assignments, transfers.
- **Innovation Challenges**: launch → submit → judge → award, with leaderboards.
- **Rewards & Badges engine**: points accrual events, badge thresholds, auditable ledger,
  redemption (cash/gift/learning/conference) via out-of-band settlement.

## Later
- **Automation Marketplace**: publish/reuse Terraform, Actions, K8s templates, agents; S3-backed;
  downloads/reuse/hours-saved/cost-saved metrics; ratings; search.
- **AI Talent Matching**: heuristic scoring → learned model (skills, reputation, availability,
  past projects, dept) recommending candidates/experts/mentors/similar work.
- **Manager dashboard**: participation, workload, approvals, impact.
- **Analytics depth**: retention impact, skills-growth graphs, cohort views.

## Platform / scale
- Observability: Prometheus metrics, OpenTelemetry tracing, structured logs, dashboards.
- Rate limiting + Redis; audit log + admin console.
- Multi-tenant readiness (if offered to multiple orgs): tenant isolation, per-tenant config.
- sqlc for hot query paths; read replicas; full-text/search service.
- Mobile-optimized PWA; possible native shell.

## Bets / open questions
- Azure Blob vs AWS S3 if org standardizes on Azure (see ADR-009).
- Real-money rewards vs points-only (compliance, payroll integration).
- How far to push AI matching before it adds real value vs heuristic.
