package handlers_test

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/kimbal/srijan/api/internal/handlers"
	"github.com/kimbal/srijan/api/internal/models"
	"github.com/kimbal/srijan/api/internal/store"
	"gorm.io/gorm"
)

func init() { gin.SetMode(gin.TestMode) }

// newTestDB returns a fully isolated in-memory SQLite DB with the schema migrated.
// Each call gets its own database (single shared connection) so autoincrement IDs
// and rows never leak between tests.
func newTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("open in-memory db: %v", err)
	}
	sqlDB, err := db.DB()
	if err != nil {
		t.Fatalf("db handle: %v", err)
	}
	// A plain :memory: db lives only for the life of a single connection — pin the
	// pool to one connection so every query hits the same database.
	sqlDB.SetMaxOpenConns(1)
	t.Cleanup(func() { sqlDB.Close() })

	if err := db.AutoMigrate(&models.Opportunity{}, &models.Role{}, &models.Proposal{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	return db
}

// seededDB returns a DB pre-loaded with the single seed opportunity.
func seededDB(t *testing.T) *gorm.DB {
	t.Helper()
	db := newTestDB(t)
	if err := store.Seed(db); err != nil {
		t.Fatalf("seed: %v", err)
	}
	return db
}

// newRouter wires the same routes as cmd/server (auth disabled) for testing.
func newRouter(db *gorm.DB) *gin.Engine {
	r := gin.New()
	opp := handlers.OpportunityHandler{DB: db}
	prop := handlers.ProposalHandler{DB: db}

	api := r.Group("/api/v1")
	api.GET("/opportunities", opp.List)
	api.GET("/opportunities/:id", opp.Get)
	api.POST("/opportunities", opp.Create)
	api.GET("/opportunities/:id/proposals", prop.ListForOpportunity)
	api.POST("/opportunities/:id/proposals", prop.Submit)
	api.GET("/proposals", prop.ListAll)
	api.GET("/profile", handlers.Profile)
	api.GET("/insights", handlers.Insights)
	api.GET("/board", handlers.Board)
	return r
}

// do performs an in-process request against the router and returns the recorder.
func do(r *gin.Engine, method, path, body string) *httptest.ResponseRecorder {
	rdr := httptest.NewRecorder()
	var req *http.Request
	if body != "" {
		req = httptest.NewRequest(method, path, strings.NewReader(body))
	} else {
		req = httptest.NewRequest(method, path, nil)
	}
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(rdr, req)
	return rdr
}
