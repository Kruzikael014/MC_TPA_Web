
import s from "@/styles/HomePage.module.css"
import newegg from "@/assets/newEgg.png"
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ButtonInput from "@/components/ButtonInput";
import InputField from "@/components/InputField";
import ForgotPassVerifYRequet from "@/types/ForgotPassVerifyRequest";
import UseForgotPass from "../api/UseForgotPass";
import NewPassForm from "../Layouts/NewPassForm";

const ForgotPass = () =>
{

  const [email, setEmail] = useState<string | undefined>("")
  const [otp, setOtp] = useState<number | undefined>(undefined)
  const router = useRouter()
  const query = router.query

  useEffect(() =>
  {

    setEmail(String(query.email))

  }, [])


  const handleFormSubmit = async (e: any) =>
  {

    e.preventDefault()

    if (email === "" || email === undefined)
    {
      alert("Email is empty")
      return
    }

    if (isNaN(Number(otp)))
    {
      alert("Invalid OTP")
      return
    }

    const newForgotPassVerifyRequest: ForgotPassVerifYRequet = {
      email: email,
      otp: Number(otp)
    }

    const response = await UseForgotPass(newForgotPassVerifyRequest)

    if (response !== "OK")
    {
      alert(response)
      return
    }
    else
    {
      console.log("WRTFFF");
      router.push({
        pathname: "/New-Pass"
      ,query : {
        email: email
      }
    })
    }




  }

  return (
    <>
      <div className={s.forgotpin}>
        <div className={s.container}>
          <Image src={newegg ? newegg : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"} alt="not found" width={150} className={s.img} />
          <h2>
            <b>
              Forgot Password Passcode
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
            <InputField number required onChange={setOtp} value={otp} placeholder="Forgot Pass Passcode" />
            <ButtonInput submit orange={true} placeholder="Sign in" />
            <div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPass;