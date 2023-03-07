package model

import (
	"time"

	"gorm.io/gorm"
)

type ForgotPass struct {
	gorm.Model
	ID         uint      `json:"id" gorm:"primaryKey"`
	Email      string    `json:"email"`
	Code       uint      `json:"otp_code"`
	Expiration time.Time `json:"expiration"`
}
