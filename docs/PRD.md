# Srijan — Product Requirements Document

## Problem

In large orgs: employee skills stay invisible; teams lack bandwidth for automation/AI/docs/
migrations; internal openings are hard to discover; good ideas die unexecuted; employees
want income, recognition, leadership and internal growth they can't easily find.

## Goal

A structured internal marketplace where opportunities and talent find each other —
unlocking hidden talent, cross-functional collaboration, automation velocity, retention,
and internal career growth.

**Mission:** turn employees from job-holders into creators, builders, mentors, leaders.
**Tagline:** "Where Ideas Become Impact."

## Target users

Employees, Project Owners, Managers, Leadership/Admin (see `PLAN.md` §2 for permissions).

## User stories (MVP)

- As an **employee** I can browse opportunities filtered by type and see my skill-match %.
- As an **employee** I can open an opportunity and submit a proposal (why, experience, weekly hours).
- As an **employee** I can track projects I joined on a kanban board.
- As an **employee** I can view my talent profile (skills, reputation, completed work, earnings).
- As a **project owner** I can post an opportunity and review incoming proposals.
- As **leadership** I can view org-wide impact analytics (cost saved, mobility, innovation index).

## Success metrics

| Metric | Target (year 1) |
|--------|-----------------|
| Cost saved via automations/optimizations | ≥ ₹2 Cr |
| Engineer-hours reclaimed | ≥ 30,000 |
| Internal mobility (moves w/o external hire) | ≥ 50 |
| Active monthly participants | ≥ 25% of eng org |
| Median proposal → team-selection time | < 7 days |
| Retention lift among active participants | measurable +ve |

## Scope (MVP)

Opportunity marketplace, proposal flow, team kanban, talent profile, leadership insights,
Azure AD auth, role-based access, deploy to K8s.

## Non-goals (MVP)

- External/public marketplace (internal only).
- Payroll/HRIS integration beyond identity.
- Native mobile apps (responsive web only).
- Real-money escrow (rewards tracked as points/credits, settled out-of-band).
- Full AI matching ML model (start with heuristic scoring).

## Constraints

Enterprise SSO mandatory (Entra ID); data residency per org policy; runs on internal infra
(K8s); auditability of rewards and approvals.
