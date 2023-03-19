package model

import "gorm.io/gorm"

type WishlistHeader struct {
	gorm.Model
	ID        uint   `json:"wishlist_id" gorm:"primaryKey;"`
	Name      string `json:"wishlist_name"`
	IsVisible bool   `json:"is_visible"`
	UserID    uint   `json:"user_id"`
}

type WishlistDetail struct {
	ID        uint `json:"id" gorm:"primary_key"`
	ProductID uint `json:"product_id" gorm:"primary_key"`
	Quantity  uint `json:"quantity"`
}

type WishlistFollower struct {
	WishlistID uint `json:"wishlist_id"`
	FollowerID uint `json:"follower_id"`
}
