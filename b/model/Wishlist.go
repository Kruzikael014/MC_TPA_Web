package model

import "gorm.io/gorm"

type Wishlist struct {
	gorm.Model
	ID        uint `json:"id" gorm:"primaryKey;"`
	ProductId uint `json:"product_id" gorm:"primaryKey"`
	Quantity  uint `json:"quantity"`
	UserId    uint `json:"user_id"`
}
