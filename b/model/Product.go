package model

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	ID                  uint   `json:"id" gorm:"primaryKey"`
	Product_Name        string `json:"product_name"`
	Product_Category    string `json:"product_category"`
	Product_Description string `json:"product_description"`
	Product_Image       string `json:"product_image"`
	Product_Price       int64  `json:"product_price"`
	Product_Stock       int64  `json:"product_stock"`
	Product_Details     string `json:"product_details"`
	Uploaded_by         int64  `json:"uploaded_by"`
	Rating              int64  `json:"product_rating"`
}
