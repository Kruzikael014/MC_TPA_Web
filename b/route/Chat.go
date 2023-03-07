package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func ChatRoute(e *gin.Engine) {
	e.GET("/send-message", controller.SendChat)
}
