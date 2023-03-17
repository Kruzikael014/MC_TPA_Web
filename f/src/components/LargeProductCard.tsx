import styles from "@/styles/HomePage.module.css"
import Product from "@/types/Product";
import { getUrl } from "@/util/ImageController";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DeleteShopProduct from "../pages/api/DeleteShopProduct";
import { changeFunc } from "../pages/HomePage/ShopOwner";
import LiveImage from "./LiveImage";

interface ProductCard
{
  product: Product,
  index: number,
  fullaccess?: boolean
}

const LargeProductCard = ({ product, index, fullaccess }: ProductCard) =>
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
    <>
      <div className={styles.largeproductcard} >
        {/* <div>{product_category}</div>
        <div>{product_description}</div> */}
        <br />
        <div>
          {/* <Image src={imageUrls ? imageUrls : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"}
            width={380}
            height={280}
            alt="not found"
            onClick={handleCardClick}
          /> */}
          <LiveImage imageUrl={product_image} width={380} height={280} />
        </div>
        <div className={styles.productname}>{product_name}</div>
        <br />
        <div className={styles.productprice}>Rp. {product_price.toLocaleString()}</div>
        {
          fullaccess &&
          <div className={styles.buttons}>
            <button onClick={(e) => { handleUpdate() }} className={`${styles.button} ${styles.colgreen}`}>
              <i className="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Update
            </button>
            <button onClick={(e) => { handleDelete() }} className={`${styles.button} ${styles.colred}`}>
              <i className="fa-solid fa-trash"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              Delete
            </button>
          </div>
        }

      </div>
    </>
  );
};

export default LargeProductCard;