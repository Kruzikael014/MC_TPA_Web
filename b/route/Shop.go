package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func ShopRoute(e *gin.Engine) {
	e.GET("/get-shop-detail", controller.GetShopDetail)
	e.PATCH("/update-shop-profile/:id", controller.UpdateShopProfile)
	e.GET("/shop-detail/all", controller.GetAllShopDetail)
	e.GET("/shop-detail/:id", controller.GetShopById)
}
