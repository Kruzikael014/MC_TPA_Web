import ButtonInput from "@/components/ButtonInput"
import Footer from "@/components/Footer"
import HeaderModule from "@/components/HeaderModule"
import InputField from "@/components/InputField"
import LargeProductCard from "@/components/LargeProductCard"
import LiveImage from "@/components/LiveImage"
import MediumProductCard from "@/components/MediumProductCard"
import Navbar from "@/components/Navbar"
import ThemeToggle from "@/components/ThemeToggle"
import API from "@/env"
import s from "@/styles/HomePage.module.css"
import AddCartRequest from "@/types/AddCartRequest"
import Product from "@/types/Product"
import User from "@/types/User"
import WishlistDetail from "@/types/WishlistDetail"
import WishlistHeader from "@/types/WishlistHeader"
import getCookie from "@/util/GetCookie"
import { getUrl } from "@/util/ImageController"
import axios from "axios"
import Image from "next/image"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import AddCart from "../api/Cart-APIs/AddCart"
import GetRecommendation from "../api/Product-APIs/GetRecommendation"
import GetSingleProduct from "../api/Product-APIs/GetSingleProduct"
import getUserFromToken from "../api/User-APIs/getuser"
import AddToWishlist from "../api/Wishlist-APIs/AddToWishlist"
import GetUserWishlist from "../api/Wishlist-APIs/GetUserWishlist"

interface ProductDetailProp
{
  product: Product
}

