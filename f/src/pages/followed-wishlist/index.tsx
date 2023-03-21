import FollowedWishlistCard from "@/components/FollowedWishlistCard";
import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import PublicWishlistCard from "@/components/PublicWishlistCard";
import ThemeToggle from "@/components/ThemeToggle";
import s from '@/styles/HomePage.module.css'
import PublicWishlist from "@/types/PublicWishlist";
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import { useEffect, useState } from "react";
import getUserFromToken from "../api/User-APIs/getuser";
import GetFollowedWishlist from "../api/Wishlist-APIs/GetFollowedWishlist";



const FollowedWishlist = () =>
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [wishlist, setWishlist] = useState<PublicWishlist[] | undefined>(undefined)

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

    const fetchWishlists = async () =>
    {

      if (user !== undefined)
      {

        const response = await GetFollowedWishlist(Number(user.id))
        if (Array.isArray(response) === false) {
          alert(response)
          return
        }
        setWishlist(response)

      }

    }
    fetchWishlists()

  }, [user])

  return (
    <div className={s.followedwishlist}>
      <Navbar />
      <HeaderModule />
      <ThemeToggle />
      <div className={s.followedwishlistcontent}>
        <h1>
          Followed Wishlist
        </h1>
        <div className={s.followedwishlistitem}>
        {
            wishlist?.map((wishlistPublic: PublicWishlist, index: number) =>
            {
              return (
                <FollowedWishlistCard list={wishlistPublic} key={index} />
              )
            })
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FollowedWishlist;