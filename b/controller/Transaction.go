package controller

import (
	"net/http"
	"strconv"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func CheckoutCart(c *gin.Context) {
	var checkoutRequest struct {
		CartId             uint   `json:"cart_id"`
		TransactionPayment string `json:"transaction_payment"`
		DeliveryProvider   string `json:"delivery_provider"`
	}
	if err := c.BindJSON(&checkoutRequest); err != nil {
		c.String(http.StatusOK, "Invalid request")
		return
	}
	tx := config.DB.Begin()
	var cartItems []model.Cart
	// delete barang dari cart
	if err := tx.Where("cart_id = ?", checkoutRequest.CartId).Find(&cartItems).Error; err != nil {
		tx.Rollback()
		c.String(http.StatusOK, "Failed to retrieve cart items: %s", err.Error())
		return
	}
	if err := tx.Delete(&cartItems).Error; err != nil {
		tx.Rollback()
		c.String(http.StatusOK, "Failed to delete cart items: %s", err.Error())
		return
	}

	// kurangin stock item
	for _, item := range cartItems {
		var product model.Product
		if err := tx.First(&product, item.ProductId).Error; err != nil {
			tx.Rollback()
			c.String(http.StatusOK, "Failed to retrieve product %d: %s", item.ProductId, err.Error())
			return
		}
		product.Product_Stock -= int64(item.Quantity)
		if err := tx.Model(&product).Update("product_stock", product.Product_Stock).Error; err != nil {
			tx.Rollback()
			c.String(http.StatusOK, "Failed to update product %d stock: %s", item.ProductId, err.Error())
			return
		}
	}

	// masukkin ke table transaksi
	transactionDone := model.Transaction{
		CartId:             checkoutRequest.CartId,
		TransactionPayment: checkoutRequest.TransactionPayment,
		DeliveryProvider:   checkoutRequest.DeliveryProvider,
	}
	if err := tx.Create(&transactionDone).Error; err != nil {
		tx.Rollback()
		c.String(http.StatusOK, "Failed to save the transaction: %s", err.Error())
		return
	}

	// baru commit, jadi kalau misalnya emang di tengah tengah rusak atau gagal, gak akan ada barang yang hilang dari cart
	tx.Commit()

	c.String(http.StatusOK, "Cart successfully checked out!")
}

func GetTransactionCount(c *gin.Context) {
	var userID = c.Param("id")
	var count int64
	rows, err := config.DB.Raw("SELECT COUNT(*) FROM transactions t JOIN carts c ON c.cart_id = t.cart_id JOIN products p ON p.id = c.product_id WHERE p.uploaded_by = ?", userID).Rows()
	if err != nil {
		c.String(200, "Error while running the query!")
		return
	}
	defer rows.Close()
	if rows.Next() {
		err = rows.Scan(&count)
		if err != nil {
			c.String(200, "Failed to bind the count!")
			return
		}
	}
	c.String(200, strconv.Itoa(int(count)))
}
