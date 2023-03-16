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
import styles from "@/styles/HomePage.module.css"

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
      <div className={styles.shopdetailpage}>
        <Navbar />
        <HeaderModule />
        <ThemeToggle />
        <div className={styles.shopdetailcontent}>
          a
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
