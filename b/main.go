package main

import (
	"net/http"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/route"
	"github.com/gin-gonic/gin"
	"github.com/rs/cors"
)

func init() {
}

func main() {

	config.Connect()

	options := cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"},
		AllowCredentials: true,
	}

	router := gin.New()

	route.UserRoute(router)
	route.ProductRoute(router)
	route.PromoRoute(router)
	route.CartRoute(router)
	route.ShopRoute(router)
	route.WishlistRoute(router)
	route.TransactionRoute(router)
	route.ChatRoute(router)
	route.VoucherRoute(router)
	route.AnnouncementRoute(router)
	route.ReviewRoute(router)
	route.OrderRoute(router)
	// router.Run(":8088")
	http.ListenAndServe(":8088", cors.New(options).Handler(router))
}
