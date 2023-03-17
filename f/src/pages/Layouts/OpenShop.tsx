
import ButtonInput from "@/components/ButtonInput"
import InputField from "@/components/InputField"
import styles from "@/styles/HomePage.module.css"
import Shop from "@/types/Shop"
import { useState } from "react"
import CreateShop from "../api/Cart-APIs/CreateShop"



const OpenShop = () =>
{

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [subscribe, setSubscribe] = useState(false)

  const handleFormSubmit = async (e: any) =>
  {
    e.preventDefault()

    const newShop: Shop = {
      Email: email,
      First_name: firstName,
      Last_name: lastName,
      Phone_num: phoneNumber,
      Password: password,
      Email_subscriber: subscribe,
      Role_name: "Shop Owner",
      Status: "Clear"
    }

    console.log("You want to create a shop with these identity : ")
    console.log("firstname : " + firstName)
    console.log("lastName : " + lastName)
    console.log("email : " + email)
    console.log("phoneNumber : " + phoneNumber)
    console.log("password : " + password)
    console.log("subscribe : " + subscribe)

    const response = await CreateShop(newShop)
    console.log(response)
    if (response !== -1 && response.email !== "")
    {
      alert("Shop successfully created!")
      window.location.reload()
    }
  }

  return (
    <div className={styles.OpenShop}>
      <h1>
        Create shop
      </h1>
      <form className={styles.openshopform} onSubmit={handleFormSubmit}>
        <InputField width={800} required onChange={setFirstName} placeholder="First Name" value={firstName} />
        <InputField width={800} required onChange={setLastName} placeholder="Last Name" value={lastName} />
        <InputField width={800} required onChange={setEmail} placeholder="Email Address" email value={email} />
        <InputField width={800} onChange={setPhoneNumber} number placeholder="Mobile Phone Number (Optional)" value={phoneNumber} />
        <InputField width={800} required onChange={setPassword} placeholder="Password" password value={password} />
        <ButtonInput submit blue placeholder="Open shop" />
      </form>
    </div>
  )
}

export default OpenShop