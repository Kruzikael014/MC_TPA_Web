type AddCartRequest = {
  cart_id?: number | undefined,
  user_id: number | undefined,
  product_id: number | undefined,
  quantity: number | undefined
  delivery_status : string | undefined
}

export default AddCartRequest