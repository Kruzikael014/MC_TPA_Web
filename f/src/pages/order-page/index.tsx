import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import ShopOrderCard from "@/components/ShopOrderCard";
import ThemeToggle from "@/components/ThemeToggle";
import UserOrderCard from "@/components/UserOrderCard";
import s from "@/styles/HomePage.module.css"
import ShopOrder from "@/types/ShopOrder";
import User from "@/types/User";
import UserOrder from "@/types/UserOrder";
import getCookie from "@/util/GetCookie";
import { useEffect, useState } from "react";
import GetFilteredOrder from "../api/Order-APIs/GetFilteredOrder";
import GetOrder from "../api/Order-APIs/GetOrder";
import getUserFromToken from "../api/User-APIs/getuser";


const OrderPage = () =>
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [orders, setOrders] = useState<Array<UserOrder | ShopOrder>>([]);
  const [filter, setFilter] = useState("All")

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
    const fetchOrders = async () =>
    {
      if (user !== undefined)
      {
        const response = await GetOrder(Number(user.id), user.Role_name);
        console.log(response);
        setOrders(response);
      }
    }
    fetchOrders()
  }, [user]);

  useEffect(() =>
  {
    const fetchOrders = async () =>
    {
      if (user !== undefined)
      {
        const response = await GetFilteredOrder(Number(user.id), user.Role_name, filter)
        setOrders(response)
      }
    }
    fetchOrders()
  }, [user, filter]);



  return (
    <div className={s.orderpage}>
      <Navbar />
      <ThemeToggle />
      <HeaderModule />
      <div className={s.content}>
        <div className={s.contenthead}>
          <h1>
            Your order
          </h1>
          {
            user?.Role_name === "Shop Owner" ?
              <select>
                <option value="All">All</option>
                <option value="Canceled">Canceled</option>
                <option value="Delivered">Delivered</option>
              </select>
              :
              <select>
                <option value="All">All</option>
                <option value="Delivered">Canceled</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Recent</option>
              </select>
          }
        </div>
        {(Array.isArray(orders) && orders.length > 0) &&
          (orders.length === 0) ? <h1>"WARNING!!! NO ORDER!!!"</h1> :
          (user?.Role_name === "Shop Owner") ?
            orders?.map((order: ShopOrder | UserOrder) =>
            {
              return (
                <div className={s.carddes}>
                  <ShopOrderCard ShopOrder={order} />
                </div>
              )
            })
            :
            orders?.map((order: UserOrder) =>
            {
              return (
                <div className={s.carddes}>
                  <UserOrderCard userOrder={order} />
                </div>
              )
            })
        }
      </div>
      <Footer />
    </div>
  );
}

export default OrderPage;