package controller

import (
	"net/http"
	"strconv"
	"time"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func InsertWishlist(c *gin.Context) {
	var newWishlist model.WishlistHeader
	err := c.ShouldBindJSON(&newWishlist)
	if err != nil {
		c.String(200, "Failed to bind request JSON")
		return
	}
	err = config.DB.Save(&newWishlist).Error
	if err != nil {
		c.String(200, "Failed to save the wishlist!")
		return
	}
	c.String(200, "Wishlist Successfully created!")
}

func GetUserWishlist(c *gin.Context) {
	user_id := c.Query("user_id")
	var userWishlists []model.WishlistHeader
	err := config.DB.Find(&userWishlists, "user_id = ?", user_id).Error
	if err != nil {
		c.String(200, "Failed to get user's wishlist(s)")
		return
	}
	c.JSON(200, &userWishlists)
}
func AddItemToWishlist(c *gin.Context) {
	var wishlistItem model.WishlistDetail
	err := c.ShouldBindJSON(&wishlistItem)
	if err != nil {
		c.String(200, "Failed to bind JSON!")
		return
	}
	var existingItem model.WishlistDetail
	err = config.DB.Where("product_id = ? and id = ?", wishlistItem.ProductID, wishlistItem.ID).First(&existingItem).Error
	if err == nil {
		existingItem.Quantity += wishlistItem.Quantity
		err = config.DB.Save(&existingItem).Error
		if err != nil {
			c.String(200, "Failed to update item quantity in wishlist!")
			return
		}
		c.String(200, "Item quantity successfully updated in wishlist!")
		return
	}
	err = config.DB.Save(&wishlistItem).Error
	if err != nil {
		c.String(200, "Failed to save item to wishlist!")
		return
	}
	c.String(200, "Item successfully saved to wishlist!")
}

func GetWishlistByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.String(200, "Failed to get parameter from ID")
		return
	}

	var headers model.WishlistHeader
	var details []model.WishlistDetail
	err = config.DB.First(&headers, "id = ?", id).Error

	if err != nil {
		c.String(200, "Failed to get headers")
		return
	}

	err = config.DB.Find(&details, "id = ?", id).Error

	if err != nil {
		c.String(200, "Failed to get details!")
		return
	}

	c.JSON(200, gin.H{
		"wishlist_header":  &headers,
		"wishlist_details": &details,
	})

}

func RemoveItemFromWishlist(c *gin.Context) {
	var RemoveRequest struct {
		WishlistId uint `json:"wishlist_id"`
		ProductId  uint `json:"product_id"`
	}
	c.BindJSON(&RemoveRequest)
	db := config.DB.Exec("DELETE FROM wishlist_details Where id = ? and product_id = ?", RemoveRequest.WishlistId, RemoveRequest.ProductId)
	if db.Error != nil {
		c.String(http.StatusOK, "Failed to remove item from cart")
		return
	}
	c.String(http.StatusOK, "Item successfully removed")
}

func UpdateWishlisQty(c *gin.Context) {
	var updateRequest struct {
		WishlistId uint `json:"wishlist_id"`
		ProductId  uint `json:"product_id"`
		NewQty     uint `json:"new_qty"`
	}
	c.BindJSON(&updateRequest)
	wishlistContent := model.WishlistDetail{}
	config.DB.Where("id = ? AND product_id = ?", updateRequest.WishlistId, updateRequest.ProductId).First(&wishlistContent)
	if wishlistContent.ID == 0 {
		c.String(200, "Cart cant be found!")
		return
	}
	wishlistContent.Quantity = updateRequest.NewQty
	err := config.DB.Save(&wishlistContent).Error
	if err != nil {
		c.String(200, "Failed to save the wishlist changes!")
		return
	}
	c.String(200, "Quantity successfully updated!")
}

func UpdateWishlist(c *gin.Context) {
	var UpdateRequest struct {
		WishlistId         uint   `json:"wishlist_id"`
		WishlistName       string `json:"wishlist_name"`
		WishlistVisibility string `json:"wishlist_visibility"`
	}
	err := c.ShouldBindJSON(&UpdateRequest)
	if err != nil {
		c.String(200, "Failed :", err.Error())
		return
	}
	tx := config.DB.Begin()
	var Wishlist model.WishlistHeader
	err = config.DB.Table("wishlist_headers").Where("id = ?", UpdateRequest.WishlistId).First(&Wishlist).Error
	if err != nil {
		tx.Rollback()
		c.String(200, "Failed to find the wishlist!")
		return
	}
	if UpdateRequest.WishlistName != "" {
		Wishlist.Name = UpdateRequest.WishlistName
	}
	if UpdateRequest.WishlistVisibility == "Public" || UpdateRequest.WishlistVisibility == "Private" {
		Wishlist.IsVisible = UpdateRequest.WishlistVisibility == "Public"
	}
	err = config.DB.Save(&Wishlist).Error
	if err != nil {
		tx.Rollback()
		c.String(200, "Failed to parse the wishlist!")
		return
	}
	tx.Commit()
	c.String(200, "Wishlist successfully updated!")
}

