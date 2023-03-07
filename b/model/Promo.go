package model

import "gorm.io/gorm"

type Promo struct {
	gorm.Model
	ID           uint   `json:"id" gorm:"primaryKey"`
	Promo_Banner string `json:"promo_banner"`
	Is_Showing   bool   `json:"is_showing"`
}
