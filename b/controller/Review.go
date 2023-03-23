package controller

import (
	"net/http"
	"strconv"
	"strings"

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

func UpdateReview(c *gin.Context) {
	var newReview model.Review
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

func GetReviewByShopSorted(c *gin.Context) {
	var id = c.Query("shop_id")
	var sort = c.Query("sort")
	orderby := "created_at " + sort
	var reviews []model.Review
	err := config.DB.Order(orderby).Find(&reviews, "shop_id = ?", id).Error
	if err != nil {
		c.String(200, "Cant find any review")
		return
	}
	c.JSON(200, reviews)
}

func SearchReviews(c *gin.Context) {
	var query = c.Query("q")
	var shop_id = c.Query("shop_id")
	var reviews []model.Review
	err := config.DB.Where("shop_id = ? AND lower(message) LIKE ?", shop_id, "%"+strings.ToLower(query)+"%").Find(&reviews).Error
	if err != nil {
		c.String(200, "Review not found!")
		return
	}
	c.JSON(200, reviews)
}

func GetReviewCount(c *gin.Context) {
	var shopID = c.Query("shop_id")
	var count int64
	err := config.DB.Model(&model.Review{}).Where("shop_id = ?", shopID).Count(&count).Error
	if err != nil {
		c.String(200, "Cant get the count!")
	}
	c.String(200, strconv.Itoa(int(count)))
}

func GetOnTimePercentage(c *gin.Context) {
	shopID := c.Query("shop_id")

	var result float64
	err := config.DB.Raw(`
	SELECT (COUNT(CASE WHEN reviews.delivered_on_time = TRUE THEN 1 END) * 100.0 / COUNT(*)) AS accuracy_percentage
	FROM reviews
	WHERE shop_id = ?;
		`, shopID).Scan(&result).Error

	if err != nil {
		c.String(http.StatusOK, "Error occurred while getting the percentage of delivered on time reviews")
		return
	}

	c.String(http.StatusOK, "%.2f", result)
}

func GetSatisfyingServicePercentage(c *gin.Context) {
	shopID := c.Query("shop_id")

	var result float64
	err := config.DB.Raw(`
	SELECT (COUNT(CASE WHEN reviews.satisfying_service = TRUE THEN 1 END) * 100.0 / COUNT(*)) AS accuracy_percentage
	FROM reviews
	WHERE shop_id = ?;
	`, shopID).Scan(&result).Error

	if err != nil {
		c.String(http.StatusOK, "Error occurred while getting the percentage of delivered on time reviews")
		return
	}

	c.String(http.StatusOK, "%.2f", result)
}

func GetProductAccuracyPercentage(c *gin.Context) {
	shopID := c.Query("shop_id")

	var result float64
	err := config.DB.Raw(`
	SELECT (COUNT(CASE WHEN reviews.item_accurate = TRUE THEN 1 END) * 100.0 / COUNT(*)) AS accuracy_percentage
	FROM reviews
	WHERE shop_id = ?;
	`, shopID).Scan(&result).Error

	if err != nil {
		c.String(http.StatusOK, "Error occurred while getting the percentage of delivered on time reviews")
		return
	}

	c.String(http.StatusOK, "%.2f", result)
}
