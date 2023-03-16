package controller

import (
	"fmt"
	"strconv"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func SaveAnnouncement(c *gin.Context) {
	var Announcement model.Announcement
	c.ShouldBindJSON(&Announcement)
	fmt.Println(Announcement)
	config.DB.Save(&Announcement)
}

func GetAnnouncement(c *gin.Context) {
	var userId, err = strconv.Atoi(c.Param("id"))
	if err != nil {
		c.String(200, "Failed to parse parameter!")
		return
	}
	var user model.User
	config.DB.First(&user, "id = ?", userId)
	if !user.Email_subscriber {
		c.String(200, "You dont have any announcement, because your not subscribing!")
		return
	}
	var announcements []model.Announcement
	config.DB.Find(&announcements)
	c.JSON(200, &announcements)
}
