package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func CartRoute(e *gin.Engine) {
	e.POST("/add-to-cart", controller.AddToCart)
	e.GET("/get-cart", controller.GetCart)
	e.POST("/update-cart-qty", controller.UpdateQty)
	e.GET("/get-cart-total/:id", controller.GetCartTotal)
	e.POST("/remove-cart-item", controller.RemoveItemFromCart)
}
