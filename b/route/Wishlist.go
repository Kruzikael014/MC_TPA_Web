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
	e.GET("/get-public-wishlist", controller.GetPublicWishlist)
	e.GET("/get-followed-wishlist", controller.GetFollowedWishlist)
	e.POST("/follow-wishlist", controller.FollowWishlist)
	e.POST("/unfollow-wishlist", controller.UnfollowWishlist)
	e.POST("/duplicate-wishlist", controller.DuplicateWishlist)

	// detail static paths
	e.GET("/get-all-public-wishlist", controller.GetAllPublicWishlist)
	e.GET("/get-single-public-wishlist/:id", controller.GetSinglePublicWishlist)
	// comment
	e.POST("/comment-wishlist", controller.CommentOnWishlist)
	e.GET("/get-wishlist-comments", controller.GetWishlistComments)
	e.POST("/copy-wishlist-cart", controller.AddToCartFromWishlist)
}
