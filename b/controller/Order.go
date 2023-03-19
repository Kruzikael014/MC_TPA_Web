package controller

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUserOrders(c *gin.Context) {
	var userID = c.Param("user_id")

	var userOrders []model.UserOrder

	if err := config.DB.Table("carts").
		Select("transactions.id as transaction_id, carts.cart_id, carts.quantity, products.id as product_id, products.product_name, products.product_image, products.product_price, products.uploaded_by, carts.delivery_status").
		Joins("JOIN products ON products.id = carts.product_id").
		Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
		Where("carts.user_id = ?", userID).
		Scan(&userOrders).Error; err != nil {
		c.String(http.StatusOK, "Failed to retrieve user orders: %s", err.Error())
		return
	}

	c.JSON(http.StatusOK, &userOrders)
}

func GetShopOrders(c *gin.Context) {
	uploadedBy := c.Param("user_id")

	var orders []model.ShopOrder
	err := config.DB.Table("carts").Select("transactions.id as transaction_id, carts.cart_id, quantity, products.id as product_id, product_name, product_image, product_price, user_id, carts.delivery_status").
		Joins("JOIN products ON products.id = carts.product_id").
		Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
		Where("uploaded_by = ?", uploadedBy).
		Scan(&orders).Error
	if err != nil {
		c.String(http.StatusInternalServerError, "error", err)
		return
	}

	c.JSON(http.StatusOK, &orders)
}

func DeliverOrder(c *gin.Context) {
	var Request struct {
		CartId        uint `json:"cart_id"`
		TransactionId uint `json:"transaction_id"`
		ProductId     uint `json:"product_id"`
	}
	c.ShouldBindJSON(&Request)
	var cart model.Cart
	err := config.DB.First(&cart, "cart_id = ? and product_id = ?", Request.CartId, Request.ProductId).Error
	if err != nil {
		c.String(200, "Action failed!")
		return
	}
	cart.DeliveryStatus = "Delivered"
	err = config.DB.Save(&cart).Error
	if err != nil {
		c.String(200, "Action failed!")
		return
	}
	err = ReconfirmTransactionStatus(config.DB, Request.TransactionId)
	if err != nil {
		c.String(200, "Action failed!")
		return
	}
	c.String(200, "Delivery Status successfully changed!")
}

func CancelOrder(c *gin.Context) {
	var Request struct {
		CartId        uint `json:"cart_id"`
		TransactionId uint `json:"transaction_id"`
		ProductId     uint `json:"product_id"`
	}
	c.ShouldBindJSON(&Request)
	var cart model.Cart
	err := config.DB.First(&cart, "cart_id = ? and product_id = ?", Request.CartId, Request.ProductId).Error
	if err != nil {
		c.String(200, "Action failed!")
		return
	}
	cart.DeliveryStatus = "Canceled"
	err = config.DB.Save(&cart).Error
	if err != nil {
		c.String(200, "Action failed!")
		return
	}
	err = ReconfirmTransactionStatus(config.DB, Request.TransactionId)
	if err != nil {
		c.String(200, "Action failed!")
		return
	}
	c.String(200, "Delivery Status successfully changed!")
}

func ReconfirmTransactionStatus(tx *gorm.DB, transactionID uint) error {
	var transaction model.Transaction
	if err := tx.First(&transaction, transactionID).Error; err != nil {
		return err
	}

	var cartItems []model.Cart
	if err := tx.Where("cart_id = ?", transaction.CartId).Find(&cartItems).Error; err != nil {
		return err
	}

	for _, item := range cartItems {

		if item.DeliveryStatus != "Delivered" && item.DeliveryStatus != "Canceled" {
			return nil
		}
	}

	transaction.DeliveryStatus = "Delivered"
	if err := tx.Save(&transaction).Error; err != nil {
		return err
	}

	return nil
}

