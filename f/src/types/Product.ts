
type Product = {
  id?: number,
  product_name: string,
  product_category: string,
  product_image: string | undefined,
  product_description: string,
  product_price: number,
  product_stock: number,
  product_details: string,
  uploaded_by: number
  product_rating: number
}

export default Product