package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID               uint   `json:"id" gorm:"primary_key;auto_increment"`
	First_name       string `json:"first_name"`
	Last_name        string `json:"last_name"`
	Email            string `json:"email"`
	Password         string `json:"password"`
	Phone_num        string `json:"phone_num"`
	Email_subscriber bool   `json:"email_subscriber"`
	Status           string `json:"status"`
	Role_name        string `json:"role_name"`
	Balance          uint   `json:"balance"`
}
