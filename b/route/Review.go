package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func ReviewRoute(e *gin.Engine) {
	e.POST("/save-review", controller.SaveReview)
	e.GET("/get-shopreview", controller.GetReviewByShop)
}
