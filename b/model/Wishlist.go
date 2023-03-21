package model

import (
	"time"

	"gorm.io/gorm"
)

type WishlistHeader struct {
	gorm.Model
	CreatedAt time.Time `json:"created_at"`
	ID        uint      `json:"wishlist_id" gorm:"primary_key;auto_increment"`
	Name      string    `json:"wishlist_name"`
	IsVisible bool      `json:"is_visible"`
	UserID    uint      `json:"user_id"`
}

type WishlistDetail struct {
	ID        uint `json:"id" gorm:"primary_key"`
	ProductID uint `json:"product_id" gorm:"primary_key"`
	Quantity  uint `json:"quantity"`
}

type WishlistFollower struct {
	WishlistID uint `json:"wishlist_id" gorm:"primary_key"`
	FollowerID uint `json:"follower_id" gorm:"primary_key"`
}

type WishlistComment struct {
	gorm.Model
	CreatedAt  time.Time `json:"created_at"`
	ID         uint      `json:"id"`
	WishlistID uint      `json:"wishlist_id"`
	Comment    string    `json:"comment"`
	UploadedBy int       `json:"uploaded_by"`
}
