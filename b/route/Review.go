package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func ReviewRoute(e *gin.Engine) {
	e.POST("/save-review", controller.SaveReview)
	e.GET("/get-shopreview", controller.GetReviewByShop)
	e.GET("/get-shopreview-filtered", controller.GetReviewByShopSorted)
	e.GET("/search-review", controller.SearchReviews)
	e.GET("/shop-review-counts", controller.GetReviewCount)
	e.GET("/get-percentage-ontime", controller.GetOnTimePercentage)
	e.GET("/get-percentage-satisfaction", controller.GetSatisfyingServicePercentage)
	e.GET("/get-percentage-accuracy", controller.GetProductAccuracyPercentage)

}
