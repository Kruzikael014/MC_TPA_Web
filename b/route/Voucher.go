package route

import (
	"github.com/Kruzikael014/oldegg-backend/controller"
	"github.com/gin-gonic/gin"
)

func VoucherRoute(e *gin.Engine) {
	e.POST("/use-voucher", controller.UseVoucher)
	e.POST("/create-voucher", controller.CreateVoucher)
}
