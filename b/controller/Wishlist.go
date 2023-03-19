package controller

import (
	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func InsertWishlist(c *gin.Context) {
	var newWishlist model.WishlistHeader
	err := c.ShouldBindJSON(&newWishlist)
	if err != nil {
		c.String(200, "Failed to bind request JSON")
		return
	}
	err = config.DB.Save(&newWishlist).Error
	if err != nil {
		c.String(200, "Failed to save the wishlist!")
		return
	}
	c.String(200, "Wishlist Successfully created!")
}

func GetUserWishlist(c *gin.Context) {
	user_id := c.Query("user_id")
	var userWishlists []model.WishlistHeader
	err := config.DB.Find(&userWishlists, "user_id = ?", user_id).Error
	if err != nil {
		c.String(200, "Failed to get user's wishlist(s)")
		return
	}
	c.JSON(200, &userWishlists)
}
func AddItemToWishlist(c *gin.Context) {
	var wishlistItem model.WishlistDetail
	err := c.ShouldBindJSON(&wishlistItem)
	if err != nil {
		c.String(200, "Failed to bind JSON!")
		return
	}
	var existingItem model.WishlistDetail
	err = config.DB.Where("product_id = ? and id = ?", wishlistItem.ProductID, wishlistItem.ID).First(&existingItem).Error
	if err == nil {
		existingItem.Quantity += wishlistItem.Quantity
		err = config.DB.Save(&existingItem).Error
		if err != nil {
			c.String(200, "Failed to update item quantity in wishlist!")
			return
		}
		c.String(200, "Item quantity successfully updated in wishlist!")
		return
	}
	err = config.DB.Save(&wishlistItem).Error
	if err != nil {
		c.String(200, "Failed to save item to wishlist!")
		return
	}
	c.String(200, "Item successfully saved to wishlist!")
}
