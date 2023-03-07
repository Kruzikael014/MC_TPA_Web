import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import s from "@/styles/HomePage.module.css"
import newegg from "@/assets/newEgg.png"
import Image from "next/image";
import InputField from "@/components/InputField";
import ButtonInput from "@/components/ButtonInput";
import OTPVerifyRequest from "@/types/OTPVerifyRequest";
import UseOTP from "../api/UseOTP";

const OTPage = () =>
{

  const router = useRouter()
  const query = router.query

  const [otp, setOtp] = useState<number | undefined>(undefined)
  const [email, setEmail] = useState<String | undefined>("")

  useEffect(() =>
  {
    setEmail(String(query.email))

  }, [])

  const handleFormSubmit = async (e:any) =>
  {
    e.preventDefault()
    const setCookie = (key: string, value: string, expiredInDay: number) =>
    {
      let date = new Date()
      date.setTime(date.getTime() + (expiredInDay * 3600 * 24 * 1000))
      document.cookie = key + "=" + value + "; " + "expires=" + date.toUTCString() + "; path=/"
    }

    const newOTPVerifyRequest: OTPVerifyRequest = {
      email: email,
      otp: Number(otp)
    }

    const response = await UseOTP(newOTPVerifyRequest)
    console.log(response);
    

    if (response ===  "OTP Code is invalid!") {
      alert(response)
      return
    }

    else if (response?.error === "OTP expired") {
      alert(response.error)
      return
    }

    console.log("you got token : ");
    console.log(response?.token);
    setCookie("JWToken", response?.token, 1)

    router.push("/")

  }

  return (
    <>
      <div className={s.otpin}>
        <div className={s.container}>
          <Image src={newegg ? newegg : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"} alt="not found" width={150} className={s.img} />
          <h2>
            <b>
              One time passcode
            </b>
          </h2>
          <div className={s.messagetext}>
            <b>
              <h2>
                Enter the code that has been sent to
              </h2>
              <h2>
                {email}
              </h2>
            </b>
          </div>
          <form className={s.form} onSubmit={handleFormSubmit}>
            <InputField number required onChange={setOtp} value={otp} placeholder="One Time Passcode" />
            <ButtonInput submit orange={true} placeholder="Sign in" />
            <div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default OTPage;