import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import API from "@/env";
import ShopDetail from "@/types/ShopDetail";
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import { useEffect, useState } from "react";
import getUserFromToken from "../api/getuser";
import s from "@/styles/HomePage.module.css"

interface ShopDetailInterface
{
  shopDetail: ShopDetail
}

const ShopPagePage = (props: ShopDetailInterface) =>
{

  const { shopDetail } = props
  const [user, setUser] = useState<User | undefined>(undefined)

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



  return (
    <>
      <div className={s.shopdetailpage}>
        <Navbar />
        <HeaderModule />
        <ThemeToggle />
        <div className={s.profileheader}>
          <div className={s.circler}>
            <i className="fa-solid fa-user fa-4x"></i>
          </div>
          <div className={s.profiledata}>
            <div className={s.title}>
              <h1>
                {user?.First_name} {user?.Last_name} Store
              </h1>
            </div>
            <div className={s.salesrate}>
              {shopDetail.number_of_sales} total sales | 80 followers | {shopDetail.average_rating} (80% positive in the last 12 months)
            </div>
          </div>
        </div>
        <div className={s.rotate}>
          <hr />
          <div className={s.path}>
          Home - {sessionStorage.getItem("country")} &gt; {user?.First_name + " " + user?.Last_name} 
          </div>
          <hr />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ShopPagePage;


export async function getStaticPaths()
{

  const response = await fetch(`${API}/shop-detail/all`)
  const shops = await response.json()

  const paths = shops.map((shop: ShopDetail) => ({
    params: {
      id: String(shop.id),
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

  const response = await fetch(`${API}/shop-detail/${id}`)
  const shopDetail: ShopDetail = await response.json()

  return {
    props: {
      shopDetail,
    }
  }

}
