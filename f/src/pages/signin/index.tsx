import Image from "next/image";
import newegg from "@/assets/newEgg.png"
import s from "@/styles/HomePage.module.css"
import InputField from "@/components/InputField";
import ButtonInput from "@/components/ButtonInput";
import Link from "next/link";
import { useState } from "react";
import LoginRequest from "@/types/LoginRequest";
import SignUserIn from "../api/Auth-APIs/signin";
import { useRouter } from "next/router";
import GetOTP from "../api/User-APIs/GetOTP";
import OTPRequest from "@/types/OTPRequest";
import GetForgotPass from "../api/User-APIs/GetForgotPass";
import ForgotPassRequest from "@/types/ForgotPassRequest";



export default function SignIn()
{

  function isValidEmail(email: string)
  {
    // regular expression for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const setCookie = (key: string, value: string, expiredInDay: number) =>
  {
    let date = new Date()
    date.setTime(date.getTime() + (expiredInDay * 3600 * 24 * 1000))
    document.cookie = key + "=" + value + "; " + "expires=" + date.toUTCString() + "; path=/"
  }

  const handleFormSubmit = async (e: any) =>
  {
    e.preventDefault()

    const newLoginRequest: LoginRequest = {
      email: email,
      password: password
    }

    const response = await SignUserIn(newLoginRequest)

    if (response === -1) alert("Sign in failed!")
    else if (response.token === undefined) alert("Sign in failed")
    else
    {
      setCookie("JWToken", response.token, 1)

      router.push("/")
    }

  }

  const handleOTP = async () =>
  {
    if (email === "" || email === undefined)
    {
      alert("You must fill up your email before using OTP")
      return
    }
    if (!isValidEmail(email))
    {
      alert("Email invalid")
      return
    }
    const otpReq: OTPRequest = {
      email: email
    }
    const response = await GetOTP(otpReq)
    if (response === "OK")
    {
      router.push({
        pathname: "/OTP",
        query: {
          email: email
        }
      })
    } else
    {
      alert(response)
    }
  }

  const handleForgetPassword = async () =>
  {

    if (email === "" || email === undefined)
    {
      alert("You must remember your email at least")
      return
    }
    if (!isValidEmail(email))
    {
      alert("Email invalid")
      return
    }

    const request: ForgotPassRequest = {
      email: email
    }

    const response = await GetForgotPass(request)

    if (response !== "OK")
    {
      alert(response)
      return
    }

    router.push({
      pathname: "/Forgot-Pass",
      query: {
        email: email
      }
    })


  }


  return (
    <div className={s.signin}>
      <div className={s.container}>
        <Image src={newegg ? newegg : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"} alt="not found" width={150} className={s.img} />
        <h2>
          <b>
            Sign in
          </b>
        </h2>
        <form className={s.form} onSubmit={handleFormSubmit}>
          <InputField onChange={setEmail} value={email} placeholder="Email" email />
          <InputField onChange={setPassword} value={password} placeholder="Password" password />
          <p className={s.forget} onClick={handleForgetPassword}>Forget Password</p>
          <ButtonInput submit orange placeholder="Sign in" />
          <ButtonInput func={handleOTP} orange={false} placeholder="GET ONE-TIME SIGN" />
          <div>
            <span>
              New to new egg?
            </span>
            <Link href="/signup">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}