package config

import "os"

type Config struct {
	Port      string
	DBDriver  string // sqlite | postgres
	DSN       string
	JWTSecret string
	CORSOrigin string
}

func Load() Config {
	return Config{
		Port:       env("PORT", "8080"),
		DBDriver:   env("DB_DRIVER", "sqlite"),
		DSN:        env("DATABASE_URL", "srijan.db"),
		JWTSecret:  env("JWT_SECRET", "dev-secret-change-me"),
		CORSOrigin: env("CORS_ORIGIN", "http://localhost:3000"),
	}
}

func env(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
