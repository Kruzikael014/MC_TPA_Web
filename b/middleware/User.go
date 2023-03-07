package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func RequireAuth(c *gin.Context) {

	type JWToken struct {
		TokenString string `json:"JWToken"`
	}

	var tokenStr JWToken

	c.ShouldBindJSON(&tokenStr)

	if tokenStr.TokenString == "" {
		c.AbortWithStatus(http.StatusUnauthorized)
	}

	token, err := jwt.Parse(tokenStr.TokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET")), nil
	})

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Error Failed to parse JWT",
		})
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		exp, expOK := claims["exp"].(float64)

		if float64(time.Now().Unix()) > exp || !expOK {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "Error regarding JWT expiration",
			})
		}

		var user model.User
		config.DB.First(&user, "email = ?", claims["sub"])

		if user.ID == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		c.Set("user", user)
		c.Next()
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}

}
