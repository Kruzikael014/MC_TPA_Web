package model

import "gorm.io/gorm"

type Voucher struct {
	gorm.Model
	ID     uint   `json:"id" gorm:"primaryKey;"`
	Name   string `json:"name"`
	IsUsed bool   `json:"is_used"`
	Value  uint   `json:"value"`
}
