package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var conns = map[string]*websocket.Conn{}

func GetChat(c *gin.Context) {
	var from string = c.Query("from")
	var to string = c.Query("to")

	var ourChats []model.Chat
	err := config.DB.Table("chats").Select("*").Where("chats.from = ? AND chats.to = ?", from, to).Or("chats.from = ? and chats.to = ?", to, from).Order("created_at ASC").Find(&ourChats).Error
	if err != nil {
		c.String(200, "Failed to retrieve our message!")
		return
	}
	c.JSON(200, &ourChats)
}

func SendChat(c *gin.Context) {
	var ReqFrom string
	h := http.Header{}
	for _, sub := range websocket.Subprotocols(c.Request) {
		h.Set("Sec-Websocket-Protocol", sub)
		ReqFrom = sub
	}
	// upgrade Htt protocol into web socket
	ws, err := upgrader.Upgrade(c.Writer, c.Request, h)
	if err != nil {
		fmt.Println(err)
	}

	conns[ReqFrom] = ws

	for {
		var req model.Chat
		err = ws.ReadJSON(&req)
		// save message to DB if its valid (not empty)
		if req.From != "" {
			config.DB.Create(&req)
		}

		// store our connection
		conns[req.From] = ws

		// get their connection and if their connection is ok, we write something to their connection, if they open they ll receive
		if con, ok := conns[req.To]; ok {
			err = con.WriteJSON(&req)
			if err != nil {
				fmt.Println("Target failed to receive the message!")
			}
		}

		// get our connection, write the messsage for ourself, because in chat we can see their chat, and we can see our chat as well
		if con, ok := conns[req.From]; ok {
			err = con.WriteJSON(&req)
			if err != nil {
				fmt.Println("Us failed to receive our own message!")
			}
		}
	}
}

func GetRecentChats(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.String(200, "Failed to get the id from param!")
		return
	}

	var chats []uint
	err = config.DB.Table("chats").
		Select("DISTINCT chats.from").
		Where("chats.to = ?", strconv.Itoa(id)).
		Pluck("chats.from", &chats).Error
	if err != nil {
		c.String(200, "Failed to find the recent chat!")
		return
	}

	var userIds []int
	for _, userId := range chats {
		userIds = append(userIds, int(userId))
	}

	c.JSON(200, &userIds)
}
