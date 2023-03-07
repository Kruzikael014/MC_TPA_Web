package model

import "gorm.io/gorm"

type Cart struct {
	gorm.Model
	CartID    uint `json:"cart_id" gorm:"autoIncrement"`
	ProductId uint `json:"product_id"`
	Quantity  uint `json:"quantity"`
	UserId    uint `json:"user_id"`
}