const ProductDetail = (props: ProductDetailProp) =>
{

  const [desiredQty, setDesiredQty] = useState(0)

  const { product } = props

  const [imageUrl, setImageUrl] = useState("")
  const [selectedWishlist, setSelectedWishlist] = useState("")
  const [wishlistHeader, setWishlistHeader] = useState<WishlistHeader[] | undefined>(undefined)
  const [user, setUser] = useState<User | undefined>(undefined)
  const router = useRouter()
  const [saveWishlist, setSaveWishlist] = useState(false)
  const [recommendation, setRecommendation] = useState<Product[] | string | undefined>(undefined)


  useEffect(() =>
  {

    const getCurrUser = async () =>
    {
      const ob = {
        JWToken: getCookie("JWToken")
      }
      const response = await getUserFromToken(ob)
      setUser(prevUser => ({
        ...prevUser,
        id: response.id,
        First_name: response.first_name,
        Last_name: response.last_name,
        Email: response.email,
        Password: response.password,
        Phone_num: response.phone_num,
        Email_subscriber: response.email_subscriber,
        Status: response.status,
        Role_name: response.role_name,
        balance: response.balance
      }))
    }

    getCurrUser()

  }, [])


  useEffect(() =>
  {

    const fetchWishlist = async () =>
    {
      if (user !== undefined)
      {

        const response = await GetUserWishlist(Number(user.id))
        if (Array.isArray(response) === false) alert(response)
        else setWishlistHeader(response)

      }
    }
    fetchWishlist()

  }, [user])


  useEffect(() =>
  {
    const getImageUrl = async () =>
    {
      const response = await getUrl(product?.product_image)
      setImageUrl(response)
    }
    getImageUrl()
  }, [])

  const addToCart = async () =>
  {

    if (user?.id === undefined)
    {
      alert("You must login first")
      return
    }

    if (desiredQty === 0 || desiredQty <= 0 || desiredQty > product.product_stock)
    {
      alert("Invalid quantity")
      return
    }

    alert("Adding " + product?.product_name + " with " + desiredQty + " quantity" + " the product  rating : " + product?.product_rating);

    const newItem: AddCartRequest = {
      product_id: product.id,
      user_id: user?.id,
      quantity: Number(desiredQty),
      delivery_status: 'In progress'
    }

    const response = await AddCart(newItem)

    console.log(response);
  }

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

  const handleStoreVisit = () =>
  {
    router.push(`/shop-page/${product.uploaded_by}`)
  }

  useEffect(() =>
  {
    const fetchRecommendation = async () =>
    {
      if (product !== undefined)
      {
        const response = await GetRecommendation(product.product_category)
        setRecommendation(response)
      }
    }
    fetchRecommendation()
  }, [product])

  const handleWishlistClick = () =>
  {
    setSaveWishlist(!saveWishlist)
  }

  const handleWishlistSelect = async (e:any) =>
  {
    e.preventDefault()
    if (selectedWishlist === "")
    {
      alert("Cant be empty")
      return
    }
    const request:WishlistDetail = {
      id: Number(selectedWishlist),
      product_id: Number(product.id),
      quantity: 1
    }
    const response = await AddToWishlist(request)
    if (response === "Item successfully saved to wishlist!") {
      alert(response)
      router.push("/")
      return
    }
    alert(response)
  }

  const cancelSave = () => {
    setSaveWishlist(false)
  }



  return (
    <>
      <div className={`${s.wishlistpopup} ${(saveWishlist) ? s.show : ""}`}>
        <h1>
          Choose wishlist
        </h1>
        <form onSubmit={handleWishlistSelect}>
          <center>
            <select onChange={(e) => { setSelectedWishlist(e.target.value) }} style={{ marginTop: "1rem",width: "400px", height: "30px", borderRadius: "10px" }}>
              <option value=""></option>
              {
                Array.isArray(wishlistHeader) &&
                wishlistHeader.map((wishlist: WishlistHeader) =>
                {
                  return (
                    <option value={wishlist.wishlist_id}>{wishlist.wishlist_name}</option>
                  )
                })
              }
            </select>
          </center>
          <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", position: "absolute", bottom: "3rem", width: "100%", transform: "translateX(-5%)" }}>
            <ButtonInput placeholder="Cancel" width={150} blue func={cancelSave} />
            <ButtonInput placeholder="Add" width={150} blue submit />
          </div>
        </form>
      </div>
      <ThemeToggle />
      <HeaderModule />
      <Navbar />
      <div className={s.productdetail}>
        <div className={s.detailcontent}>
          <div className={s.directorybar}>
          </div>
          <div className={s.detail}>
            <div className={s.imagesection}>
              <LiveImage imageUrl={product.product_image} width={600} height={450} />
            </div>
            <h4 onClick={handleStoreVisit} className={s.visitstore}>
              Visit store
            </h4>
            <div className={s.midsection}>
              <div className={s.namecontainer}>
                <h1>
                  {product?.product_name}
                </h1>
                <i className="fa-solid fa-bookmark fa-2x" title="Add item to wishlist" onClick={handleWishlistClick}></i>
              </div>
              <div className={s.raterev}>
                <div>
                  {(product?.product_rating !== undefined) ? product.product_rating : 1}/5
                </div>
                <div>
                  Write a review
                </div>
              </div>
              <div className={s.seemore}>
                <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                <div>
                  See more
                </div>
                <div>
                  "{product?.product_name}"
                </div>
              </div>
              <div>
                {
                  (product.product_stock !== 0
                    &&
                    product.product_stock !== undefined) ?
                    `In stock (${product.product_stock} pcs)` :
                    "Product out of stock"
                }
              </div>
              <div>
                Ships from United States
              </div>
              <div className={s.banner} onClick={(e) => { router.push("/build-pc") }}>
                Build PC
              </div>
              <div>
                <h2>
                  Category
                </h2>
                <h3>
                  {product.product_category}
                </h3>
              </div>
              <div>
                <ul>
                  {parseProductDetail(product?.product_details).map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={s.rightsection}>
              <div className={s.shippedby}>
                <i></i>
                <div>
                  sold & shipped by OldEgg
                </div>
              </div>
              <div>
                Rp 9,000 shipping
              </div>

              <div>
                Estimated price

              </div>
              <div className={s.detailprice}>
                {/* Rp {product?.product_price.toLocaleString()} */}
              </div>

              <div className={s.buttonqty}>
                <InputField numberQty required onChange={setDesiredQty} value={desiredQty} width={50} height={44} />
                <ButtonInput orange placeholder="Add to cart" func={addToCart} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={s.similarproductrecommendation}>
        <h1>
          Similar Product
        </h1>
        <div className={s.productlist}>
          {
            Array.isArray(recommendation) &&
            recommendation.map((product: Product, index: number) =>
            {
              return (
                <div>
                  {/* <MediumProductCard index={index} product={product}  /> */}
                  <LargeProductCard index={index} product={product} />
                </div>
              )
            })
          }
          {
            Array.isArray(recommendation) === false &&
            <h1>No similar product!</h1>
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProductDetail

export async function getStaticPaths()
{

  const response = await fetch(`${API}/products/all`)
  const products = await response.json()

  const paths = products.map((product: Product) => ({
    params: {
      id: String(product.id),
    }
  }))

  return {
    paths,
    fallback: false,
  }
}

interface GetStaticProps
{
  params: {
    id: string;
  }
}

export async function getStaticProps(context: GetStaticProps)
{

  const { id } = context.params

  const response = await fetch(`${API}/product/${id}`)
  const product: Product = await response.json()

  return {
    props: {
      product,
    }
  }

}