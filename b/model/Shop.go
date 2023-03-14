package model

import "gorm.io/gorm"

type Shop struct {
	gorm.Model
	ID               uint   `json:"id"`
	Shop_Description string `json:"shop_description"` // about us
	Shop_Banner      string `json:"shop_banner"`
	Average_Rating   uint   `json:"average_rating"`
	Number_of_Sales  uint   `json:"number_of_sales"`
}
