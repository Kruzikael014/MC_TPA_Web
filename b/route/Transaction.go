package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func TransactionRoute(e *gin.Engine) {
	e.POST("/checkout-cart-content", controller.CheckoutCart)
	e.GET("/get-transaction-count/:id", controller.GetTransactionCount)
}
