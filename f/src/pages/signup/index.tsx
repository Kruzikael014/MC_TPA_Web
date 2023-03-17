import s from "@/styles/HomePage.module.css"
import Image from "next/image";
import newegg from "@/assets/newEgg.png"
import InputField from "@/components/InputField";
import ButtonInput from "@/components/ButtonInput";
import Link from "next/link";
import { useState } from "react";
import User from "@/types/User";
import { useRouter } from "next/router";
import SignUserUp from "../api/Auth-APIs/signup";

const SignUp = () =>
{

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [subscribe, setSubscribe] = useState(false)

  const Router = useRouter()

  const handleSubmittedForm = async (e: any) =>
  {
    e.preventDefault()

    const newUser: User = {
      First_name: firstName,
      Last_name: lastName,
      Email: email,
      Password: password,
      Phone_num: phoneNumber,
      Email_subscriber: subscribe,
      Status: "Clear",
      Role_name: "Customer",
      balance: 0
    }

    const response = await SignUserUp(newUser)
    console.log(response)

    if (response === -1) alert("ERROR!!!")
    else
    {
      alert("Account Successfully Created")
      console.log(response)
      Router.push("/signin")
    }
  }

  return (
    <>
      <div className={s.signup}>
        <div className={s.container}>
          <Image src={newegg ? newegg : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"} alt="not found" width={150} className={s.img} />
          <h2>
            <b>
              Create Account
            </b>
          </h2>
          <span className={s.business}>
            Shopping for your business?
            <Link href="" className={s.underlined}>
              Create a free business account
            </Link>
          </span>
          <form className={s.form} onSubmit={handleSubmittedForm} >
            <InputField required onChange={setFirstName} placeholder="First Name" value={firstName} />
            <InputField required onChange={setLastName} placeholder="Last Name" value={lastName} />
            <InputField required onChange={setEmail} placeholder="Email Address" email value={email} />
            <InputField onChange={setPhoneNumber} number placeholder="Mobile Phone Number (Optional)" value={phoneNumber} />
            <InputField required onChange={setPassword} placeholder="Password" password value={password} />
            <div className={s.checkboxes}>
              <input type={"checkbox"} onChange={(e) => { setSubscribe(e.target.checked) }} />
              <span>
                Subscribe for exclusive e-mail offers and discounts
              </span>
            </div>
            {/* <InputField onChange={setSubscribe}  value={subscribe} checkbox /> placeholder="Subscribe for exclusive e-mail offers and discounts" */}
            <ButtonInput submit orange placeholder="Sign Up" />
            <div>
              <span>
                Have an account?
              </span>
              <Link href="/signin">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;