package model

import (
	"time"

	"gorm.io/gorm"
)

type Chat struct {
	gorm.Model
	From      string    `json:"from"`
	To        string    `json:"to"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}
