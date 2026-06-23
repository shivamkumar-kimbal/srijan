package config

import "os"

type Config struct {
	Port       string
	DBDriver   string // sqlite | postgres
	DSN        string
	JWTSecret  string
	CORSOrigin string

	// Azure AD (Entra ID). When both TenantID and ClientID (audience) are set,
	// JWT auth is enforced on the API via Entra JWKS validation. Otherwise auth
	// is disabled (dev mode) and the API is open.
	AzureTenantID string
	AzureClientID string
}

// AuthEnabled reports whether Entra ID token validation should be enforced.
func (c Config) AuthEnabled() bool {
	return c.AzureTenantID != "" && c.AzureClientID != ""
}

func Load() Config {
	return Config{
		Port:          env("PORT", "8080"),
		DBDriver:      env("DB_DRIVER", "sqlite"),
		DSN:           env("DATABASE_URL", "srijan.db"),
		JWTSecret:     env("JWT_SECRET", "dev-secret-change-me"),
		CORSOrigin:    env("CORS_ORIGIN", "http://localhost:3000"),
		AzureTenantID: env("AZURE_TENANT_ID", ""),
		AzureClientID: env("AZURE_CLIENT_ID", ""),
	}
}

func env(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
