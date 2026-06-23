package handlers_test

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/kimbal/srijan/api/internal/models"
)

func TestSubmitProposal_Success(t *testing.T) {
	db := seededDB(t)
	r := newRouter(db)

	var before models.Opportunity
	db.First(&before, 1)

	body := `{
		"why": "I led a similar automation last quarter.",
		"experience": "4 yrs payments + k8s",
		"weeklyHours": 8,
		"authorName": "Arjun Bose"
	}`
	w := do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", body)
	if w.Code != http.StatusCreated {
		t.Fatalf("status = %d, want 201; body=%s", w.Code, w.Body.String())
	}
	var p models.Proposal
	if err := json.Unmarshal(w.Body.Bytes(), &p); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if p.ID == 0 || p.OpportunityID != 1 {
		t.Errorf("got id=%d oppID=%d", p.ID, p.OpportunityID)
	}
	if p.Status != "submitted" {
		t.Errorf("status = %q, want submitted", p.Status)
	}
	if p.AuthorName != "Arjun Bose" || p.WeeklyHours != 8 {
		t.Errorf("author/hours mismatch: %q %d", p.AuthorName, p.WeeklyHours)
	}

	// The opportunity proposal count is incremented by one.
	var after models.Opportunity
	db.First(&after, 1)
	if after.Proposals != before.Proposals+1 {
		t.Errorf("opportunity proposals = %d, want %d", after.Proposals, before.Proposals+1)
	}
}

func TestSubmitProposal_Defaults(t *testing.T) {
	r := newRouter(seededDB(t))

	// Empty author + zero hours → handler applies defaults.
	w := do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", `{"why":"keen"}`)
	if w.Code != http.StatusCreated {
		t.Fatalf("status = %d, want 201", w.Code)
	}
	var p models.Proposal
	_ = json.Unmarshal(w.Body.Bytes(), &p)
	if p.AuthorName != "Shivam Kumar" {
		t.Errorf("default author = %q", p.AuthorName)
	}
	if p.WeeklyHours != 6 {
		t.Errorf("default weeklyHours = %d, want 6", p.WeeklyHours)
	}
}

func TestSubmitProposal_OpportunityNotFound(t *testing.T) {
	r := newRouter(seededDB(t))

	w := do(r, http.MethodPost, "/api/v1/opportunities/9999/proposals", `{"why":"x"}`)
	if w.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want 404", w.Code)
	}
}

func TestSubmitProposal_MalformedJSON(t *testing.T) {
	r := newRouter(seededDB(t))

	w := do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", `{bad`)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400", w.Code)
	}
}

func TestListProposalsForOpportunity(t *testing.T) {
	r := newRouter(seededDB(t))

	// Submit two proposals.
	do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", `{"why":"first","authorName":"A"}`)
	do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", `{"why":"second","authorName":"B"}`)

	w := do(r, http.MethodGet, "/api/v1/opportunities/1/proposals", "")
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", w.Code)
	}
	var ps []models.Proposal
	if err := json.Unmarshal(w.Body.Bytes(), &ps); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(ps) != 2 {
		t.Fatalf("len = %d, want 2", len(ps))
	}
	// Ordered by id desc — most recent first.
	if ps[0].AuthorName != "B" {
		t.Errorf("first author = %q, want B (desc order)", ps[0].AuthorName)
	}
}

func TestListProposals_EmptyForUnknownOpportunity(t *testing.T) {
	r := newRouter(seededDB(t))

	w := do(r, http.MethodGet, "/api/v1/opportunities/4242/proposals", "")
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", w.Code)
	}
	var ps []models.Proposal
	_ = json.Unmarshal(w.Body.Bytes(), &ps)
	if len(ps) != 0 {
		t.Errorf("len = %d, want 0", len(ps))
	}
}

func TestListAllProposals_EnrichedWithOpportunity(t *testing.T) {
	r := newRouter(seededDB(t))

	do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", `{"why":"x","authorName":"Asha"}`)
	do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", `{"why":"y","authorName":"Bala"}`)

	w := do(r, http.MethodGet, "/api/v1/proposals", "")
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200; body=%s", w.Code, w.Body.String())
	}
	var rows []struct {
		AuthorName       string `json:"authorName"`
		Status           string `json:"status"`
		OpportunityTitle string `json:"opportunityTitle"`
		OpportunityType  string `json:"opportunityType"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &rows); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if len(rows) != 2 {
		t.Fatalf("len = %d, want 2", len(rows))
	}
	// Newest first, and joined with the opportunity.
	if rows[0].AuthorName != "Bala" {
		t.Errorf("first author = %q, want Bala", rows[0].AuthorName)
	}
	if rows[0].OpportunityTitle == "" || rows[0].OpportunityType != "automation" {
		t.Errorf("join failed: title=%q type=%q", rows[0].OpportunityTitle, rows[0].OpportunityType)
	}
}

func TestListAllProposals_FilterByAuthor(t *testing.T) {
	r := newRouter(seededDB(t))

	do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", `{"why":"x","authorName":"Asha"}`)
	do(r, http.MethodPost, "/api/v1/opportunities/1/proposals", `{"why":"y","authorName":"Bala"}`)

	w := do(r, http.MethodGet, "/api/v1/proposals?author=Asha", "")
	var rows []map[string]any
	_ = json.Unmarshal(w.Body.Bytes(), &rows)
	if len(rows) != 1 {
		t.Fatalf("len = %d, want 1", len(rows))
	}
	if rows[0]["authorName"] != "Asha" {
		t.Errorf("author = %v, want Asha", rows[0]["authorName"])
	}
}
