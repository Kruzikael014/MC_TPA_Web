import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import PublicWishlistCard from "@/components/PublicWishlistCard";
import ThemeToggle from "@/components/ThemeToggle";
import s from '@/styles/HomePage.module.css'
import PublicWishlist from "@/types/PublicWishlist";
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getUserFromToken from "../api/User-APIs/getuser";
import GetPublicWishlist from "../api/Wishlist-APIs/GetPublicWishlist";


const PublicWishlistPage = () =>
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [filter, setFilter] = useState("All")
  const [wishlist, setWishlist] = useState<PublicWishlist[] | undefined>(undefined)

  const decreasePage = () =>
  {
    if (page > 1)
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

    if (user !== undefined)
    {
      const fetchWishlist = async () =>
      {

        if (user !== undefined)
        {
          const response = await GetPublicWishlist(page, pageSize, filter, Number(user.id))
          console.log(response);
          setWishlist(response)
        }
        else
        {
          alert("User is not defined!")
        }

      }
      fetchWishlist()
    }

  }, [user, page, pageSize, filter])


  return (
    <div className={s.publicwishlistpage}>
      <Navbar />
      <HeaderModule />
      <ThemeToggle />
      <div className={s.publicwishlistpagecontent}>
        <div className={s.headers} style={{ marginBottom: "4rem" }}>
          <h1>
            Public Wishlist
          </h1>
          <div className={s.paginator}>
            <div>
              <i className="fa-solid fa-backward" onClick={decreasePage}></i>
            </div>
            {page}
            <div>
              <i className="fa-solid fa-forward" onClick={increasePage}></i>
            </div>
          </div>
          <div className={s.filter}>
            <i className="fa-solid fa-filter"></i>
            <select defaultValue={"All"} onChange={(e) => { setFilter(e.target.value) }}>
              <option value="All">All</option>
              <option value="Created Date">Created Date</option>
              <option value="Price">Price</option>
              <option value="Follower">Follower</option>
            </select>
          </div>
          <div className={s.filter}>
            <i className="fa-solid fa-filter"></i>
            <select defaultValue={15} onChange={(e) => { setPageSize(Number(e.target.value)) }}>
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
              <option value={90}>90</option>
            </select>
          </div>
        </div>
        <div className={s.publicwishlists}>
          {
            wishlist?.map((wishlistPublic: PublicWishlist, index: number) =>
            {
              return (
                <PublicWishlistCard list={wishlistPublic} key={index} />
              )
            })
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PublicWishlistPage;