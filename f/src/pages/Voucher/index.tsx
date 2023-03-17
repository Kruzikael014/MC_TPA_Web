import ButtonInput from '@/components/ButtonInput';
import Footer from '@/components/Footer';
import HeaderModule from '@/components/HeaderModule';
import InputField from '@/components/InputField';
import Navbar from '@/components/Navbar';
import ThemeToggle from '@/components/ThemeToggle';
import s from '@/styles/HomePage.module.css'
import User from '@/types/User';
import UseVoucherRequest from '@/types/UseVoucherRequest';
import getCookie from '@/util/GetCookie';
import { useEffect, useState } from 'react';
import getUserFromToken from '../api/User-APIs/getuser';
import UseVoucher from '../api/Promo-APIs/UseVoucher';



const VoucherPage = () =>
{

 const [user, setUser] = useState<User | undefined>(undefined)
 const [voucher, setVoucher] = useState("")

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

 const handleUseVoucher = async () =>
 {
  if (voucher.length !== 12)
  {
   alert("Invalid voucher format!")
   return
  }
  console.log("You want to use " + voucher);
  
  const request: UseVoucherRequest = {
   user_id: Number(user?.id),
   voucher_name: voucher
  }
  const response = await UseVoucher(request)
  if (response === "Voucher successfully used!")
  {
   alert(response)
   return
  }
  alert(response)
 }

 return (
  <>
   <div className={s.voucherpage}>
    <Navbar />
    <ThemeToggle />
    <HeaderModule />
    <div className={s.vouchercontent}>
     <h1>
      Use Voucher
     </h1>
     <InputField text onChange={setVoucher} value={voucher} required placeholder='Enter the voucher code' width={800} />
     <ButtonInput blue placeholder='Use Voucher' centered width={200} func={handleUseVoucher} />
    </div>
    <Footer />
   </div>
  </>
 );
}

export default VoucherPage;