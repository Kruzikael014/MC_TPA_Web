
import RemoveCartItem from "@/pages/api/Cart-APIs/RemoveCartItem";
import UpdateCartQty from "@/pages/api/Cart-APIs/UpdateCartQty";
import RemoveWishlistItem from "@/pages/api/Wishlist-APIs/RemoveWishlistItem";
import UpdateWishlistQty from "@/pages/api/Wishlist-APIs/UpdateWishlistQty";
import s from "@/styles/HomePage.module.css"
import CartItem from "@/types/Cart";
import Product from "@/types/Product";
import RemoveCartRequest from "@/types/RemoveCartRequest";
import UpdateRequest from "@/types/UpdateRequest";
import WishlistDetail from "@/types/WishlistDetail";
import { useEffect, useState } from "react";
import InputField from "./InputField";
import LiveImage from "./LiveImage";

interface ProductCardProps
{
  product: Product
  wishlistDetail: WishlistDetail
}


const ProductCard = (props: ProductCardProps) =>
{

  const { product, wishlistDetail } = props

  const { product_id, quantity } = wishlistDetail
  const { product_category, product_description, product_details, product_image, product_name, product_price, product_rating, product_stock, uploaded_by, id } = product
  const [currQuantity, setCurrQuantity] = useState(0)

  const parseProductDetail = (detail: string | undefined): string[] =>
  {

    if (detail !== undefined)
    {
      return detail.split(';'
      ).map((item) => item.trim())
        .filter((item) => item !== "" && item !== " ")
    } else
    {
      return [""]
    }
  };

  const handleQtyChange = async (e: any) =>
  {

    const newQty = e.target.value
    setCurrQuantity(newQty)
    const request = {
      wishlist_id: Number(wishlistDetail.id),
      new_qty: Number(newQty),
      product_id: Number(product_id)
    }
    const response = await UpdateWishlistQty(request)
    console.log(response);

  }

  const handleRemoveClick = async () =>
  {
    const request = {
      wishlist_id: Number(wishlistDetail.id),
      product_id: Number(id)
    }
    const response = await RemoveWishlistItem(request)
    alert(response)
    window.location.reload()
  }


  return (
    <>
      <div className={s.ProductCard}>
        <div className={s.imagecontainer}>
          <LiveImage width={200} imageUrl={product_image} />
        </div>
        <div className={s.middlesection}>
          <h1>
            {product_name}
          </h1>
          <ul>
            {
              parseProductDetail(product_details).map((detail) =>
              {
                return (
                  <>
                    <li>
                      <h5>
                        {detail}
                      </h5>
                    </li>
                  </>
                )
              })
            }
          </ul>
        </div>
        <div className={s.rightsection}>
          <div>
            <input className={s.qtyinput} type="number" min={1} defaultValue={quantity} max={product_stock} onChange={handleQtyChange} />
          </div>
          <div className={s.pricesection}>
            <p>
              {`Rp. ${product_price.toLocaleString()}, -`}
            </p>
            <button className={s.delbut} onClick={handleRemoveClick}>
              <i className="fa-solid fa-trash"></i>
              <span>
                Remove
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;