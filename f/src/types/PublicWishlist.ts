import Product from "./Product";

type PublicWishlist = {
  id?: number,
  wishlist_name: string,
  uploaded_by: string,
  total_price: number,
  product_count: number,
  product_list: Product[]
}

export default PublicWishlist