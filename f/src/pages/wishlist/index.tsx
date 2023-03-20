import ButtonInput from "@/components/ButtonInput";
import CartCard from "@/components/CartCard";
import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import InputField from "@/components/InputField";
import MediumProductCard from "@/components/MediumProductCard";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ThemeToggle from "@/components/ThemeToggle";
import s from "@/styles/HomePage.module.css"
import Product from "@/types/Product";
import User from "@/types/User";
import WishlistDetail from "@/types/WishlistDetail";
import WishlistHeader from "@/types/WishlistHeader";
import getCookie from "@/util/GetCookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GetSingleProduct from "../api/Product-APIs/GetSingleProduct";
import getUserFromToken from "../api/User-APIs/getuser";
import GetWishlistHeadDetail from "../api/Wishlist-APIs/GetWishlistHeadDetail";
import MoveToCart from "../api/Wishlist-APIs/MoveToCart";
import UpdateWishlistHeader from "../api/Wishlist-APIs/UpdateWishlistHeader";




const WishlistPage = () =>
{

  const router = useRouter()
  const query = router.query
  const [wishlistHeader, setWishlistHeader] = useState<WishlistHeader | undefined>(undefined)
  const [wishlistDetail, setWishlistDetail] = useState<WishlistDetail[] | undefined>(undefined)
  const [products, setProducts] = useState<Product[] | undefined>(undefined)
  const [popUpShow, setPopUpShow] = useState(false)
  const [wishlistName, setWishlistName] = useState("")
  const [wishlistVisibility, setWishlistVisibility] = useState("Public")
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() =>
  {

    const fetchHeaderDetail = async () =>
    {

      const response = await GetWishlistHeadDetail(Number(query.wishlist))
      setWishlistHeader(response.wishlist_header)
      setWishlistDetail(response.wishlist_details)

    }
    fetchHeaderDetail()

  }, [query, popUpShow])

  useEffect(() =>
  {
    const fetchProducts = async () =>
    {
      if (wishlistDetail === undefined)
      {
        return
      }
      if (Array.isArray(wishlistDetail))
      {

        const promises = wishlistDetail.map(async (wishlistDetail: WishlistDetail) =>
        {

          const productResponse: Product = await GetSingleProduct(Number(wishlistDetail.product_id))
          return productResponse

        })

        const products = await Promise.all(promises)
        setProducts(products)

      }
    }
    fetchProducts()
  }, [wishlistHeader, wishlistDetail])

  
  useEffect(() =>
  {
    const getCurrUser = async () =>
    {
      const ob = {
        JWToken: getCookie("JWToken")
      }
      const response = await getUserFromToken(ob)
      setUser(
        {
          First_name: response.first_name,
          Last_name: response.last_name,
          Email: response.email,
          Password: response.password,
          Phone_num: response.phone_num,
          Email_subscriber: response.email_subscriber,
          Role_name: response.role_name,
          Status: response.status,
          id: response.id,
          balance: response.balance
        })
    }
    getCurrUser();
  }, [])

  const handleUpdateForm = async (e: any) =>
  {
    e.preventDefault()
    // console.log(wishlistHeader?.wishlist_id);
    // console.log(wishlistName);
    // console.log(wishlistVisibility);
    const request = {
      wishlist_id: Number(wishlistHeader?.wishlist_id),
      wishlist_name: String(wishlistName),
      wishlist_visibility: String(wishlistVisibility)
    }
    const response = await UpdateWishlistHeader(request)
    alert(response)
    setWishlistName("")
    setWishlistVisibility("Public")
    setPopUpShow(false)
  }

  const cancelSave = () =>
  {
    setPopUpShow(false)
  }

  const handleEditClick = () =>
  {
    setPopUpShow(!popUpShow)
  }

  const handleSaveToCart = async () => {
    // console.log(Number(user?.id));
    // console.log(wishlistHeader?.wishlist_id);
    const request = {
      user_id: Number(user?.id),
      wishlist_id: Number(wishlistHeader?.wishlist_id)
    }

    const response = await MoveToCart(request)
    alert(response)
    
  }

  return (
    <div className={s.wishlistpage}>
      <div className={`${s.updatewishlistpopup} ${(popUpShow) ? s.show : ""}`}>
        <h1>
          Choose wishlist
        </h1>
        <form onSubmit={handleUpdateForm}>
          <center style={{ display: "flex", flexDirection: "column", rowGap: "1rem", justifyContent: "center", alignItems: "center" }}>
            <InputField onChange={setWishlistName} value={wishlistName} placeholder={"Wishlist name"} height={30} text width={350} />
            <select defaultValue={"Public"} onChange={(e) => { setWishlistVisibility(e.target.value) }} style={{ height: "30px", width: "350px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.162453321)", display: "flex", flexDirection: "column", rowGap: "1rem" }} className={s.select} >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </center>
          <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", position: "absolute", bottom: "1rem", width: "100%", transform: "translateX(-5%)" }}>
            <ButtonInput placeholder="Cancel" width={150} blue func={cancelSave} />
            <ButtonInput placeholder="Save" width={150} blue submit />
          </div>
        </form>
      </div>
      <Navbar />
      <HeaderModule />
      <ThemeToggle />
      <div className={s.wishlistcontent}>
        <div style={{ display: "flex", columnGap: "2rem", marginBottom: "3rem" }}>
          <h1>
            {wishlistHeader?.wishlist_name}
          </h1>
          <div style={{ userSelect: "none", cursor: "pointer" }} onClick={handleEditClick}>
            <i className="fa-solid fa-pen-to-square fa-2x"></i>
          </div>
        </div>
        <div className={s.savetocartlabel} onClick={handleSaveToCart}>
          <p>
            Add to Cart
          </p>
        </div>
        <div className={s.wishlistlist}>
          {
            Array.isArray(products) && Array.isArray(wishlistDetail) &&
            products?.map((product: Product, index: number) =>
            {
              return (
                <div className={s.wishlistitem}>
                  <ProductCard wishlistDetail={wishlistDetail[index]} product={product} />
                </div>
              )
            })
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default WishlistPage;