package model

import "gorm.io/gorm"

type Transaction struct {
	gorm.Model
	ID                 uint   `json:"id" gorm:"primary_key;auto_increment"`
	CartId             uint   `json:"cart_id"`
	TransactionPayment string `json:"transaction_payment"`
	DeliveryProvider   string `json:"delivery_provider"`
	DeliveryStatus     string `json:"delivery_status"`
}