type PublicWishlist struct {
	ID           uint            `json:"id"`
	WishlistName string          `json:"wishlist_name"`
	UploadedBy   string          `json:"uploaded_by"`
	TotalPrice   uint            `json:"total_price"`
	ProductCount uint            `json:"product_count"`
	ProductLists []model.Product `json:"product_list"`
}

func GetPublicWishlist(c *gin.Context) {
	page, err := strconv.Atoi(c.Query("page"))
	if err != nil {
		c.String(200, "Failed to parse page parameter!")
		return
	}
	pageSize, err := strconv.Atoi(c.Query("size"))
	if err != nil {
		c.String(200, "Failed to parse page size parameter")
		return
	}
	filter := c.Query("filter")
	id, err := strconv.Atoi(c.Query("user_id"))
	if err != nil {
		c.String(200, "Failed to parse user_id parameter")
		return
	}
	offset := (page - 1) * pageSize
	var publicWishlists []PublicWishlist

	if filter == "All" {
		config.DB.Raw(
			`
			select wh.id, 
			wh.name as wishlist_name, 
			CONCAT(u.first_name, ' ', u.last_name) as uploaded_by, 
			sum(p.product_price) as total_price, 
			count(*) as product_count from wishlist_headers wh
			join wishlist_details wd on wd.id = wh.id
			join products p on p.id = wd.product_id
			join users u on u.id = wh.user_id
			WHERE wh.user_id != ?
			AND is_visible = true
			GROUP BY wh.created_at, wh.id, wh.name, CONCAT(u.first_name, ' ', u.last_name)
			ORDER BY wh.name ASC
			LIMIT ? OFFSET ?
			`, id, pageSize, offset,
		).Scan(&publicWishlists)
	} else if filter == "Created Date" {
		config.DB.Raw(
			`
			select wh.id, 
			wh.name as wishlist_name, 
			CONCAT(u.first_name, ' ', u.last_name) as uploaded_by, 
			sum(p.product_price) as total_price, 
			count(*) as product_count from wishlist_headers wh
			join wishlist_details wd on wd.id = wh.id
			join products p on p.id = wd.product_id
			join users u on u.id = wh.user_id
			WHERE wh.user_id != ?
			AND is_visible = true
			GROUP BY wh.created_at, wh.id, wh.name, CONCAT(u.first_name, ' ', u.last_name)
			ORDER BY wh.created_at DESC
			LIMIT ? OFFSET ?
			`, id, pageSize, offset,
		).Scan(&publicWishlists)
	} else if filter == "Price" {
		config.DB.Raw(
			`
			select wh.id, 
			wh.name as wishlist_name, 
			CONCAT(u.first_name, ' ', u.last_name) as uploaded_by, 
			sum(p.product_price) as total_price, 
			count(*) as product_count from wishlist_headers wh
			join wishlist_details wd on wd.id = wh.id
			join products p on p.id = wd.product_id
			join users u on u.id = wh.user_id
			WHERE wh.user_id != ?
			AND is_visible = true
			GROUP BY wh.created_at, wh.id, wh.name, CONCAT(u.first_name, ' ', u.last_name)
			ORDER BY sum(p.product_price) ASC
			LIMIT ? OFFSET ?
			`, id, pageSize, offset,
		).Scan(&publicWishlists)
	} else if filter == "Follower" {
		config.DB.Raw(
			`
			select wh.id, 
			wh.name as wishlist_name, 
			CONCAT(u.first_name, ' ', u.last_name) as uploaded_by, 
			sum(p.product_price) as total_price, 
			count(*) as product_count from wishlist_headers wh
			join wishlist_details wd on wd.id = wh.id
			join products p on p.id = wd.product_id
			join users u on u.id = wh.user_id
			WHERE wh.user_id != ?
			AND is_visible = true
			GROUP BY wh.created_at, wh.id, wh.name, CONCAT(u.first_name, ' ', u.last_name)
			ORDER BY wh.name ASC
			LIMIT ? OFFSET ?
			`, id, pageSize, offset,
		).Scan(&publicWishlists)
	}

	for index, publicWishlist := range publicWishlists {
		var tempWishlists []model.WishlistDetail
		config.DB.Find(&tempWishlists, "id = ?", publicWishlist.ID)
		var tempProducts []model.Product
		for _, wishlistDetails := range tempWishlists {
			var prod model.Product
			config.DB.First(&prod, "id = ?", wishlistDetails.ProductID)
			tempProducts = append(tempProducts, prod)
		}
		publicWishlists[index].ProductLists = tempProducts
	}
	c.JSON(200, publicWishlists)
}

func FollowWishlist(c *gin.Context) {
	var newFollowWishlist model.WishlistFollower
	err := c.ShouldBindJSON(&newFollowWishlist)
	if err != nil {
		c.String(200, "Failed to bind JSON")
		return
	}
	err = config.DB.Save(&newFollowWishlist).Error
	if err != nil {
		c.String(200, "Failed to follow the wishlist!")
		return
	}
	c.String(200, "Wishlist followed!")
}

