package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kimbal/srijan/api/internal/models"
	"gorm.io/gorm"
)

type ProposalHandler struct{ DB *gorm.DB }

type submitReq struct {
	Why         string `json:"why"`
	Experience  string `json:"experience"`
	WeeklyHours int    `json:"weeklyHours"`
	AuthorName  string `json:"authorName"`
}

// Submit creates a proposal against an opportunity and bumps its proposal count.
func (h ProposalHandler) Submit(c *gin.Context) {
	oppID, _ := strconv.Atoi(c.Param("id"))
	var o models.Opportunity
	if err := h.DB.First(&o, oppID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "opportunity not found"})
		return
	}
	var r submitReq
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if r.AuthorName == "" {
		r.AuthorName = "Shivam Kumar"
	}
	if r.WeeklyHours == 0 {
		r.WeeklyHours = 6
	}
	p := models.Proposal{
		OpportunityID: uint(oppID), AuthorName: r.AuthorName,
		Why: r.Why, Experience: r.Experience, WeeklyHours: r.WeeklyHours, Status: "submitted",
	}
	if err := h.DB.Create(&p).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	h.DB.Model(&o).UpdateColumn("proposals", o.Proposals+1)
	c.JSON(http.StatusCreated, p)
}

// ListForOpportunity returns proposals submitted to an opportunity (owner view).
func (h ProposalHandler) ListForOpportunity(c *gin.Context) {
	oppID, _ := strconv.Atoi(c.Param("id"))
	var ps []models.Proposal
	h.DB.Where("opportunity_id = ?", oppID).Order("id desc").Find(&ps)
	c.JSON(http.StatusOK, ps)
}

// proposalRow is a proposal enriched with its opportunity context for the
// "My Proposals" list view.
type proposalRow struct {
	models.Proposal
	OpportunityTitle string `json:"opportunityTitle"`
	OpportunityType  string `json:"opportunityType"`
}

// ListAll returns every proposal, newest first, joined with its opportunity.
// Optional ?author= filters to a single contributor (used by the My Proposals page).
func (h ProposalHandler) ListAll(c *gin.Context) {
	rows := []proposalRow{}
	q := h.DB.Table("proposals").
		Select("proposals.*, opportunities.title AS opportunity_title, opportunities.type AS opportunity_type").
		Joins("LEFT JOIN opportunities ON opportunities.id = proposals.opportunity_id").
		Order("proposals.id DESC")
	if a := c.Query("author"); a != "" {
		q = q.Where("proposals.author_name = ?", a)
	}
	if err := q.Scan(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rows)
}
