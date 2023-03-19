import getUserFromToken from '@/pages/api/User-APIs/getuser'
import GetUserWishlist from '@/pages/api/Wishlist-APIs/GetUserWishlist'
import s from '@/styles/HomePage.module.css'
import User from '@/types/User'
import WishlistHeader from '@/types/WishlistHeader'
import clearCookie from '@/util/DeleteCookie'
import getCookie from '@/util/GetCookie'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


const Shortcut = () =>
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [wishlistHeader, setWishlistHeader] = useState<WishlistHeader[] | undefined>(undefined)
  const router = useRouter()

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


  const signout = () =>
  {
    // clear cookie 
    clearCookie("JWToken")
    //  reload page
    window.location.reload()
  }

  const createWishlist = () =>
  {
    router.push("/create-wishlist")
  }

  return (
    <>
      <div className={s.shortcutstyles}>

        <div className={s.topcontent}>
          <div className={s.prof}>
            <div className={s.iconcontainer}>
              <i className="fa-regular fa-user fa-2xl"></i>
            </div>
            <div className={s.actualname}>
              <div>
                {user?.First_name}&nbsp;{user?.Last_name}
              </div>
              <div>
                Thank you for being OldEgg customer
              </div>
            </div>
          </div>
          <div className={s.rightsection}>
            <div className={s.rightsubsection}>
              <div>
                <i className="fa-regular fa-user"></i>
              </div>
              <div>
                My Profile
              </div>
            </div>
            <div className={s.rightsubsection} onClick={(e) => { router.push("/account") }}>
              <div>
                <i className="fa-solid fa-gear"></i>
              </div>
              <div>
                Account setting
              </div>
            </div>
            <div className={s.rightsubsection} onClick={signout}>
              <div>
                <i className="fa-solid fa-door-open"></i>
              </div>
              <div>
                Sign out
              </div>
            </div>
          </div>
        </div>

        <div className={s.bottomcontent}>
          <div className={s.leftcompartment}>
            <h2 style={{ marginBottom: "1rem" }}>
              Wishlists
            </h2>
            {
              Array.isArray(wishlistHeader) &&
              wishlistHeader.map((wishlist: WishlistHeader) =>
              {
                return (
                  <div className={s.wishlist}>
                    {wishlist.wishlist_name}
                  </div>
                )
              })
            }
            <div>
              <i className="fa-solid fa-plus" onClick={createWishlist}></i>
              Add a wishlist
            </div>
          </div>
          <div className={s.centercompartment}>
            <h2 style={{ marginBottom: "1rem" }}>
              Build PC
            </h2>
          </div>
          <div className={s.rightcompartment}>
            <h2 style={{ marginBottom: "1rem" }}>
              Account Setting
            </h2>
          </div>
        </div>
      </div>
    </>
  )

}

export default Shortcut;