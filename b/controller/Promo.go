package controller

import (
	"net/http"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func InsertPromo(c *gin.Context) {
	promo := model.Promo{}
	c.ShouldBindJSON(&promo)
	config.DB.Create(&promo)
	c.JSON(200, promo)
}

func GetAllPromo(c *gin.Context) {
	promo := []model.Promo{}
	config.DB.Find(&promo)
	c.JSON(200, promo)
}

func GetActivePromo(c *gin.Context) {
	promo := []model.Promo{}
	config.DB.Where("is_showing = ?", "true").Find(&promo)
	c.JSON(200, promo)
}

func UpdatePoster(c *gin.Context) {

	oldpromo := model.Promo{}
	if err := config.DB.First(&oldpromo, c.Param("id")).Error; err != nil {
		c.String(200, "Cant find object in DB")
		return
	}

	oldpromo.Is_Showing = !oldpromo.Is_Showing

	if err := config.DB.Save(&oldpromo).Error; err != nil {
		c.String(200, "Error while saving the updates")
		return
	}

	c.String(http.StatusOK, "Active status successfully changed!")
}
