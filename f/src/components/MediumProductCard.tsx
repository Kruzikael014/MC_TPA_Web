import styles from "@/styles/HomePage.module.css"
import Product from "@/types/Product";
import { getUrl } from "@/util/ImageController";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DeleteShopProduct from "../pages/api/Product-APIs/DeleteShopProduct";
import { changeFunc } from "../pages/HomePage/ShopOwner";

interface ProductCard
{
  product: Product,
  index: number
}

const MediumProductCard = ({ product, index }: ProductCard) =>
{
  const { product_category, product_description, product_details, product_image, product_name, product_price, product_stock, uploaded_by, id }
    = product

  const router = useRouter()

  const [imageUrls, setImageUrls] = useState("")

  const parseProductDetail = (detail: string): string[] =>
  {
    return detail.split(';'
    ).map((item) => item.trim())
      .filter((item) => item !== "" && item !== " ")
  };

  useEffect(() =>
  {
    const fetchShopItem = async () =>
    {
      const url = await getUrl(product_image)
      setImageUrls(url)
    }
    fetchShopItem()
  }, [])

  const handleDelete = async () =>
  {
    console.log(`Delete item id ${id}`);
    const response = await DeleteShopProduct(id)
    alert(response)
    window.location.reload()
  }

  const handleUpdate = async () =>
  {
    console.log("show update form");
    changeFunc(5)
    router.push(
      {
        pathname: "/",
        query: {
          updateId: id
        }
      }
    )
  }

  const handleCardClick = () =>
  {
    router.push(`/Product/${id}`)
  }

  return (
    <div className={styles.mediumproductcard} >
      <br />
      <div>
        <Image src={imageUrls ? imageUrls : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"}
          alt="not found"
          width={290}
          height={350}
          onClick={handleCardClick}
        />
      </div>
      <div className={styles.productname}>{product_name}</div>
      <br />
      <div className={styles.productprice}>Rp. {product_price.toLocaleString()}</div>

      <div>
        {product.id}
      </div>
    </div>
  );
};

export default MediumProductCard;