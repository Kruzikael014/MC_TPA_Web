package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func OrderRoute(e *gin.Engine) {
	e.GET("/get-order-user/:user_id", controller.GetUserOrders)
	e.GET("/get-order-shop/:user_id", controller.GetShopOrders)
	e.POST("/deliver-order", controller.DeliverOrder)
	e.POST("/cancel-order", controller.CancelOrder)
}
