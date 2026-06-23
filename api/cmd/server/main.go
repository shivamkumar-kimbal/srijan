package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kimbal/srijan/api/internal/config"
	"github.com/kimbal/srijan/api/internal/handlers"
	"github.com/kimbal/srijan/api/internal/store"
)

func main() {
	cfg := config.Load()

	db, err := store.Open(cfg)
	if err != nil {
		log.Fatalf("db open: %v", err)
	}
	if err := store.Seed(db); err != nil {
		log.Fatalf("seed: %v", err)
	}

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.CORSOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	opp := handlers.OpportunityHandler{DB: db}
	prop := handlers.ProposalHandler{DB: db}

	r.GET("/healthz", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status": "ok"}) })

	api := r.Group("/api/v1")
	{
		api.GET("/opportunities", opp.List)
		api.GET("/opportunities/:id", opp.Get)
		api.POST("/opportunities", opp.Create)
		api.GET("/opportunities/:id/proposals", prop.ListForOpportunity)
		api.POST("/opportunities/:id/proposals", prop.Submit)
		api.GET("/profile", handlers.Profile)
		api.GET("/insights", handlers.Insights)
		api.GET("/board", handlers.Board)
	}

	log.Printf("Srijan API listening on :%s (db=%s)", cfg.Port, cfg.DBDriver)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
