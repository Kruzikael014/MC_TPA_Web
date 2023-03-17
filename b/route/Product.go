package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func ProductRoute(e *gin.Engine) {
	// R
	e.GET("/products/all", controller.GetProducts)
	e.GET("/product/:id", controller.GetProduct)
	// e.GET("/product", controller.GetShopProduct)
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
	e.POST("/get-product-category", controller.GetProductCategory)
	// lowest price
	e.POST("/lowest-priced-products", controller.FetchLowPricedProduct)
	// highest price
	e.POST("/highest-priced-products", controller.FetchhighPricedProduct)
	// most bought
	e.POST("/most-bought-products", controller.FetchMostBoughtProduct)
	// paginated product shop
	e.GET("/product-paginated", controller.GetShopProductPaginated)

	e.GET("/get-product-count/:id", controller.GetProductCount)

}
