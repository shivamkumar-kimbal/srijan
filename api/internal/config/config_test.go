package config

import (
	"testing"
)

func TestLoad_Defaults(t *testing.T) {
	// Clear any env that would override defaults.
	for _, k := range []string{"PORT", "DB_DRIVER", "DATABASE_URL", "JWT_SECRET", "CORS_ORIGIN", "AZURE_TENANT_ID", "AZURE_CLIENT_ID"} {
		t.Setenv(k, "")
	}

	c := Load()
	if c.Port != "8080" {
		t.Errorf("Port = %q, want 8080", c.Port)
	}
	if c.DBDriver != "sqlite" {
		t.Errorf("DBDriver = %q, want sqlite", c.DBDriver)
	}
	if c.DSN != "srijan.db" {
		t.Errorf("DSN = %q, want srijan.db", c.DSN)
	}
	if c.CORSOrigin != "http://localhost:3000" {
		t.Errorf("CORSOrigin = %q", c.CORSOrigin)
	}
}

func TestLoad_EnvOverride(t *testing.T) {
	t.Setenv("PORT", "9090")
	t.Setenv("DB_DRIVER", "postgres")
	t.Setenv("DATABASE_URL", "postgres://x")

	c := Load()
	if c.Port != "9090" {
		t.Errorf("Port = %q, want 9090", c.Port)
	}
	if c.DBDriver != "postgres" {
		t.Errorf("DBDriver = %q, want postgres", c.DBDriver)
	}
	if c.DSN != "postgres://x" {
		t.Errorf("DSN = %q", c.DSN)
	}
}

func TestAuthEnabled(t *testing.T) {
	tests := []struct {
		name   string
		tenant string
		client string
		want   bool
	}{
		{"both set", "tenant", "client", true},
		{"tenant only", "tenant", "", false},
		{"client only", "", "client", false},
		{"neither", "", "", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := Config{AzureTenantID: tt.tenant, AzureClientID: tt.client}
			if got := c.AuthEnabled(); got != tt.want {
				t.Errorf("AuthEnabled() = %v, want %v", got, tt.want)
			}
		})
	}
}
