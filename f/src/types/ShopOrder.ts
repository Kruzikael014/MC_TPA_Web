
type ShopOrder = {
  transaction_id?: number
  cart_id?: number,
  quantity?: number,
  product_id?: number,
  product_name?: string,
  product_image?: string
  product_price?: number,
  user_id?: number,
  delivery_status?: string
}

export default ShopOrder