func DuplicateWishlist(c *gin.Context) {
	var DuplicateWishlistRequest struct {
		WishlistName   string `json:"wishlist_name"`
		UserId         uint   `json:"user_id"`
		IsVisible      bool   `json:"is_visible"`
		WishlistSource uint   `json:"wishlist_source"`
	}
	err := c.ShouldBindJSON(&DuplicateWishlistRequest)
	if err != nil {
		c.String(200, "Failed to bind json!")
		return
	}
	header := &model.WishlistHeader{
		CreatedAt: time.Now(),
		Name:      DuplicateWishlistRequest.WishlistName,
		UserID:    DuplicateWishlistRequest.UserId,
		IsVisible: DuplicateWishlistRequest.IsVisible,
	}
	err = config.DB.Save(&header).Error
	if err != nil {
		c.String(200, "Failed to create the wishlist!")
		return
	}
	var sources []model.WishlistDetail
	err = config.DB.Find(&sources, "id = ?", DuplicateWishlistRequest.WishlistSource).Error
	if err != nil {
		c.String(200, "Failed to find the wishlist source!")
		return
	}
	for _, source := range sources {
		err = config.DB.Save(&model.WishlistDetail{
			ID:        header.ID,
			ProductID: source.ProductID,
			Quantity:  source.Quantity,
		}).Error
		if err != nil {
			c.String(200, "Error while saving the detail!")
			return
		}
	}
	c.String(200, "Wishlist successfully duplicated!")
}

func GetSinglePublicWishlist(c *gin.Context) {
	id := c.Param("id")
	var publicWishlist PublicWishlist
	config.DB.Raw(
		`
		select wh.id, 
		wh.name as wishlist_name, 
		CONCAT(u.first_name, ' ', u.last_name) as uploaded_by, 
		sum(p.product_price) as total_price, 
		count(*) as product_count from wishlist_headers wh
		join wishlist_details wd on wd.id = wh.id
		join products p on p.id = wd.product_id
		join users u on u.id = wh.user_id
		WHERE wh.id = ?
		AND is_visible = true
		GROUP BY wh.created_at, wh.id, wh.name, CONCAT(u.first_name, ' ', u.last_name)
		ORDER BY wh.name ASC
		LIMIT 1
		`, id,
	).Scan(&publicWishlist)
	var tempWishlists []model.WishlistDetail
	config.DB.Find(&tempWishlists, "id = ?", publicWishlist.ID)
	var tempProducts []model.Product
	for _, wishlistDetails := range tempWishlists {
		var prod model.Product
		config.DB.First(&prod, "id = ?", wishlistDetails.ProductID)
		tempProducts = append(tempProducts, prod)
	}
	publicWishlist.ProductLists = tempProducts
	c.JSON(200, &publicWishlist)
}

func GetAllPublicWishlist(c *gin.Context) {
	var publicWishlist []PublicWishlist
	config.DB.Raw(
		`
		select wh.id, 
		wh.name as wishlist_name, 
		CONCAT(u.first_name, ' ', u.last_name) as uploaded_by, 
		sum(p.product_price) as total_price, 
		count(*) as product_count from wishlist_headers wh
		join wishlist_details wd on wd.id = wh.id
		join products p on p.id = wd.product_id
		join users u on u.id = wh.user_id
		WHERE is_visible = true
		GROUP BY wh.created_at, wh.id, wh.name, CONCAT(u.first_name, ' ', u.last_name)
		ORDER BY wh.name ASC
		`,
	).Scan(&publicWishlist)
	for index, publicWishlistx := range publicWishlist {
		var tempWishlists []model.WishlistDetail
		config.DB.Find(&tempWishlists, "id = ?", publicWishlistx.ID)
		var tempProducts []model.Product
		for _, wishlistDetails := range tempWishlists {
			var prod model.Product
			config.DB.First(&prod, "id = ?", wishlistDetails.ProductID)
			tempProducts = append(tempProducts, prod)
		}
		publicWishlist[index].ProductLists = tempProducts
	}
	c.JSON(200, publicWishlist)
}

func CommentOnWishlist(c *gin.Context) {
	var commentRequest struct {
		WishlistId uint   `json:"wishlist_id"`
		Comment    string `json:"comment"`
		UploadedBy int    `json:"uploaded_by"`
		CommentAs  string `json:"comment_as"`
	}
	err := c.ShouldBindJSON(&commentRequest)
	if err != nil {
		c.String(200, "Failed to bind request JSON!")
		return
	}
	var upload int
	if commentRequest.CommentAs == "Comment as yourself" {
		upload = int(commentRequest.UploadedBy)
	} else {
		upload = -1
	}
	comment := model.WishlistComment{
		WishlistID: commentRequest.WishlistId,
		Comment:    commentRequest.Comment,
		UploadedBy: upload,
	}
	err = config.DB.Save(&comment).Error
	if err != nil {
		c.String(200, "Failed to save the comment!")
		return
	}
	c.String(200, "Comment successfully posted!")
}
