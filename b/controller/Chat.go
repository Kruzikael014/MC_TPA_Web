package controller

import (
	"fmt"
	"net/http"

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

func GetOur(c *gin.Context) {

}

func GetThem(c *gin.Context) {

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
		if req.From != "" {
			config.DB.Create(&req)
		}

		conns[req.From] = ws
		if con, ok := conns[req.To]; ok {
			err = con.WriteJSON(&req)
			if err != nil {
			}
		}
		if con, ok := conns[req.From]; ok {
			err = con.WriteJSON(&req)
			if err != nil {
			}
		}
	}
}
