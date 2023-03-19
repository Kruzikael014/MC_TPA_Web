package model

import "gorm.io/gorm"

type UserOrder struct {
	gorm.Model
	TransactionId  uint   `json:"transaction_id"`
	CartId         uint   `json:"cart_id"`
	Quantity       uint   `json:"quantity"`
	ProductId      uint   `json:"product_id"`
	ProductName    string `json:"product_name"`
	ProductImage   string `json:"product_image"`
	ProductPrice   uint   `json:"product_price"`
	UploadedBy     uint   `json:"uploaded_by"`
	DeliveryStatus string `json:"delivery_status"`
}
