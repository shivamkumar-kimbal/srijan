package handlers_test

import (
	"encoding/json"
	"net/http"
	"testing"
)

func TestProfile(t *testing.T) {
	r := newRouter(newTestDB(t))

	w := do(r, http.MethodGet, "/api/v1/profile", "")
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", w.Code)
	}
	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body["name"] != "Shivam Kumar" {
		t.Errorf("name = %v", body["name"])
	}
	for _, key := range []string{"stats", "skills", "completedProjects", "reviews"} {
		if _, ok := body[key]; !ok {
			t.Errorf("missing key %q in profile", key)
		}
	}
}

func TestInsights(t *testing.T) {
	r := newRouter(newTestDB(t))

	w := do(r, http.MethodGet, "/api/v1/insights", "")
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", w.Code)
	}
	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	kpis, ok := body["kpis"].([]any)
	if !ok || len(kpis) != 6 {
		t.Errorf("kpis = %v, want 6 entries", body["kpis"])
	}
	if _, ok := body["costBars"]; !ok {
		t.Error("missing costBars")
	}
	if _, ok := body["performers"]; !ok {
		t.Error("missing performers")
	}
}

func TestBoard(t *testing.T) {
	r := newRouter(newTestDB(t))

	w := do(r, http.MethodGet, "/api/v1/board", "")
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", w.Code)
	}
	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if _, ok := body["project"]; !ok {
		t.Error("missing project")
	}
	cols, ok := body["columns"].([]any)
	if !ok || len(cols) != 5 {
		t.Errorf("columns = %v, want 5 kanban columns", body["columns"])
	}
}
