import ButtonInput from "@/components/ButtonInput";
import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import InputField from "@/components/InputField";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import s from '@/styles/HomePage.module.css'
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChangePhoneNumber from "../api/User-APIs/ChangePhone";
import ComparePass from "../api/User-APIs/ComparePassword";
import getUserFromToken from "../api/User-APIs/getuser";



const AccountSetting = () =>
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [promptPass, setPromptPass] = useState(false)
  const [promptedPass, setPromptedPass] = useState("")
  const [updatePhoneNum, setUpdatePhoneNum] = useState(false)
  const [promptedNum, setPromptedNum] = useState("")
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

  const handlePhoneUpdateClick = async () =>
  {
    setPromptPass(false)
    setUpdatePhoneNum(!updatePhoneNum)
  }

  const handlePasswordUpdateClick = async () =>
  {
    setUpdatePhoneNum(false)
    setPromptPass(!promptPass)
  }

  const handleOnPasswordPrompted = async (e: any) =>
  {
    e.preventDefault()
    const req = {
      user_id: Number(user?.id),
      password: promptedPass
    }

    const response = await ComparePass(req)
    if (response !== "Failed")
    {
      router.push({
        pathname: "/New-Pass",
        query: {
          email: user?.Email
        }
      })
    }
    else
    {
      alert("Password is not correct")
    }

  }

  const handleOnPhonenumPrompted = async (e: any) =>
  {
    e.preventDefault()
    const request = {
      user_id: Number(user?.id),
      phone_number: promptedNum
    }
    const response = await ChangePhoneNumber(request)
    if (response === "Phone number successfully updated!")
    {
      alert(response)
      window.location.reload()
      return
    }
    alert(response)
  }

  return (
    <div>
      <Navbar />
      <HeaderModule />
      <ThemeToggle />
      <div className={s.accountconten}>
        <div className={s.profilecontent}>
          <h1>
            Account Setting
          </h1>
          <div className={s.identity}>

            <div className={s.linecontent}>
              <div className={s.label}>
                Full Name
              </div>
              <div>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <div className={s.value}>
                {user?.First_name + " " + user?.Last_name}
              </div>
            </div>
            <div className={s.linecontent}>
              <div className={s.label}>
                Email
              </div>
              <div>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <div className={s.value}>
                {user?.Email}
              </div>
            </div>
            <div className={s.linecontent}>
              <div className={s.label}>
                Phone Number
              </div>
              <div>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <div className={s.value}>
                {user?.Phone_num}
              </div>
            </div>
            <div className={s.linecontent}>
              <div className={s.label}>
                Status
              </div>
              <div>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <div className={s.value}>
                {user?.Status}
              </div>
            </div>
            <div className={s.linecontent}>
              <div className={s.label}>
                Balance
              </div>
              <div>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <div className={s.value}>
                {user?.balance}
              </div>
            </div>
            <div className={s.linecontent}>
              <div className={s.label}>
                Password
              </div>
              <div>: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <div className={s.value}>
                {
                  (user?.Password?.length !== undefined && user.Password.length > 0) ?
                    "*".repeat(user.Password.length) :
                    user?.Password
                }
              </div>
            </div>
          </div>
          <div className={s.buttons}>

            <ButtonInput orange centered func={handlePhoneUpdateClick} placeholder="Update Phone number" />
            <ButtonInput orange centered func={handlePasswordUpdateClick} placeholder="Update Password" />
          </div>
        </div>
        {
          promptPass &&
          <form className={s.confirmupadtepassform} onSubmit={handleOnPasswordPrompted}>

            <InputField value={promptedPass} onChange={setPromptedPass} width={400} password required placeholder="Input Password here" />
            <ButtonInput submit orange placeholder="Change password" width={400} />
          </form>
        }

        {
          updatePhoneNum &&
          <form className={s.confirmupadtepassform} onSubmit={handleOnPhonenumPrompted}>
            <InputField value={promptedNum} onChange={setPromptedNum} width={400} number required placeholder="Input Phone number here" />
            <ButtonInput submit orange placeholder="Change Phone number" width={400} />
          </form>
        }
      </div>
      <Footer />
    </div>
  );
}

export default AccountSetting;