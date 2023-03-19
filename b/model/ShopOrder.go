package model

import "gorm.io/gorm"

type ShopOrder struct {
	gorm.Model
	TransactionId  uint   `json:"transaction_id"`
	CartID         uint   `json:"cart_id"`
	Quantity       uint   `json:"quantity"`
	ProductId      uint   `json:"product_id"`
	ProductName    string `json:"product_name"`
	ProductImage   string `json:"product_image"`
	ProductPrice   uint   `json:"product_price"`
	UserId         uint   `json:"user_id"`
	DeliveryStatus string `json:"delivery_status"`
}
