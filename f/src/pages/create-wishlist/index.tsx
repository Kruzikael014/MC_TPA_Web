import ButtonInput from '@/components/ButtonInput';
import Footer from '@/components/Footer';
import HeaderModule from '@/components/HeaderModule';
import InputField from '@/components/InputField';
import Navbar from '@/components/Navbar';
import ThemeToggle from '@/components/ThemeToggle';
import s from '@/styles/HomePage.module.css'
import User from '@/types/User';
import getCookie from '@/util/GetCookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import getUserFromToken from '../api/User-APIs/getuser';
import CreateWishList from '../api/Wishlist-APIs/CreateWishlist';

const CreateWishlist = () =>
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [wishlistName, setWishlistName] = useState("")
  const [wishlistVisibility, setWishlistVisibility] = useState("Public")
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

  const handleFormSubmit = async (e: any) =>
  {
    e.preventDefault()
    const request = {
      wishlist_name: wishlistName,
      is_visible: (wishlistVisibility === "Public") ? true : false,
      user_id: Number(user?.id)
    }
    const response = await CreateWishList(request)
    if (response === "Wishlist Successfully created!")
    {
      alert(response)
      router.push("/")
      return
    }
    alert(response)
  }

  return (
    <div className={s.createwishlist}>
      <Navbar />
      <ThemeToggle />
      <HeaderModule />
      <div className={s.content}>
        <center>
          <h1>
            Content
          </h1>
          <form className={s.wishlsitform} onSubmit={handleFormSubmit}>
            <InputField required onChange={setWishlistName} value={wishlistName} placeholder={"Wishlist name"} text width={800} />
            <select defaultValue={"Public"} onChange={(e) => { setWishlistVisibility(e.target.value) }} className={s.select} >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
            <ButtonInput blue submit centered width={500} placeholder={"Create wishlist"} />
          </form>
        </center>
      </div>
      <Footer />
    </div>
  );
}

export default CreateWishlist;