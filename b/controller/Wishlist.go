package controller

import (
	"net/http"
	"strconv"

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

func GetWishlistByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.String(200, "Failed to get parameter from ID")
		return
	}

	var headers model.WishlistHeader
	var details []model.WishlistDetail
	err = config.DB.First(&headers, "id = ?", id).Error

	if err != nil {
		c.String(200, "Failed to get headers")
		return
	}

	err = config.DB.Find(&details, "id = ?", id).Error

	if err != nil {
		c.String(200, "Failed to get details!")
		return
	}

	c.JSON(200, gin.H{
		"wishlist_header":  &headers,
		"wishlist_details": &details,
	})

}

func RemoveItemFromWishlist(c *gin.Context) {
	var RemoveRequest struct {
		WishlistId uint `json:"wishlist_id"`
		ProductId  uint `json:"product_id"`
	}
	c.BindJSON(&RemoveRequest)
	db := config.DB.Exec("DELETE FROM wishlist_details Where id = ? and product_id = ?", RemoveRequest.WishlistId, RemoveRequest.ProductId)
	if db.Error != nil {
		c.String(http.StatusOK, "Failed to remove item from cart")
		return
	}
	c.String(http.StatusOK, "Item successfully removed")
}

func UpdateWishlisQty(c *gin.Context) {
	var updateRequest struct {
		WishlistId uint `json:"wishlist_id"`
		ProductId  uint `json:"product_id"`
		NewQty     uint `json:"new_qty"`
	}
	c.BindJSON(&updateRequest)
	wishlistContent := model.WishlistDetail{}
	config.DB.Where("id = ? AND product_id = ?", updateRequest.WishlistId, updateRequest.ProductId).First(&wishlistContent)
	if wishlistContent.ID == 0 {
		c.String(200, "Cart cant be found!")
		return
	}
	wishlistContent.Quantity = updateRequest.NewQty
	err := config.DB.Save(&wishlistContent).Error
	if err != nil {
		c.String(200, "Failed to save the wishlist changes!")
		return
	}
	c.String(200, "Quantity successfully updated!")
}

func UpdateWishlist(c *gin.Context) {
	var UpdateRequest struct {
		WishlistId         uint   `json:"wishlist_id"`
		WishlistName       string `json:"wishlist_name"`
		WishlistVisibility string `json:"wishlist_visibility"`
	}
	err := c.ShouldBindJSON(&UpdateRequest)
	if err != nil {
		c.String(200, "Failed :", err.Error())
		return
	}
	tx := config.DB.Begin()
	var Wishlist model.WishlistHeader
	err = config.DB.Table("wishlist_headers").Where("id = ?", UpdateRequest.WishlistId).First(&Wishlist).Error
	if err != nil {
		tx.Rollback()
		c.String(200, "Failed to find the wishlist!")
		return
	}
	if UpdateRequest.WishlistName != "" {
		Wishlist.Name = UpdateRequest.WishlistName
	}
	if UpdateRequest.WishlistVisibility == "Public" || UpdateRequest.WishlistVisibility == "Private" {
		Wishlist.IsVisible = UpdateRequest.WishlistVisibility == "Public"
	}
	err = config.DB.Save(&Wishlist).Error
	if err != nil {
		tx.Rollback()
		c.String(200, "Failed to save the wishlist!")
		return
	}
	tx.Commit()
	c.String(200, "Wishlist successfully updated!")
}