func GetFilteredOrder(c *gin.Context) {
	user_id, err := strconv.Atoi(c.Query("user_id"))
	var user_role string = c.Query("user_role")
	var filter string = c.Query("filter")

	if err != nil {
		c.String(200, "Failed to get the user id from query param")
		return
	}

	if user_role == "Shop Owner" {
		var orders []model.ShopOrder
		var err error
		if filter == "Canceled" {
			err = config.DB.Table("carts").Select("transactions.id as transaction_id, carts.cart_id, quantity, products.id as product_id, product_name, product_image, product_price, user_id, carts.delivery_status").
				Joins("JOIN products ON products.id = carts.product_id").
				Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
				Where("uploaded_by = ? AND carts.delivery_status = ?", user_id, filter).
				Scan(&orders).Error
		} else if filter == "Delivered" {
			err = config.DB.Table("carts").Select("transactions.id as transaction_id, carts.cart_id, quantity, products.id as product_id, product_name, product_image, product_price, user_id, carts.delivery_status").
				Joins("JOIN products ON products.id = carts.product_id").
				Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
				Where("uploaded_by = ? AND carts.delivery_status = ?", user_id, filter).
				Scan(&orders).Error
		} else if filter == "All" {
			err = config.DB.Table("carts").Select("transactions.id as transaction_id, carts.cart_id, quantity, products.id as product_id, product_name, product_image, product_price, user_id, carts.delivery_status").
				Joins("JOIN products ON products.id = carts.product_id").
				Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
				Where("uploaded_by = ?", user_id).
				Scan(&orders).Error
		}
		if err != nil {
			c.String(http.StatusInternalServerError, "error", err)
			return
		}

		c.JSON(200, &orders)
		return
	} else if user_role == "Customer" {
		var userOrders []model.UserOrder

		var err error

		if filter == "All" {
			err = config.DB.Table("carts").
				Select("transactions.id as transaction_id, carts.cart_id, carts.quantity, products.id as product_id, products.product_name, products.product_image, products.product_price, products.uploaded_by, carts.delivery_status").
				Joins("JOIN products ON products.id = carts.product_id").
				Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
				Where("carts.user_id = ?", user_id).
				Scan(&userOrders).Error
		} else if filter == "Canceled" {
			err = config.DB.Table("carts").
				Select("transactions.id as transaction_id, carts.cart_id, carts.quantity, products.id as product_id, products.product_name, products.product_image, products.product_price, products.uploaded_by, carts.delivery_status").
				Joins("JOIN products ON products.id = carts.product_id").
				Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
				Where("carts.user_id = ? AND carts.delivery_status = ?", user_id, filter).
				Scan(&userOrders).Error
		} else if filter == "Delivered" {
			err = config.DB.Table("carts").
				Select("transactions.id as transaction_id, carts.cart_id, carts.quantity, products.id as product_id, products.product_name, products.product_image, products.product_price, products.uploaded_by, carts.delivery_status").
				Joins("JOIN products ON products.id = carts.product_id").
				Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
				Where("carts.user_id = ? AND carts.delivery_status = ?", user_id, filter).
				Scan(&userOrders).Error
		} else if filter == "Recent" {
			err = config.DB.Table("carts").
				Select("transactions.id as transaction_id, carts.cart_id, carts.quantity, products.id as product_id, products.product_name, products.product_image, products.product_price, products.uploaded_by, carts.delivery_status").
				Joins("JOIN products ON products.id = carts.product_id").
				Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
				Where("carts.user_id = ? AND carts.created_at >= NOW() - INTERVAL '7 days'", user_id).
				Scan(&userOrders).Error
		}
		if err != nil {
			c.String(http.StatusInternalServerError, "error", err)
			return
		}
		c.JSON(200, &userOrders)
		return
	}
}

func SearchOrder(c *gin.Context) {
	var searchQuery = c.Query("q")
	var role = c.Query("role")
	var user_id = c.Query("user_id")

	if role == "Shop Owner" {
		var shopOrders []model.ShopOrder
		var err error
		err = config.DB.Table("carts").
			Select("transactions.id as transaction_id, carts.cart_id, quantity, products.id as product_id, product_name, product_image, product_price, user_id, carts.delivery_status").
			Joins("JOIN products ON products.id = carts.product_id").
			Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
			Where("uploaded_by = ? AND LOWER(product_name) LIKE ? OR LOWER(delivery_status) LIKE ? OR LOWER(CAST(product_price AS text)) LIKE ? OR LOWER(CAST(cart_id AS text)) LIKE ? OR LOWER(CAST(transaction_id AS text)) LIKE ?", user_id,
				"%"+searchQuery+"%", "%"+strings.ToLower(searchQuery)+"%", "%"+strings.ToLower(searchQuery)+"%", "%"+strings.ToLower(searchQuery)+"%", "%"+strings.ToLower(searchQuery)+"%").Error
		if err != nil {
			c.String(http.StatusOK, "Failed to search for shop orders: %s", err.Error())
			return
		}
		c.JSON(http.StatusOK, &shopOrders)
		return
	} else if role == "Customer" {
		var userOrders []model.UserOrder
		var err error
		err = config.DB.Table("carts").
			Select("transactions.id as transaction_id, carts.cart_id, carts.quantity, products.id as product_id, products.product_name, products.product_image, products.product_price, products.uploaded_by, carts.delivery_status").
			Joins("JOIN products ON products.id = carts.product_id").
			Joins("JOIN transactions on transactions.cart_id = carts.cart_id").
			Where("user_id = ? AND LOWER(product_name) LIKE ? OR LOWER(carts.delivery_status) LIKE ? OR LOWER(CAST(product_price AS text)) LIKE ? OR LOWER(CAST(carts.cart_id AS text)) LIKE ? OR LOWER(CAST(transactions.id AS text)) LIKE ?", user_id,
				"%"+strings.ToLower(searchQuery)+"%", "%"+strings.ToLower(searchQuery)+"%", "%"+strings.ToLower(searchQuery)+"%", "%"+strings.ToLower(searchQuery)+"%", "%"+strings.ToLower(searchQuery)+"%").
			Scan(&userOrders).Error
		if err != nil {
			c.String(http.StatusOK, "Failed to search for user orders: %s", err.Error())
			return
		}
		c.JSON(http.StatusOK, &userOrders)
		return
	}

}
