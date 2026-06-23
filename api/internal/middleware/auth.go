package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWT validates a Bearer token signed with the shared secret.
// In production the secret is replaced by Azure AD (Entra ID) JWKS validation.
func JWT(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if !strings.HasPrefix(auth, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		tokenStr := strings.TrimPrefix(auth, "Bearer ")
		tok, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
			return []byte(secret), nil
		})
		if err != nil || !tok.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		if claims, ok := tok.Claims.(jwt.MapClaims); ok {
			c.Set("user", claims["sub"])
		}
		c.Next()
	}
}
