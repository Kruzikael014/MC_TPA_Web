package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func ProductRoute(e *gin.Engine) {
	// R
	e.GET("/products/all", controller.GetProducts)
	e.GET("/product/:id", controller.GetProduct)
	e.GET("/product", controller.GetShopProduct)
	// C
	e.POST("/insert-product", controller.CreateProduct)
	// U
	e.PATCH("/update-product/:id", controller.UpdateProduct)
	// D
	e.DELETE("/delete-product/:id", controller.DeleteProduct)
	// infinite scrollnig
	e.GET("/get-offset", controller.GetProductsOffset)
	// searching
	e.GET("/search-product", controller.SearchProduct)
}
