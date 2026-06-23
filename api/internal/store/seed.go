package store

import (
	"github.com/kimbal/srijan/api/internal/models"
	"gorm.io/gorm"
)

// Seed loads a single placeholder opportunity for testing (idempotent: skips if rows exist).
// Kept intentionally minimal — no demo dataset.
func Seed(db *gorm.DB) error {
	var n int64
	db.Model(&models.Opportunity{}).Count(&n)
	if n > 0 {
		return nil
	}

	test := models.Opportunity{
		Type:        "automation",
		Title:       "test",
		Desc:        "Test opportunity.",
		LongDesc:    "Placeholder opportunity used for local testing.",
		Skills:      models.StringSlice{"Test"},
		Match:       75,
		Days:        30,
		Team:        "0 / 5",
		Proposals:   0,
		OwnerName:   "Test User",
		OwnerDept:   "Engineering",
		OwnerInit:   "TU",
		RewardBig:   "₹0",
		RewardLabel: "test reward",
		MatchPct:    "75% fit",
		RewardChips: models.StringSlice{"Test reward"},
		Roles:       []models.Role{{Name: "Developer", Status: "open", Slots: "0 / 5"}},
	}

	return db.Create(&test).Error
}
