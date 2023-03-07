package controller

import (
	"math/rand"
	"net/http"
	"time"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func UseVoucher(c *gin.Context) {
	var UseVoucherRequest struct {
		UserId      uint   `json:"user_id"`
		VoucherName string `json:"voucher_name"`
	}
	c.ShouldBindJSON(&UseVoucherRequest)
	voucher := model.Voucher{}
	err := config.DB.First(&voucher, "name = ?", UseVoucherRequest.VoucherName).Error
	if err != nil {
		c.String(http.StatusOK, "Voucher not found")
		return
	}

	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()
	err = tx.Model(&voucher).Update("is_used", true).Error
	if err != nil {
		tx.Rollback()
		c.String(http.StatusOK, "Failed to use voucher")
		return
	}
	user := model.User{}
	err = tx.First(&user, "id = ?", UseVoucherRequest.UserId).Error
	if err != nil {
		tx.Rollback()
		c.String(http.StatusOK, "User not found")
		return
	}
	user.Balance += voucher.Value
	err = tx.Save(&user).Error
	if err != nil {
		tx.Rollback()
		c.String(http.StatusOK, "Failed to update user balance")
		return
	}
	err = tx.Delete(&voucher).Error
	if err != nil {
		tx.Rollback()
		c.String(http.StatusOK, "Failed to delete voucher")
		return
	}
	err = tx.Commit().Error
	if err != nil {
		c.String(http.StatusOK, "Failed to commit transaction")
		return
	}
	c.String(200, "Voucher successfully used!")
}

func CreateVoucher(c *gin.Context) {
	var CreateVoucherRequest struct {
		VoucherName string `json:"voucher_name"`
		Value       uint   `json:"value"`
	}
	c.ShouldBindJSON(&CreateVoucherRequest)
	if CreateVoucherRequest.VoucherName == "" {
		rand.Seed(time.Now().UnixNano())
		chars := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
		length := 12
		result := make([]byte, length)
		for i := range result {
			result[i] = chars[rand.Intn(len(chars))]
		}
		randomString := string(result)
		config.DB.Create(&model.Voucher{
			IsUsed: false,
			Value:  CreateVoucherRequest.Value,
			Name:   randomString,
		})
		c.String(200, "Random voucher successfully created!")
		return
	}
	config.DB.Create(&model.Voucher{
		IsUsed: false,
		Value:  CreateVoucherRequest.Value,
		Name:   CreateVoucherRequest.VoucherName,
	})
	c.String(200, "Voucher successfully created!")
}
