package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// EntraValidator validates Microsoft Entra ID (Azure AD) access tokens against
// the tenant's JWKS endpoint. Keys are fetched and refreshed automatically.
type EntraValidator struct {
	keyfunc  keyfunc.Keyfunc
	issuer   string
	audience string
}

// NewEntraValidator builds a validator for the given tenant and audience (client ID).
func NewEntraValidator(tenantID, clientID string) (*EntraValidator, error) {
	jwksURL := fmt.Sprintf("https://login.microsoftonline.com/%s/discovery/v2.0/keys", tenantID)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	kf, err := keyfunc.NewDefaultCtx(ctx, []string{jwksURL})
	if err != nil {
		return nil, fmt.Errorf("load Entra JWKS: %w", err)
	}
	return &EntraValidator{
		keyfunc:  kf,
		issuer:   fmt.Sprintf("https://login.microsoftonline.com/%s/v2.0", tenantID),
		audience: clientID,
	}, nil
}

// JWT returns Gin middleware that rejects requests without a valid Entra token.
func (v *EntraValidator) JWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr, ok := bearer(c)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		tok, err := jwt.Parse(
			tokenStr,
			v.keyfunc.Keyfunc,
			jwt.WithValidMethods([]string{"RS256"}),
			jwt.WithIssuer(v.issuer),
			jwt.WithAudience(v.audience),
			jwt.WithExpirationRequired(),
		)
		if err != nil || !tok.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		if claims, ok := tok.Claims.(jwt.MapClaims); ok {
			c.Set("user", claims["oid"])
			c.Set("name", claims["name"])
			c.Set("roles", claims["roles"])
		}
		c.Next()
	}
}

func bearer(c *gin.Context) (string, bool) {
	auth := c.GetHeader("Authorization")
	if !strings.HasPrefix(auth, "Bearer ") {
		return "", false
	}
	return strings.TrimPrefix(auth, "Bearer "), true
}
