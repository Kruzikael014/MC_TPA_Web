package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/Kruzikael014/oldegg-backend/middleware"
	"github.com/gin-gonic/gin"
)

func UserRoute(e *gin.Engine) {
	e.GET("/user/all", controller.GetUsers)
	// by email
	e.POST("/user", controller.GetUser)
	// by id
	e.GET("/get-user-by-id/:id", controller.GetUserById)
	e.POST("/signup", controller.CreateUser)
	e.PUT("/update-user", controller.UpdateUser)
	e.DELETE("/delete-user/:id", controller.DeleteUser)
	e.POST("/login", controller.Login)
	e.POST("/validate", middleware.RequireAuth, controller.Validate)

	// decrease balance
	e.POST("/decrease-balance", controller.DecreaseBalance)

	e.POST("/broadcast", controller.Broadcast)
	// change password (forgot password)
	e.POST("/change-pass", controller.ChangePassword)

	// Change Phone number
	e.POST("/change-phone", controller.ChangePhoneNum)

	// get shop
	e.GET("/shop_owner", controller.GetShop)
	// get user (only)
	e.GET("/user", controller.GetCustomer)

	// ban (user or shop owner)
	e.GET("/ban/:id", controller.BanUser)
	// unban (user or shop owner)
	e.GET("/unban/:id", controller.UnbanUser)
	// OTP get
	e.POST("/get-otp", controller.StartOTP)
	// OTP Login
	e.POST("/use-otp", controller.VerifyOTP)
	// forgot
	e.POST("/get-forgot-pass", controller.StartForgotPass)
	// Use forgot pass code
	e.POST("/use-forgot-pass", controller.VerifyForgotPass)
	e.POST("/compare-pass", controller.ComparePass)
}
