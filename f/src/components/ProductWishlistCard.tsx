import s from "@/styles/HomePage.module.css"
import Product from "@/types/Product";
import { useState } from "react";
import LiveImage from "./LiveImage";

interface ProductCardProps
{
  product: Product
}


const ProductWishlistCard = (props: ProductCardProps) =>
{

  const { product } = props

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
      </div>
    </>
  );
}

export default ProductWishlistCard;