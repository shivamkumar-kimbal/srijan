package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Profile returns the current employee's talent profile (demo data).
func Profile(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"name": "Shivam Kumar", "title": "Senior Backend Engineer · Payments · 4 yrs",
		"initials": "SK", "status": "Promotion-ready", "promotionReadiness": 82,
		"certs": []string{"CKA", "AWS SA-Pro", "+2"},
		"stats": []gin.H{
			{"label": "Gig Points", "value": "1,240", "sub": "top 6% in org", "color": "#9A6E1A"},
			{"label": "Reputation", "value": "4.8", "sub": "from 32 reviews", "color": "#1C1B1A"},
			{"label": "Innovation Score", "value": "720", "sub": "+120 this quarter", "color": "#8B3FD1"},
			{"label": "Leadership Score", "value": "540", "sub": "4 projects led", "color": "#5046E5"},
		},
		"skills": []gin.H{
			{"name": "Python", "level": "Expert", "pct": "92%"},
			{"name": "PostgreSQL", "level": "Advanced", "pct": "85%"},
			{"name": "System Design", "level": "Advanced", "pct": "80%"},
			{"name": "Go", "level": "Proficient", "pct": "78%"},
			{"name": "Kubernetes", "level": "Proficient", "pct": "70%"},
			{"name": "LLMs / RAG", "level": "Working", "pct": "55%"},
		},
		"depts": []string{"Platform Engineering", "FinOps", "Developer Experience", "Data", "Payments"},
		"completedProjects": []gin.H{
			{"title": "Payments Reconciliation Automation", "meta": "Project Lead · saved ~480 engineer-hrs/yr", "points": "+150 pts"},
			{"title": "Idempotency Client Library", "meta": "Project Lead · reused by 6 teams", "points": "+90 pts"},
			{"title": "Latency SLO Dashboards", "meta": "Developer · adopted org-wide", "points": "+60 pts"},
		},
		"reviews": []gin.H{
			{"text": "Shivam unblocked our migration in a day — genuinely deep Kubernetes knowledge and very generous with his time.", "author": "Ananya R., Platform Engineering"},
			{"text": "Clear communicator who raised the bar on our code review culture. Would pull onto any team.", "author": "Meera I., Developer Experience"},
		},
	})
}

// Insights returns leadership/executive analytics (demo data).
func Insights(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"kpis": []gin.H{
			{"label": "Cost Saved (FY26)", "value": "₹2.4 Cr", "delta": "↑ 18%", "up": true, "sub": "vs ₹2.0 Cr last year"},
			{"label": "Engineer-hours Saved", "value": "38,500", "delta": "↑ 24%", "up": true, "sub": "reclaimed via automation"},
			{"label": "Internal Mobility", "value": "64", "delta": "↑ 22%", "up": true, "sub": "role moves without external hire"},
			{"label": "Innovation Index", "value": "7.8", "delta": "↑ 0.6", "up": true, "sub": "out of 10 · pulse survey"},
			{"label": "Automations Delivered", "value": "142", "delta": "↑ 31%", "up": true, "sub": "shipped & in production"},
			{"label": "Cross-team Gigs", "value": "312", "delta": "↑ 19%", "up": true, "sub": "collaborations this year"},
		},
		"costBars": []gin.H{
			{"label": "Cloud / Infra optimization", "value": "₹1.1 Cr", "pct": "100%"},
			{"label": "Process automation", "value": "₹78 L", "pct": "71%"},
			{"label": "Avoided external hiring", "value": "₹42 L", "pct": "38%"},
			{"label": "Tooling consolidation", "value": "₹19 L", "pct": "17%"},
		},
		"performers": []gin.H{
			{"rank": "01", "name": "Priya Menon", "meta": "Data · 8 gigs led", "points": "2,180", "initials": "PM", "ai": 3},
			{"rank": "02", "name": "Shivam Kumar", "meta": "Payments · 6 gigs", "points": "1,240", "initials": "SK", "ai": 1},
			{"rank": "03", "name": "Arjun Bose", "meta": "Security · 5 gigs", "points": "1,090", "initials": "AB", "ai": 2},
			{"rank": "04", "name": "Neha Kulkarni", "meta": "DevEx · 7 gigs", "points": "980", "initials": "NK", "ai": 0},
		},
	})
}

// Board returns the kanban for the active project (demo data).
func Board(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"project": gin.H{"title": "Automate Kubernetes Cost Reporting", "lead": "Ananya Rao", "role": "Developer", "due": "18 days"},
		"teamAvatars": []gin.H{
			{"initials": "AR", "i": 0}, {"initials": "SK", "i": 1}, {"initials": "RV", "i": 2}, {"initials": "MI", "i": 3}, {"initials": "PT", "i": 4},
		},
		"columns": []gin.H{
			{"name": "Backlog", "dot": "#B5B3AA", "tasks": []gin.H{
				{"id": "SRJ-12", "title": "Audit cost-exporter metrics & labels", "tag": "Research", "tagColor": "#5B5A55", "assignee": "AR", "ai": 0},
				{"id": "SRJ-15", "title": "Define Slack digest message format", "tag": "Design", "tagColor": "#8B3FD1", "assignee": "SK", "ai": 1}}},
			{"name": "In Progress", "dot": "#5046E5", "tasks": []gin.H{
				{"id": "SRJ-09", "title": "Build namespace spend aggregator", "tag": "Python", "tagColor": "#5046E5", "assignee": "SK", "ai": 1},
				{"id": "SRJ-11", "title": "Grafana dashboard panels", "tag": "Grafana", "tagColor": "#B07F1E", "assignee": "PT", "ai": 4}}},
			{"name": "Review", "dot": "#B07F1E", "tasks": []gin.H{
				{"id": "SRJ-07", "title": "Cost query optimization PR", "tag": "Review", "tagColor": "#C2552E", "assignee": "RV", "ai": 2}}},
			{"name": "Testing", "dot": "#2A6FDB", "tasks": []gin.H{
				{"id": "SRJ-05", "title": "Slack webhook integration", "tag": "QA", "tagColor": "#2A6FDB", "assignee": "MI", "ai": 3}}},
			{"name": "Completed", "dot": "#1F8A5B", "tasks": []gin.H{
				{"id": "SRJ-02", "title": "Repo + CI scaffolding", "tag": "Done", "tagColor": "#1F8A5B", "assignee": "SK", "ai": 1},
				{"id": "SRJ-01", "title": "Access to cost exporter", "tag": "Done", "tagColor": "#1F8A5B", "assignee": "AR", "ai": 0}}},
		},
	})
}
