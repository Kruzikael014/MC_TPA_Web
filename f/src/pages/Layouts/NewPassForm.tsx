
import s from "@/styles/HomePage.module.css"
import newegg from "@/assets/newEgg.png"
import Image from "next/image";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import ButtonInput from "@/components/ButtonInput";
import ChangePassRequest from "@/types/ChangePassRequest";
import UpdatePass from "../api/UpdatePass";
import { useRouter } from "next/router";

interface emailprops
{
  email: string | undefined
}

const NewPassForm = (props: emailprops) =>
{

  const [password, setPassword] = useState<string | undefined>("")
  const { email } = props
  const router =  useRouter()

  const handleFormSubmit = async (e:any) =>
  {
    e.preventDefault()
    if (email === "" || email === undefined)
    {
      alert("Invalid email")
      return
    }

    const changePassRequest: ChangePassRequest = {
      email: email,
      new_password: password
    }

    const response = await UpdatePass(changePassRequest)
    console.log(response);

    
    if (response !== "OK") {
      alert(response)
      return
    }
    else {
      alert("Password successfully changed!")
      router.push("/signin")
    }

  }

  return (
    <>
      <div className={s.newpassform}>
        <div className={s.container}>
          <Image src={newegg ? newegg : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"} alt="not found" width={150} className={s.img} />
          <h2>
            <b>
              New Password
            </b>
          </h2>
          <div className={s.messagetext}>
            <b>
              <h2>
                Enter your new password
              </h2>
              <h2>
                {email}
              </h2>
            </b>
          </div>
          <form className={s.form} onSubmit={handleFormSubmit}>
            <InputField password required onChange={setPassword} value={password} placeholder="New Password" />
            <ButtonInput submit orange={true} placeholder="Sign in" />
          </form>
        </div>
      </div>
    </>
  );
}

export default NewPassForm;