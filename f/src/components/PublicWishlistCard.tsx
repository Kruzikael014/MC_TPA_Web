import PublicWishlist from "@/types/PublicWishlist";
import s from '@/styles/HomePage.module.css'
import LiveImage from "./LiveImage";
import Product from "@/types/Product";
import { useEffect, useState } from "react";
import MediumProductCard from "./MediumProductCard";
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import getUserFromToken from "@/pages/api/User-APIs/getuser";
import FollowWishlist from "@/pages/api/Wishlist-APIs/FollowWishlist";
import DuplicateWishlist from "@/pages/api/Wishlist-APIs/DuplicateWishlist";
import InputField from "./InputField";
import ButtonInput from "./ButtonInput";
import { useRouter } from "next/router";


interface PublicWishlistCardInterface
{
  list: PublicWishlist,
}

const PublicWishlistCard = (props: PublicWishlistCardInterface) =>
{

  const { list } = props
  const { product_count, product_list, total_price, uploaded_by, wishlist_name, id } = list
  const [buttonAppearance, setButtonAppearance] = useState(false)
  const [wishlistName, setWishlistName] = useState("")
  const [isVisible, setIsVisible] = useState("Public")
  const [user, setUser] = useState<User | undefined>(undefined)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

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

  const handleFollow = async () =>
  {
    const request = {
      wishlist_id: Number(id),
      follower_id: Number(user?.id),
    }
    const response = await FollowWishlist(request)
    alert(response)
  }

  const handleDuplicate = () =>
  {
    setShowForm(true)
  }

  const duplicatePublicWishlist = async (e:any) =>
  {
    e.preventDefault()
    const request = {
      wishlist_name: wishlistName,
      is_visible: (isVisible === "Public") ? true : false,
      wishlist_source: Number(id),
      user_id: Number(user?.id),
    }
    const response = await DuplicateWishlist(request)
    alert(response)
    setShowForm(false)
  }

  
  const handleDetailClick = () =>
  {

    router.push(`/public-wishlist/${id}`)

  }


  return (
    <div className={s.publicwishlistcard} onMouseLeave={(e) => { setButtonAppearance(false) }} onMouseEnter={(e) => { setButtonAppearance(true) }} onClick={handleDetailClick}>
      {
        showForm &&
        <div className={s.duplicform}>
          <form className={s.form} onSubmit={duplicatePublicWishlist}>
            <div className={s.aformdi}>
              <div className={s.left}>
                <h2>
                  Wishlist name
                </h2>
              </div>
              <div className={s.right}>
                <h2>
                  :
                </h2>
                <h2>
                  <InputField width={400} height={30} onChange={setWishlistName} text value={wishlistName} />
                </h2>
              </div>
            </div>
            <div className={s.aformdi}>
              <div className={s.left}>
                <h2>
                  Wishlist Visibility
                </h2>
              </div>
              <div className={s.right}>
                <h2>
                  :
                </h2>
                <h2>
                  <select onChange={(e) => { setIsVisible(e.target.value) }} style={{ width: "400px", height: "30px" }}>
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                  </select>
                </h2>
              </div>
            </div>
            <div className={s.buttons}>
              <ButtonInput blue centered width={200} placeholder={"Cancel"} func={() => { setShowForm(false) }} />
              <ButtonInput blue centered width={200} placeholder={"Duplicate"} submit />
            </div>
          </form>
        </div>
      }
      <div className={`${s.foldupbut} ${(buttonAppearance) ? s.show : ""}`}>
        <h2 onClick={handleFollow} className={s.follab}>
          Follow
        </h2>
        <h2 onClick={handleDuplicate} className={s.duplab}>
          Duplicate
        </h2>
      </div>
      <h1>
        {wishlist_name}
      </h1>
      <div className={s.contentcontainer}>
        <div className={s.wishitem}>
          {product_list?.map((product, index) =>
          {
            return (
              <MediumProductCard index={index} product={product} />
            )
          })}
        </div>
        <div className={s.wishcardstat}>
          <h2>
            {product_count} item(s)
          </h2>
          <h2>
            View Detail
          </h2>
          <h2>
            by {uploaded_by}
          </h2>
          <h2>
            Rp {total_price.toLocaleString()}
          </h2>
        </div>
      </div>



    </div>
  );
}

export default PublicWishlistCard;