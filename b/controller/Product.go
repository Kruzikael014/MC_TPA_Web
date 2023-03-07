package controller

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Kruzikael014/oldegg-backend/config"
	"github.com/Kruzikael014/oldegg-backend/model"
	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	Products := []model.Product{}
	config.DB.Find(&Products)
	c.JSON(200, &Products)
}

func GetProduct(c *gin.Context) {
	var Product model.Product
	id := c.Param("id")
	config.DB.First(&Product, "id = ?", id)
	if Product.ID == 0 {
		c.JSON(http.StatusOK, gin.H{
			"error": "Product not found",
		})
		return
	}
	c.JSON(200, &Product)
}

func GetShopProduct(c *gin.Context) {
	shopId := c.Query("uploaded_by")
	products := []model.Product{}
	config.DB.Where("uploaded_by = ?", shopId).Find(&products)
	c.JSON(200, &products)
}

func CreateProduct(c *gin.Context) {
	var Product model.Product
	c.BindJSON(&Product)

	config.DB.Create(&Product)
	c.JSON(200, &Product)
}

func DeleteProduct(c *gin.Context) {
	var Product model.Product
	config.DB.Where("id = ?", c.Param("id")).Delete(&Product)
	c.JSON(200, &Product)
}

func UpdateProduct(c *gin.Context) {
	var NewProduct model.Product
	var Product model.Product
	config.DB.Where("id = ?", c.Param("id")).First(&Product)
	c.BindJSON(&NewProduct)
	Product = NewProduct

	config.DB.Save(&Product)
	if !c.Writer.Written() {
		c.JSON(200, &Product)
	}
}

func fetchTwentyWithOffset(offset int) ([]model.Product, error) {
	db := config.DB
	Products := []model.Product{}

	err := db.Offset(offset).Limit(20).Find(&Products).Error
	if err != nil {
		return nil, err
	}

	return Products, nil
}

func GetProductsOffset(c *gin.Context) {
	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	Products, err := fetchTwentyWithOffset(offset)
	if err != nil {
		c.AbortWithError(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, Products)
}

func SearchProduct(c *gin.Context) {
	query := c.Query("name")

	if query == "" {
		c.String(http.StatusOK, "missing query parameter 'name'")
		return
	}

	var product model.Product
	result := config.DB.Where("LOWER(product_name) LIKE ?", "%"+strings.ToLower(query)+"%").First(&product)

	if result.Error != nil {
		c.String(http.StatusOK, "failed to search for products")
		return
	}

	c.JSON(http.StatusOK, product)
}
