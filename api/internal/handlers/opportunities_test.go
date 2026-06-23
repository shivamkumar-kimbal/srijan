package handlers_test

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/kimbal/srijan/api/internal/models"
)

func TestListOpportunities_Seeded(t *testing.T) {
	r := newRouter(seededDB(t))

	w := do(r, http.MethodGet, "/api/v1/opportunities", "")
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200; body=%s", w.Code, w.Body.String())
	}
	var got []models.Opportunity
	if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(got) != 6 {
		t.Fatalf("len = %d, want 6", len(got))
	}
	if got[0].Title == "" {
		t.Errorf("first opportunity has empty title")
	}
	if len(got[0].Roles) == 0 {
		t.Errorf("roles = %d, want > 0 (Preload should load roles)", len(got[0].Roles))
	}
}

func TestListOpportunities_FilterByType(t *testing.T) {
	r := newRouter(seededDB(t))

	// The demo dataset has one opportunity of each type — a matching filter returns it.
	w := do(r, http.MethodGet, "/api/v1/opportunities?type=automation", "")
	var match []models.Opportunity
	_ = json.Unmarshal(w.Body.Bytes(), &match)
	if len(match) != 1 {
		t.Fatalf("automation filter len = %d, want 1", len(match))
	}

	// A non-existent type returns an empty list.
	w = do(r, http.MethodGet, "/api/v1/opportunities?type=nonexistent", "")
	var none []models.Opportunity
	_ = json.Unmarshal(w.Body.Bytes(), &none)
	if len(none) != 0 {
		t.Fatalf("nonexistent filter len = %d, want 0", len(none))
	}

	// type=all behaves like no filter.
	w = do(r, http.MethodGet, "/api/v1/opportunities?type=all", "")
	var all []models.Opportunity
	_ = json.Unmarshal(w.Body.Bytes(), &all)
	if len(all) != 6 {
		t.Fatalf("all filter len = %d, want 6", len(all))
	}
}

func TestGetOpportunity_Found(t *testing.T) {
	r := newRouter(seededDB(t))

	w := do(r, http.MethodGet, "/api/v1/opportunities/1", "")
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", w.Code)
	}
	var o models.Opportunity
	if err := json.Unmarshal(w.Body.Bytes(), &o); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if o.ID != 1 || o.Title == "" {
		t.Errorf("got id=%d title=%q", o.ID, o.Title)
	}
}

func TestGetOpportunity_NotFound(t *testing.T) {
	r := newRouter(seededDB(t))

	w := do(r, http.MethodGet, "/api/v1/opportunities/9999", "")
	if w.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want 404", w.Code)
	}
}

func TestCreateOpportunity_Success(t *testing.T) {
	r := newRouter(newTestDB(t))

	body := `{
		"type": "innovation",
		"title": "AI Code Review Bot",
		"desc": "Automate PR reviews",
		"longDesc": "Build a bot that reviews PRs using an LLM.",
		"skills": ["Go", "LLMs"],
		"days": 21,
		"team": "0 / 4",
		"ownerName": "Priya Menon",
		"ownerDept": "Data",
		"ownerInitials": "PM",
		"rewardBig": "₹50,000",
		"rewardLabel": "innovation bonus",
		"rewardChips": ["Bonus", "Recognition"]
	}`
	w := do(r, http.MethodPost, "/api/v1/opportunities", body)
	if w.Code != http.StatusCreated {
		t.Fatalf("status = %d, want 201; body=%s", w.Code, w.Body.String())
	}
	var o models.Opportunity
	if err := json.Unmarshal(w.Body.Bytes(), &o); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if o.ID == 0 {
		t.Error("expected assigned ID")
	}
	if o.Title != "AI Code Review Bot" {
		t.Errorf("title = %q", o.Title)
	}
	// Defaults applied by the handler.
	if o.Match != 75 || o.MatchPct != "75% fit" {
		t.Errorf("defaults not applied: match=%d matchPct=%q", o.Match, o.MatchPct)
	}
	if len(o.Skills) != 2 {
		t.Errorf("skills = %v, want 2", o.Skills)
	}
}

func TestCreateOpportunity_ValidationError(t *testing.T) {
	r := newRouter(newTestDB(t))

	// Missing required "title" and "type".
	w := do(r, http.MethodPost, "/api/v1/opportunities", `{"desc":"no title"}`)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400", w.Code)
	}
}

func TestCreateOpportunity_MalformedJSON(t *testing.T) {
	r := newRouter(newTestDB(t))

	w := do(r, http.MethodPost, "/api/v1/opportunities", `{not json`)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400", w.Code)
	}
}
