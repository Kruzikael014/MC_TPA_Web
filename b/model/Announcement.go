package model

import (
	"time"

	"gorm.io/gorm"
)

type Announcement struct {
	gorm.Model
	ID        uint      `json:"id" gorm:"primary_key;auto_increment"`
	Message   string    `json:"announcement_message"`
	CreatedAt time.Time `json:"created_at"`
}
