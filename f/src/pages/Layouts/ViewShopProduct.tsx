import styles from "@/styles/HomePage.module.css"
import Product from "@/types/Product"
import getCookie from "@/util/GetCookie"
import { getUrl } from "@/util/ImageController"
import { useEffect, useState } from "react"
import GetShopProduct from "../api/GetShopProduct"
import getUserFromToken from "../api/getuser"
import LargeProductCard from "../../components/LargeProductCard"
import MediumProductCard from "@/components/MediumProductCard"



export default function ViewShopProduct()
{

  // bisa sekalian buat details

  const [products, setProducts] = useState<Array<Product> | undefined>(Array<Product>)
  


  useEffect(() =>
  {
    const fetchShopItem = async () =>
    {
      const ob = {
        JWToken: getCookie("JWToken")
      }
      const user = await getUserFromToken(ob)

      const products = await GetShopProduct(user.id)
      console.log(products)
      setProducts(products)
    }

    fetchShopItem()

  }, [])


  return (
    <>
      <div className={styles.ViewShopProduct}>
        <h1 className={styles.makeitbigger}>
          Your product
        </h1>
        <div className={styles.shopproductcontainer} >
          {
            (products?.length === 0) ? 
            <h3> You dont have any product right now!</h3>
            :
            products?.map((product: Product, index: number) =>
            {
              return (
                <LargeProductCard key={index} product={product} index={index} />
              )
            })
          }
        </div>
      </div>
    </>
  )
} 