package store

import (
	"github.com/kimbal/srijan/api/internal/models"
	"gorm.io/gorm"
)

// Seed loads a demo marketplace dataset (idempotent: skips if rows exist) so that
// every surface — Explore, Automation Hub, Internal Jobs, Dashboard — has content.
func Seed(db *gorm.DB) error {
	var n int64
	db.Model(&models.Opportunity{}).Count(&n)
	if n > 0 {
		return nil
	}

	opps := []models.Opportunity{
		{
			Type:        "automation",
			Title:       "Automate Kubernetes Cost Reporting",
			Desc:        "Build a Slack digest of namespace-level cloud spend, refreshed daily.",
			LongDesc:    "Our cloud bill grew 40% YoY with little visibility per team. Build a job that reads the cost-exporter metrics, aggregates spend by namespace, and posts a daily Slack digest with week-over-week deltas and the top movers. Bonus: a Grafana panel set teams can self-serve.",
			Skills:      models.StringSlice{"Python", "Kubernetes", "Grafana", "Slack API"},
			Match:       88,
			Days:        18,
			Team:        "2 / 5",
			Proposals:   4,
			OwnerName:   "Ananya Rao",
			OwnerDept:   "Platform Engineering",
			OwnerInit:   "AR",
			RewardBig:   "₹40,000",
			RewardLabel: "cash + 150 gig points",
			MatchPct:    "88% fit",
			RewardChips: models.StringSlice{"₹40,000 cash", "150 gig points", "Project-lead credit"},
			Roles: []models.Role{
				{Name: "Project Lead", Status: "filled", Slots: "1 / 1"},
				{Name: "Backend Developer", Status: "open", Slots: "1 / 2"},
				{Name: "Dashboards", Status: "open", Slots: "0 / 2"},
			},
		},
		{
			Type:        "innovation",
			Title:       "AI PR-Review Assistant",
			Desc:        "An LLM agent that summarises diffs and flags risky changes on every PR.",
			LongDesc:    "Pitch and prototype an internal GitHub bot that uses an LLM to summarise pull-request diffs, surface likely regressions, and nudge reviewers toward the riskiest files. Judged at the quarterly innovation demo day.",
			Skills:      models.StringSlice{"Go", "LLMs / RAG", "GitHub Actions"},
			Match:       82,
			Days:        25,
			Team:        "1 / 4",
			Proposals:   7,
			OwnerName:   "Priya Menon",
			OwnerDept:   "Data & Analytics",
			OwnerInit:   "PM",
			RewardBig:   "₹75,000",
			RewardLabel: "innovation prize pool",
			MatchPct:    "82% fit",
			RewardChips: models.StringSlice{"₹75,000 prize", "Demo-day spotlight", "200 innovation points"},
			Roles: []models.Role{
				{Name: "Tech Lead", Status: "filled", Slots: "1 / 1"},
				{Name: "ML Engineer", Status: "open", Slots: "0 / 2"},
				{Name: "Frontend", Status: "open", Slots: "0 / 1"},
			},
		},
		{
			Type:        "cost",
			Title:       "Reduce Staging Cloud Spend by 30%",
			Desc:        "Right-size and schedule non-prod workloads to cut idle infrastructure cost.",
			LongDesc:    "Non-prod environments run 24/7 at production sizing. Audit staging workloads, introduce autoscaling and off-hours shutdown, and prove a measurable monthly saving. Savings are tracked toward the FinOps target.",
			Skills:      models.StringSlice{"AWS", "Terraform", "FinOps"},
			Match:       79,
			Days:        30,
			Team:        "0 / 3",
			Proposals:   2,
			OwnerName:   "Rohit Verma",
			OwnerDept:   "Cloud Operations",
			OwnerInit:   "RV",
			RewardBig:   "₹30,000",
			RewardLabel: "cash + savings bonus",
			MatchPct:    "79% fit",
			RewardChips: models.StringSlice{"₹30,000 cash", "1% of verified savings", "100 gig points"},
			Roles: []models.Role{
				{Name: "FinOps Lead", Status: "open", Slots: "0 / 1"},
				{Name: "Infra Engineer", Status: "open", Slots: "0 / 2"},
			},
		},
		{
			Type:        "techdebt",
			Title:       "Migrate Legacy Payments Service to Go 1.26",
			Desc:        "Modernise a critical service, remove deprecated deps, and add CI coverage.",
			LongDesc:    "The payments-gateway service is two major Go versions behind and has flaky tests. Upgrade the toolchain, replace deprecated libraries, raise test coverage above 70%, and document the rollout. High-trust work on a tier-1 service.",
			Skills:      models.StringSlice{"Go", "PostgreSQL", "CI/CD"},
			Match:       91,
			Days:        21,
			Team:        "1 / 3",
			Proposals:   5,
			OwnerName:   "Meera Iyer",
			OwnerDept:   "Payments",
			OwnerInit:   "MI",
			RewardBig:   "₹35,000",
			RewardLabel: "cash + 120 gig points",
			MatchPct:    "91% fit",
			RewardChips: models.StringSlice{"₹35,000 cash", "120 gig points", "Tier-1 service credit"},
			Roles: []models.Role{
				{Name: "Migration Lead", Status: "filled", Slots: "1 / 1"},
				{Name: "Backend Developer", Status: "open", Slots: "0 / 2"},
			},
		},
		{
			Type:        "docs",
			Title:       "Write the Internal Platform Onboarding Guide",
			Desc:        "Author a clear getting-started guide for engineers joining the platform team.",
			LongDesc:    "New joiners take weeks to become productive on our platform tooling. Produce a concise, example-driven onboarding guide covering local setup, deploy flow, and on-call basics. Reviewed by three senior engineers before publishing.",
			Skills:      models.StringSlice{"Technical Writing", "Kubernetes", "Developer Experience"},
			Match:       73,
			Days:        14,
			Team:        "0 / 2",
			Proposals:   1,
			OwnerName:   "Neha Kulkarni",
			OwnerDept:   "Developer Experience",
			OwnerInit:   "NK",
			RewardBig:   "₹15,000",
			RewardLabel: "cash + 60 gig points",
			MatchPct:    "73% fit",
			RewardChips: models.StringSlice{"₹15,000 cash", "60 gig points", "Published author credit"},
			Roles: []models.Role{
				{Name: "Lead Author", Status: "open", Slots: "0 / 1"},
				{Name: "Reviewer / Editor", Status: "open", Slots: "0 / 1"},
			},
		},
		{
			Type:        "transfer",
			Title:       "SRE Specialist — Cloud Operations (Pune)",
			Desc:        "6-month internal rotation into the SRE team with a path to permanent transfer.",
			LongDesc:    "Cloud Operations is opening a rotation for an engineer keen to go deep on reliability: incident response, SLOs, and automation. Starts as a 6-month assignment with the option to convert to a permanent internal transfer. Mentorship from the on-call leads included.",
			Skills:      models.StringSlice{"Kubernetes", "Observability", "Incident Response"},
			Match:       76,
			Days:        45,
			Team:        "0 / 1",
			Proposals:   3,
			OwnerName:   "Arjun Bose",
			OwnerDept:   "Cloud Operations",
			OwnerInit:   "AB",
			RewardBig:   "Internal move",
			RewardLabel: "rotation + transfer path",
			MatchPct:    "76% fit",
			RewardChips: models.StringSlice{"6-month rotation", "Transfer option", "On-call mentorship"},
			Roles: []models.Role{
				{Name: "SRE Specialist", Status: "open", Slots: "0 / 1"},
			},
		},
	}

	return db.Create(&opps).Error
}
