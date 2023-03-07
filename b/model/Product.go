package model

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	ID                  uint   `json:"id" gorm:"primaryKey"`
	Product_Name        string `json:"product_name"`
	Product_Category    string `json:"product_category"`
	Product_Description string `json:"product_description"`
	Product_Image       string `json:"product_image"`
	Product_Price       int    `json:"product_price"`
	Product_Stock       int    `json:"product_stock"`
	Product_Details     string `json:"product_details"`
	Uploaded_by         int    `json:"uploaded_by"`
	Rating              int    `json:"product_rating"`
}
