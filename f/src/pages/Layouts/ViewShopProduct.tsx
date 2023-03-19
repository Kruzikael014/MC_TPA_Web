import styles from "@/styles/HomePage.module.css"
import Product from "@/types/Product"
import getCookie from "@/util/GetCookie"
import { getUrl } from "@/util/ImageController"
import { useEffect, useState } from "react"
import GetShopProduct from "../api/Product-APIs/GetShopProduct"
import getUserFromToken from "../api/User-APIs/getuser"
import LargeProductCard from "../../components/LargeProductCard"
import MediumProductCard from "@/components/MediumProductCard"
import User from "@/types/User"
import GetFilteredShopProduct from "../api/Product-APIs/GetFilteredShopProduct"
import GetUserFromId from "../api/User-APIs/GetUserFromId"
import GetProductCount from "../api/Product-APIs/GetProductCount"

interface ViewShopProductProps
{
  notauthorized?: boolean,
  id?: number
}

export default function ViewShopProduct(props: ViewShopProductProps)
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [products, setProducts] = useState<Array<Product> | undefined>(Array<Product>)
  const [productCount, setProductCount] = useState("-")

  const { notauthorized, id } = props

  const [filter, setFilter] = useState("all")
  const [page, setPage] = useState(1)

  useEffect(() =>
  {
    const fetchUser = async () =>
    {

      if (id)
      {
        const user = await GetUserFromId(Number(id))
        setUser(user)
      }
      else
      {
        const ob = {
          JWToken: getCookie("JWToken")
        }
        const user = await getUserFromToken(ob)
        setUser(user)
      }
    }
    fetchUser()

  }, [])

  useEffect(() =>
  {
    const fetchProduct = async () =>
    {
      if (user !== undefined)
      {
        const products = await GetShopProduct(user?.id, page)
        console.log(products);
        setProducts(products)
      }
    }
    fetchProduct()
  }, [page, user])

  const decreasePage = () =>
  {
    if (page - 1 !== 0)
    {
      setPage(page - 1)
    }
  }

  const increasePage = () =>
  {
    setPage(page + 1)
  }

  useEffect(() =>
  {
    const fetchProduct = async () =>
    {
      const request: Object = {
        uploaded_by: user?.id,
        page: page
      }
      const products = await GetFilteredShopProduct(request, filter)
      console.log(products);
      setProducts(products)
    }
    fetchProduct()

  }, [page, filter])

  const handleFilterChange = (e: any) =>
  {
    setPage(1)
    setFilter(e.target.value)
  }


  useEffect(() =>
  {

    const getProductCount = async () =>
    {
      if (user !== undefined)
      {
        console.log(user);
        console.log(user.id);
        
        const response = await GetProductCount(Number(user.id))
        setProductCount(response)
      }
    }
    getProductCount()

  }, [user])

  return (
    <>
      <div className={styles.ViewShopProduct}>
        <div className={styles.header}>
          <h1 className={styles.makeitbigger}>
            Your product ({productCount})
          </h1>
          <h3>
            <div className={styles.horidiv}>
              <div className={styles.vertibutt}>
                <p>
                  <b>
                    Filter by
                  </b>
                </p>
                <select defaultValue={"Choose filter"} onChange={handleFilterChange} >
                  <option value="Choose filter" disabled>
                    Choose filter
                  </option>
                  <option value="Lowest Price">
                    Lowest Price
                  </option>
                  <option value="Highest Price">
                    Highest Price
                  </option>
                  <option value="Most Bought">
                    Most Bought
                  </option>
                </select>
              </div>
              <div className={styles.vertibutt}>
                Page
                <div className={styles.paginatorgroup}>
                  <div className={styles.lt} onClick={decreasePage}>
                    &lt;
                  </div>
                  <input type="number" value={page} min={0} contentEditable={false} />
                  <div className={styles.gt} onClick={increasePage}>
                    &gt;
                  </div>
                </div>
              </div>
            </div>
          </h3>
        </div>
        <div className={styles.shopproductcontainer} >
          {
            (products?.length === 0) ?
              <h3> You dont have any product right now!</h3>
              :
              (Array.isArray(products)) ?
                products?.map((product: Product, index: number) =>
                {
                  return (
                    <LargeProductCard fullaccess={(notauthorized) ? false : true} key={index} product={product} index={index} />
                  )
                })
                :
                <h3> You dont have any product right now!</h3>
          }
        </div>
      </div>
    </>
  )
} 