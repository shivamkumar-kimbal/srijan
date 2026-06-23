package store

import (
	"testing"

	"github.com/kimbal/srijan/api/internal/config"
	"github.com/kimbal/srijan/api/internal/models"
)

func TestOpen_SQLiteMigrates(t *testing.T) {
	cfg := config.Config{DBDriver: "sqlite", DSN: "file:open_test?mode=memory&cache=shared"}
	db, err := Open(cfg)
	if err != nil {
		t.Fatalf("Open: %v", err)
	}
	if !db.Migrator().HasTable(&models.Opportunity{}) {
		t.Error("opportunities table not migrated")
	}
	if !db.Migrator().HasTable(&models.Proposal{}) {
		t.Error("proposals table not migrated")
	}
	if !db.Migrator().HasTable(&models.Role{}) {
		t.Error("roles table not migrated")
	}
}

func TestSeed_Idempotent(t *testing.T) {
	cfg := config.Config{DBDriver: "sqlite", DSN: "file:seed_test?mode=memory&cache=shared"}
	db, err := Open(cfg)
	if err != nil {
		t.Fatalf("Open: %v", err)
	}

	if err := Seed(db); err != nil {
		t.Fatalf("first seed: %v", err)
	}
	if err := Seed(db); err != nil {
		t.Fatalf("second seed: %v", err)
	}

	var n int64
	db.Model(&models.Opportunity{}).Count(&n)
	if n != 6 {
		t.Errorf("opportunity count = %d, want 6 (seed must be idempotent)", n)
	}

	var roles int64
	db.Model(&models.Role{}).Count(&roles)
	if roles == 0 {
		t.Errorf("role count = %d, want > 0", roles)
	}
}
