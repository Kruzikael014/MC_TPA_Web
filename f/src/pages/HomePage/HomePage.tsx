import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { useContext, useEffect, useState } from "react";
import getUserFromToken from "../api/getuser";
import getCookie from "@/util/GetCookie";
import User from "@/types/User";
import CustomerPage from "./CustomerPage";
import AdminPage from "./AdminPage";
import ShopOwner from "./ShopOwner";
import { ThemeContext } from "@/types/Theme";
import MiniNavbar from "@/components/MiniNavbar";

export default function HomePage()
{

      const [user, setUser] = useState<User>({ id: 0, First_name: "", Last_name: "", Email: "", Password: "", Phone_num: "", Email_subscriber: false, Status: "", Role_name: "", balance: 0 })

      const theme = useContext(ThemeContext)

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

      const showPage = () =>
      {
            switch (user.Role_name)
            {
                  case "Customer":
                        return <CustomerPage />
                  case "Admin":
                        return <AdminPage />
                  case "Shop Owner":
                        return <ShopOwner />
                  default:
                        return <CustomerPage />
            }
      }

      return (
            <div style={{ color: theme.textColor }} >
                  <Navbar />
                  {showPage()}
                  <MiniNavbar />
                  <Footer />
            </div>
      )
}