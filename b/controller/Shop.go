package controller

import (
	"strconv"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func GetShopDetail(c *gin.Context) {
	var id = c.Query("shop_id")
	var user model.Shop
	db := config.DB.First(&user, "id = ?", id)
	if db.Error != nil {
		c.String(200, "Failed to find shop detail!")
		return
	}
	c.JSON(200, user)
}

func GetAllShopDetail(c *gin.Context) {
	var shops = []model.Shop{}
	err := config.DB.Find(&shops).Error
	if err != nil {
		c.String(200, "Error while getting all shops data!")
		return
	}
	c.JSON(200, shops)
}

func GetShopById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.String(200, "Failed to get the id parameter!")
		return
	}
	var shop = model.Shop{}
	err = config.DB.First(&shop, "id = ?", id).Error
	if err != nil {
		c.String(200, "Error while getting the shop data!")
		return
	}
	c.JSON(200, shop)
}

func UpdateShopProfile(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.String(200, "Failed to get the id parameter")
		return
	}
	var UpdateShopRequest struct {
		ShopBanner      string `json:"shop_banner"`
		ShopDescription string `json:"shop_description"`
	}
	c.ShouldBindJSON(&UpdateShopRequest)
	var shop model.Shop
	config.DB.First(&shop, "id = ?", id)
	shop.Shop_Banner = UpdateShopRequest.ShopBanner
	shop.Shop_Description = UpdateShopRequest.ShopDescription
	if err := config.DB.Save(&shop); err.Error != nil {
		c.String(200, "Failed to save the changes!")
		return
	}
	c.String(200, "Shop successfully updated!")
}
