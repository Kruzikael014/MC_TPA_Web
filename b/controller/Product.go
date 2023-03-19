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

func GetShopProductPaginated(c *gin.Context) {
	shopId := c.Query("uploaded_by")
	products := []model.Product{}

	page, _ := strconv.Atoi(c.Query("page"))
	if page == 0 {
		page = 1
	}

	pageSize := 50
	offset := (page - 1) * pageSize

	config.DB.Where("uploaded_by = ?", shopId).Limit(pageSize).Offset(offset).Find(&products)

	c.JSON(200, &products)
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

func GetProductCategory(c *gin.Context) {
	var GetProductReq struct {
		Uploaded_by uint `json:"uploaded_by"`
	}
	c.ShouldBindJSON(&GetProductReq)
	type ProductCategory struct {
		ProductCategory string `json:"product_category"`
		ProductImage    string `json:"product_image"`
		ProductId       uint   `json:"id"`
	}
	var products []ProductCategory
	rows, err := config.DB.Raw("select distinct product_category, max(product_image), max(id) from products WHERE uploaded_by = ? group by product_category", GetProductReq.Uploaded_by).Rows()
	if err != nil {
		c.String(200, "Failed to query the category!")
		return
	}
	defer rows.Close()
	for rows.Next() {
		var product ProductCategory
		err := rows.Scan(&product.ProductCategory, &product.ProductImage, &product.ProductId)

		if err != nil {
			c.String(200, "Failed to bind query result!")
			return
		}
		products = append(products, product)
	}
	c.JSON(200, &products)
}

func FetchLowPricedProduct(c *gin.Context) {
	var FetchLowPricedProductReq struct {
		Uploaded_by uint `json:"uploaded_by"`
		Page        int  `json:"page"`
	}
	c.ShouldBindJSON(&FetchLowPricedProductReq)

	pageSize := 50

	offset := (FetchLowPricedProductReq.Page - 1) * pageSize
	limit := pageSize

	var products []Product
	rows, err := config.DB.Raw(`SELECT 
	p.id, p.product_name, p.product_image, p.product_price, p.product_stock, p.uploaded_by, p.rating
FROM 
	products p
WHERE 
	uploaded_by = ? 
ORDER BY 
	product_price ASC 
LIMIT ? OFFSET ?`, FetchLowPricedProductReq.Uploaded_by, limit, offset).Rows()
	if err != nil {
		c.String(200, "Failed to query the filter!")
		return
	}
	defer rows.Close()
	for rows.Next() {
		var product Product
		if err := config.DB.ScanRows(rows, &product); err != nil {
			c.String(200, "Failed to bind query result!")
			return
		}
		products = append(products, product)
	}
	c.JSON(200, &products)
}

func FetchhighPricedProduct(c *gin.Context) {
	var FetchhighPricedProductReq struct {
		Uploaded_by uint `json:"uploaded_by"`
		Page        int  `json:"page"`
	}
	c.ShouldBindJSON(&FetchhighPricedProductReq)

	pageSize := 50

	offset := (FetchhighPricedProductReq.Page - 1) * pageSize
	limit := pageSize

	var products []Product
	rows, err := config.DB.Raw(`SELECT 
	p.id, p.product_name, p.product_image, p.product_price, p.product_stock, p.uploaded_by, p.rating
FROM 
	products p
WHERE 
	uploaded_by = ? 
ORDER BY 
	product_price DESC 
LIMIT ? OFFSET ?`, FetchhighPricedProductReq.Uploaded_by, limit, offset).Rows()
	if err != nil {
		c.String(200, "Failed to query the filter!")
		return
	}
	defer rows.Close()
	for rows.Next() {
		var product Product
		if err := config.DB.ScanRows(rows, &product); err != nil {
			c.String(200, "Failed to bind query result!")
			return
		}
		products = append(products, product)
	}
	c.JSON(200, &products)
}

func FetchMostBoughtProduct(c *gin.Context) {
	var FetchMostBoughtProductReq struct {
		Uploaded_by uint `json:"uploaded_by"`
		Page        int  `json:"page"`
	}

	c.ShouldBindJSON(&FetchMostBoughtProductReq)

	pageSize := 50

	offset := (FetchMostBoughtProductReq.Page - 1) * pageSize

	rows, err := config.DB.Raw(`
	SELECT p.id, p.product_name, p.product_image, p.product_price, p.product_stock, p.uploaded_by, p.rating
	FROM transactions tr 
	JOIN carts c ON c.cart_id = tr.cart_id 
	JOIN products p ON c.product_id = p.id 
	WHERE uploaded_by = ? 
	GROUP BY p.id 
	ORDER BY COUNT(*) DESC 
	LIMIT ? OFFSET ?
	`, FetchMostBoughtProductReq.Uploaded_by, pageSize, offset).Rows()
	if err != nil {
		c.String(200, "Failed to query the filter!")
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var product Product
		if err := config.DB.ScanRows(rows, &product); err != nil {
			c.String(200, "Failed to bind query result!")
			return
		}
		products = append(products, product)
	}
	c.JSON(200, &products)
}

type Product struct {
	ID            uint   `json:"id"`
	ProductName   string `json:"product_name"`
	ProductImage  string `json:"product_image"`
	ProductPrice  uint   `json:"product_price"`
	ProductStock  uint   `json:"product_stock"`
	UploadedBy    uint   `json:"uploaded_by"`
	ProductRating uint   `json:"product_rating"`
}

func GetProductCount(c *gin.Context) {
	uploadedBy, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.String(200, "Failed to get the parameters!")
		return
	}

	var count int64
	err = config.DB.Raw("SELECT COUNT(*) FROM products WHERE uploaded_by = ?", uploadedBy).Scan(&count).Error
	if err != nil {
		c.String(200, "Failed to get product count")
		return
	}
	c.String(200, strconv.Itoa(int(count)))
}

func GetSimilarProduct(c *gin.Context) {
	var category = strings.ToLower(c.Query("category"))
	var recommendations []model.Product
	err := config.DB.Find(&recommendations, "LOWER(product_category) LIKE ?", "%"+category+"%").Error
	if err != nil {
		c.String(200, "Cant find similar product recommendation!")
		return
	}
	c.JSON(200, &recommendations)
}
