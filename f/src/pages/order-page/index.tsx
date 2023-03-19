import ButtonInput from "@/components/ButtonInput";
import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import InputField from "@/components/InputField";
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
import SearchOrder from "../api/Order-APIs/SearchOrder";
import getUserFromToken from "../api/User-APIs/getuser";


const OrderPage = () =>
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [orders, setOrders] = useState<Array<UserOrder | ShopOrder>>([]);
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")

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
        console.log("Fetching with condition", filter);
        const response = await GetFilteredOrder(Number(user.id), user.Role_name, filter)
        setOrders(response)
      }
    }
    fetchOrders()
  }, [user, filter]);

  useEffect(() =>
  {

    const fetchBySearch = async () =>
    {
      if (user !== undefined)
      {
        const response = await SearchOrder(Number(user.id), user.Role_name, search)
        if (Array.isArray(response) && response.length != 0)
        {
          console.log(response);
        }
        setOrders(response)
      }
    }
    fetchBySearch()


  }, [search])

  return (
    <div className={s.orderpage}>
      <Navbar />
      <ThemeToggle />
      <HeaderModule />
      <div className={s.content}>
        <div className={s.contenthead}>
          <div className={s.realhead}>
            <h1>
              Your order
            </h1>
            {
              user?.Role_name === "Shop Owner" ?
                <select onChange={(e) => { setFilter(e.target.value) }}>
                  <option value="All">All</option>
                  <option value="Canceled">Canceled</option>
                  <option value="Delivered">Delivered</option>
                </select>
                :
                <select onChange={(e) => { setFilter(e.target.value) }}>
                  <option value="All">All</option>
                  <option value="Canceled">Canceled</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Recent">Recent</option>
                </select>
            }
          </div>
          <div className={s.searchbarcontainer}>
            <InputField onChange={setSearch} value={search} text placeholder={"Search by name or order number or status"} />
          </div>
        </div>
        {(Array.isArray(orders) && orders.length > 0) &&
          orders.map && orders.map((order: ShopOrder | UserOrder) =>
          {
            return (
              <div className={s.carddes}>
                {user?.Role_name === "Shop Owner" ? (
                  <ShopOrderCard ShopOrder={order} />
                ) : (
                  <UserOrderCard userOrder={order} />
                )}
              </div>
            );
          })
        }

        {Array.isArray(orders) && orders.length === 0 && (
          <h1>WARNING!!! NO ORDER!!!</h1>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default OrderPage;