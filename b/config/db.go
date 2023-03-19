package config

import (
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/Kruzikael014/oldegg-backend/util"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := "host=localhost user=postgres password=140303 dbname=oldegg port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Product{})
	db.AutoMigrate(&model.Promo{})
	db.AutoMigrate(&model.OTP{})
	db.AutoMigrate(&model.ForgotPass{})
	db.AutoMigrate(&model.WishlistHeader{})
	db.AutoMigrate(&model.WishlistDetail{})
	db.AutoMigrate(&model.WishlistFollower{})
	db.AutoMigrate(&model.Transaction{})
	db.AutoMigrate(&model.Shop{})
	db.AutoMigrate(&model.Cart{})
	db.AutoMigrate(&model.Chat{})
	db.AutoMigrate(&model.Voucher{})
	db.AutoMigrate(&model.Announcement{})
	db.AutoMigrate(&model.Review{})

	var adminCount int64 = 0
	db.Model(model.User{}).Where("email = ?", "Admin123@email.com").Count(&adminCount)
	if adminCount == 0 {
		adminPass, _ := util.Encrypt("Admin123")
		db.Create(&model.User{
			First_name:       "Admin",
			Last_name:        "Admin",
			Email:            "Admin123@email.com",
			Password:         adminPass,
			Phone_num:        "",
			Email_subscriber: false,
			Status:           "Clear",
			Role_name:        "Admin",
		})
	}

	DB = db
}
