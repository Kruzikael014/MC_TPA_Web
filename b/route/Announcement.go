package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func AnnouncementRoute(e *gin.Engine) {
	e.GET("/get-announcement/:id", controller.GetAnnouncement)
	e.POST("/save-announcement", controller.SaveAnnouncement)
}
