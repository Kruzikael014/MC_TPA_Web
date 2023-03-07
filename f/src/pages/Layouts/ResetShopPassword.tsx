import ButtonInput from "@/components/ButtonInput"
import InputField from "@/components/InputField"
import styles from "@/styles/HomePage.module.css"
import ChangePassRequest from "@/types/ChangePassRequest"
import User from "@/types/User"
import getCookie from "@/util/GetCookie"
import { useEffect, useState } from "react"
import getUserFromToken from "../api/getuser"
import ResetPass from "../api/ResetPass"

export default function ResetShopPassword()
{

  const [password, setPassword] = useState("")
  const [cpassword, setcPassword] = useState("")
  const [passShow, setPassShow] = useState(false)
  const [cpassShow, setcPassShow] = useState(false)
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

  const handleResetPassword = async () =>
  {
    if (password !== cpassword)
    {
      alert("Password and Confirm Password didnt match")
      return
    }
    const request: ChangePassRequest = {
      new_password: password,
      email: String(user?.Email)
    }
    const response = await ResetPass(request)
    if (response === "OK")
    {
      alert(response)
      window.location.reload()
      return
    }
    alert("Unknown error")
  }

  return (
    <>
      <div className={styles.ResetShopPassword}>
        <h1>
          Reset Password Form
        </h1>
        <div className={styles.passform}>
          <InputField
            width={1000}
            type={passShow ? "text" : "password"}
            onChange={setPassword}
            value={password}
            placeholder={"Password"}
          />
          <button onClick={() => setPassShow(!passShow)} className={styles.showpassbutton} >{passShow ? `👀` : `👁️`}</button>
        </div>
        <div className={styles.passform}>
          <InputField
            width={1000}
            type={cpassShow ? "text" : "password"}
            onChange={setcPassword}
            value={cpassword}
            placeholder={"Confirm Password"}
          />
          <button onClick={() => setcPassShow(!cpassShow)} className={styles.showpassbutton} >{cpassShow ? `👀` : `👁️`}</button>
        </div>
        <ButtonInput placeholder="Change Password" blue centered func={handleResetPassword} />
      </div>
    </>
  )
} 