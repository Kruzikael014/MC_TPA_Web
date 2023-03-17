package model

import (
	"time"

	"gorm.io/gorm"
)

type Review struct {
	gorm.Model
	ID                uint      `json:"review_id" gorm:"primary_key;auto_increment"`
	CreatedAt         time.Time `json:"created_at"`
	RatingValue       uint      `json:"rating_value"`
	DeliveredOnTime   bool      `json:"delivered_ontime"`
	ItemAccurate      bool      `json:"item_accurate"`
	SatisfyingService bool      `json:"satisfying_service"`
	ReviewerId        uint      `json:"reviewer_id"`
	ShopId            uint      `json:"shop_id"`
	Message           string    `json:"message"`
}
