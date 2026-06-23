package store

import (
	"github.com/kimbal/srijan/api/internal/config"
	"github.com/kimbal/srijan/api/internal/models"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Open(cfg config.Config) (*gorm.DB, error) {
	var dialector gorm.Dialector
	if cfg.DBDriver == "postgres" {
		dialector = postgres.Open(cfg.DSN)
	} else {
		dialector = sqlite.Open(cfg.DSN)
	}
	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		return nil, err
	}
	if err := db.AutoMigrate(&models.Opportunity{}, &models.Role{}, &models.Proposal{}); err != nil {
		return nil, err
	}
	return db, nil
}
