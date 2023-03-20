package controller

import (
	"strconv"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func AddToCart(c *gin.Context) {
	var newCart model.Cart
	c.BindJSON(&newCart)

	var cart model.Cart
	config.DB.Where("user_id = ?", newCart.UserId).First(&cart)

	if cart.ID != 0 {
		var tempCart model.Cart
		config.DB.Where("product_id = ?", newCart.ProductId).First(&tempCart)
		if tempCart.ProductId != 0 {
			cart.Quantity += newCart.Quantity
			config.DB.Save(&cart)
			c.String(200, "Item exists in cart, successfully update the quantity")
			return
		}
	}

	cart = model.Cart{
		CartID:    cart.CartID,
		ProductId: newCart.ProductId,
		Quantity:  newCart.Quantity,
		UserId:    newCart.UserId,
	}
	config.DB.Create(&cart)
	c.String(200, "Inserting item to cart")
	return
}

func GetCart(c *gin.Context) {
	id := c.Query("user_id")
	cartContents := []model.Cart{}
	config.DB.Where("user_id = ?", id).Find(&cartContents)
	if len(cartContents) == 0 {
		c.String(200, "Cart is empty, go add some stuff!")
		return
	}
	c.JSON(200, cartContents)
}

func UpdateQty(c *gin.Context) {
	var updateRequest struct {
		Cart_id    uint `json:"cart_id"`
		Product_id uint `json:"product_id"`
		New_qty    uint `json:"new_qty"`
	}
	c.BindJSON(&updateRequest)
	cartContent := model.Cart{}
	config.DB.Where("cart_id = ? AND product_id = ?", updateRequest.Cart_id, updateRequest.Product_id).First(&cartContent)
	if cartContent.ID == 0 {
		c.String(200, "Cart cant be found!")
		return
	}
	cartContent.Quantity = updateRequest.New_qty
	config.DB.Save(&cartContent)
	c.String(200, "Quantity successfully updated!")
}

func GetCartTotal(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.String(200, "Failed to get the parameter!")
		return
	}
	var total int
	var carts []model.Cart
	config.DB.Find(&carts, "cart_id = ?", id)
	for _, cart := range carts {
		var product model.Product
		config.DB.First(&product, cart.ProductId)
		total += int(cart.Quantity) * int(product.Product_Price)
	}

	c.String(200, strconv.Itoa(total))
}

func RemoveItemFromCart(c *gin.Context) {
	var RemoveRequest struct {
		CartId    uint `json:"cart_id"`
		ProductId uint `json:"product_id"`
	}
	c.BindJSON(&RemoveRequest)
	db := config.DB.Exec("DELETE FROM carts Where cart_id = ? and product_id = ?", RemoveRequest.CartId, RemoveRequest.ProductId)
	if db.Error != nil {
		c.String(200, "Failed to remove item from cart")
		return
	}
	c.String(200, "Item successfully removed")
}

func AddAllWishlistToCart(c *gin.Context) {
	var AddWishlistToCartRequest struct {
		UserId     uint `json:"user_id"`
		WishlistId uint `json:"wishlist_id"`
	}
	err := c.BindJSON(&AddWishlistToCartRequest)
	if err != nil {
		c.String(200, "Failed to parse request: %s", err.Error())
		return
	}
	var wishlistDetails []model.WishlistDetail
	err = config.DB.Where("id = ?", AddWishlistToCartRequest.WishlistId).Find(&wishlistDetails).Error
	if err != nil {
		c.String(200, "Failed to retrieve wishlist details: %s", err.Error())
		return
	}
	var cart model.Cart
	config.DB.Where("user_id = ?", AddWishlistToCartRequest.UserId).First(&cart)
	if cart.CartID != 0 {
		for _, wishlistDetail := range wishlistDetails {
			var tempCart model.Cart
			config.DB.Where("user_id = ? and product_id = ?", AddWishlistToCartRequest.UserId, wishlistDetail.ProductID).First(&tempCart)
			if tempCart.ProductId != 0 {
				tempCart.Quantity += 1
				config.DB.Save(&tempCart)
			} else {
				tempCart = model.Cart{
					CartID:    cart.CartID,
					ProductId: wishlistDetail.ProductID,
					Quantity:  1,
					UserId:    AddWishlistToCartRequest.UserId,
				}
				config.DB.Create(&tempCart)
			}
		}
		c.String(200, "Items added to cart successfully")
		return
	} else {
		for _, wishlistDetail := range wishlistDetails {
			config.DB.Where("user_id = ?", AddWishlistToCartRequest.UserId).First(&cart)
			var tempCart model.Cart
			if cart.CartID != 0 {
				tempCart = model.Cart{
					CartID:    cart.CartID,
					ProductId: wishlistDetail.ProductID,
					Quantity:  1,
					UserId:    AddWishlistToCartRequest.UserId,
				}
				config.DB.Create(&tempCart)
			} else {
				tempCart = model.Cart{
					ProductId: wishlistDetail.ProductID,
					Quantity:  1,
					UserId:    AddWishlistToCartRequest.UserId,
				}
				config.DB.Create(&tempCart)
			}
		}
		c.String(200, "Items added to cart successfully")
		return
	}
}
