package store

import (
	"github.com/kimbal/srijan/api/internal/models"
	"gorm.io/gorm"
)

// Seed loads the Srijan demo dataset once (idempotent: skips if rows exist).
func Seed(db *gorm.DB) error {
	var n int64
	db.Model(&models.Opportunity{}).Count(&n)
	if n > 0 {
		return nil
	}

	opps := []models.Opportunity{
		{Type: "automation", Title: "Automate Kubernetes Cost Reporting",
			Desc:     "Build a pipeline that pulls per-namespace spend from the K8s cost exporter and posts a weekly Grafana digest to Slack.",
			LongDesc: "Engineering leadership wants visibility into per-team Kubernetes spend without manual spreadsheet work. Build a scheduled job that reads from the existing cost exporter, aggregates spend by namespace and team, and publishes a weekly Grafana snapshot plus a Slack digest with week-over-week deltas. Bonus: flag namespaces trending >15% over budget.",
			Skills:   models.StringSlice{"Python", "Kubernetes", "Grafana", "Slack API"}, Match: 92, Days: 21, Team: "3 / 10", Proposals: 7,
			OwnerName: "Ananya Rao", OwnerDept: "Platform Engineering", OwnerInit: "AR",
			RewardBig: "₹10,000", RewardLabel: "cash + promotion points", MatchPct: "92% fit",
			RewardChips: models.StringSlice{"₹10,000 cash reward", "₹15,000 project budget", "+50 promotion points"},
			Roles: []models.Role{{Name: "Project Lead", Status: "filled", Slots: "1 / 1"}, {Name: "Developer", Status: "open", Slots: "2 / 4"}, {Name: "Reviewer", Status: "open", Slots: "0 / 2"}, {Name: "Documentation", Status: "open", Slots: "0 / 3"}}},

		{Type: "innovation", Title: "AI Ticket Triage Agent",
			Desc:     "Prototype an LLM agent that auto-classifies and routes incoming support tickets, cutting first-response time.",
			LongDesc: "Support volume has doubled. Design and prototype an LLM-based agent that classifies inbound tickets by product area, urgency and intent, then routes them to the right queue with a suggested first reply. Must run on internal infra, log its reasoning, and degrade gracefully to human triage. Judged on accuracy, latency and reduction in mean first-response time.",
			Skills:   models.StringSlice{"Python", "LLMs", "FastAPI", "LangGraph"}, Match: 88, Days: 30, Team: "1 / 5", Proposals: 23,
			OwnerName: "Office of the CTO", OwnerDept: "Leadership", OwnerInit: "CTO",
			RewardBig: "₹50,000", RewardLabel: "prize pool · winner takes most", MatchPct: "88% fit",
			RewardChips: models.StringSlice{"₹50,000 prize pool", "+75 promotion points", "Fast-track to AI guild"},
			Roles: []models.Role{{Name: "Project Lead", Status: "open", Slots: "0 / 1"}, {Name: "ML Engineer", Status: "open", Slots: "1 / 2"}, {Name: "Developer", Status: "open", Slots: "0 / 2"}}},

		{Type: "cost", Title: "Reduce AWS Spend by 20%",
			Desc:     "Identify and implement savings across compute, storage and idle resources without impacting reliability.",
			LongDesc: "FinOps is targeting a 20% reduction in AWS spend this half. Audit current usage, find idle and over-provisioned resources, propose right-sizing and savings-plan strategies, and implement the safe wins. All changes must pass reliability review. Reward scales with verified annualized savings.",
			Skills:   models.StringSlice{"AWS", "FinOps", "Terraform", "CloudWatch"}, Match: 71, Days: 30, Team: "2 / 6", Proposals: 12,
			OwnerName: "Vikram Nair", OwnerDept: "FinOps", OwnerInit: "VN",
			RewardBig: "₹50,000", RewardLabel: "reward + impact bonus", MatchPct: "71% fit",
			RewardChips: models.StringSlice{"₹50,000 base reward", "+150 pts if savings >₹1 Cr/yr", "Spot award eligible"},
			Roles: []models.Role{{Name: "Project Lead", Status: "filled", Slots: "1 / 1"}, {Name: "Cloud Engineer", Status: "open", Slots: "1 / 3"}, {Name: "Reviewer", Status: "open", Slots: "0 / 2"}}},

		{Type: "docs", Title: "Internal Docs Portal Revamp",
			Desc:     "Migrate scattered Confluence pages into a searchable Docusaurus portal with ownership and freshness signals.",
			LongDesc: "Our docs are spread across Confluence with no ownership or freshness tracking. Stand up a Docusaurus portal, migrate the top 50 most-visited pages, add per-page owners and a \"last verified\" signal, and wire full-text search. Great for someone who wants visibility with DevEx and a writing-heavy portfolio piece.",
			Skills:   models.StringSlice{"React", "Docusaurus", "Tech Writing"}, Match: 79, Days: 18, Team: "2 / 4", Proposals: 5,
			OwnerName: "Meera Iyer", OwnerDept: "Developer Experience", OwnerInit: "MI",
			RewardBig: "30 pts", RewardLabel: "promotion points + learning credits", MatchPct: "79% fit",
			RewardChips: models.StringSlice{"+30 promotion points", "₹8,000 learning credits", "Conference budget"},
			Roles: []models.Role{{Name: "Project Lead", Status: "filled", Slots: "1 / 1"}, {Name: "Developer", Status: "filled", Slots: "1 / 1"}, {Name: "Tech Writer", Status: "open", Slots: "0 / 2"}}},

		{Type: "techdebt", Title: "Terraform Module Library",
			Desc:     "Consolidate copy-pasted Terraform into a versioned, documented internal module registry.",
			LongDesc: "Every team re-implements the same Terraform. Build a versioned internal module registry for the 6 most-duplicated patterns (VPC, RDS, EKS node groups, S3 buckets, IAM roles, ALB), with docs and examples. Reduces drift and onboarding time across the org.",
			Skills:   models.StringSlice{"Terraform", "AWS", "CI/CD"}, Match: 84, Days: 25, Team: "1 / 4", Proposals: 9,
			OwnerName: "Rahul Deshpande", OwnerDept: "Platform Engineering", OwnerInit: "RD",
			RewardBig: "₹8,000", RewardLabel: "cash + promotion points", MatchPct: "84% fit",
			RewardChips: models.StringSlice{"₹8,000 cash reward", "+40 promotion points", "Reuse-count bonus"},
			Roles: []models.Role{{Name: "Project Lead", Status: "open", Slots: "0 / 1"}, {Name: "Developer", Status: "open", Slots: "1 / 2"}, {Name: "Reviewer", Status: "open", Slots: "0 / 1"}}},

		{Type: "transfer", Title: "DevOps Engineer — Internal Transfer",
			Desc:     "Platform Engineering is hiring internally. Own CI/CD, IaC and on-call for the payments domain.",
			LongDesc: "Platform Engineering has an open req and wants to fill it internally before going external. You'd own CI/CD pipelines, infrastructure-as-code and the on-call rotation for the payments domain. This is a lateral move with a band review — ideal if you want to go deeper on infra. Apply with your Srijan portfolio attached.",
			Skills:   models.StringSlice{"Kubernetes", "Terraform", "Go"}, Match: 86, Days: 14, Team: "0 / 1", Proposals: 4,
			OwnerName: "Ananya Rao", OwnerDept: "Platform Engineering", OwnerInit: "AR",
			RewardBig: "Lateral", RewardLabel: "internal move + band review", MatchPct: "86% fit",
			RewardChips: models.StringSlice{"Internal role change", "Band review on offer", "No external interview loop"},
			Roles: []models.Role{{Name: "DevOps Engineer", Status: "open", Slots: "0 / 1"}}},
	}

	return db.Create(&opps).Error
}
