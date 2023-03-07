package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func PromoRoute(e *gin.Engine) {
	e.POST("/upload-promo", controller.InsertPromo)
	e.GET("/get-active-poster", controller.GetActivePromo)
	e.GET("/get-poster/all", controller.GetAllPromo)
	e.POST("/update-poster/:id", controller.UpdatePoster)
}
