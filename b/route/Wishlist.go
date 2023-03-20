package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func WishlistRoute(e *gin.Engine) {
	e.POST("/create-wishlist-header", controller.InsertWishlist)
	e.GET("/get-user-wishlist", controller.GetUserWishlist)
	e.POST("/add-item-wishlist", controller.AddItemToWishlist)
	e.GET("/get-wishlist/:id", controller.GetWishlistByID)
	e.POST("/remove-wishlist-item", controller.RemoveItemFromWishlist)
	e.PATCH("/update-wishlist-qty", controller.UpdateWishlisQty)
	e.PATCH("/update-wishlist-header", controller.UpdateWishlist)
}
