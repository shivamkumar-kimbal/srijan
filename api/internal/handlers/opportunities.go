package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kimbal/srijan/api/internal/models"
	"gorm.io/gorm"
)

type OpportunityHandler struct{ DB *gorm.DB }

// List returns opportunities, optionally filtered by ?type=automation.
func (h OpportunityHandler) List(c *gin.Context) {
	var opps []models.Opportunity
	q := h.DB.Preload("Roles").Order("id asc")
	if t := c.Query("type"); t != "" && t != "all" {
		q = q.Where("type = ?", t)
	}
	if err := q.Find(&opps).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, opps)
}

// Get returns a single opportunity with roles.
func (h OpportunityHandler) Get(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var o models.Opportunity
	if err := h.DB.Preload("Roles").First(&o, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, o)
}

type createOppReq struct {
	Type        string              `json:"type" binding:"required"`
	Title       string              `json:"title" binding:"required"`
	Desc        string              `json:"desc"`
	LongDesc    string              `json:"longDesc"`
	Skills      models.StringSlice  `json:"skills"`
	Days        int                 `json:"days"`
	Team        string              `json:"team"`
	OwnerName   string              `json:"ownerName"`
	OwnerDept   string              `json:"ownerDept"`
	OwnerInit   string              `json:"ownerInitials"`
	RewardBig   string              `json:"rewardBig"`
	RewardLabel string              `json:"rewardLabel"`
	RewardChips models.StringSlice  `json:"rewardChips"`
}

// Create posts a new opportunity.
func (h OpportunityHandler) Create(c *gin.Context) {
	var r createOppReq
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	o := models.Opportunity{
		Type: r.Type, Title: r.Title, Desc: r.Desc, LongDesc: r.LongDesc,
		Skills: r.Skills, Days: r.Days, Team: r.Team, Match: 75,
		OwnerName: r.OwnerName, OwnerDept: r.OwnerDept, OwnerInit: r.OwnerInit,
		RewardBig: r.RewardBig, RewardLabel: r.RewardLabel, MatchPct: "75% fit",
		RewardChips: r.RewardChips,
	}
	if err := h.DB.Create(&o).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, o)
}
