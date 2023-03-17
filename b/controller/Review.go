package controller

import (
	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func SaveReview(c *gin.Context) {
	var newReview model.Review
	err := c.ShouldBindJSON(&newReview)
	if err != nil {
		c.String(200, "Failed while binding request!")
		return
	}
	err = config.DB.Save(&newReview).Error
	if err != nil {
		c.String(200, "Failed to save the review")
		return
	}
	c.String(200, "Review Successfully saved!")
}

func GetReviewByShop(c *gin.Context) {
	var id = c.Query("shop_id")
	var reviews []model.Review
	err := config.DB.Find(&reviews, "shop_id = ?", id).Error
	if err != nil {
		c.String(200, "Cant find any review")
		return
	}
	c.JSON(200, reviews)
}
