import s from '@/styles/HomePage.module.css'
import { useRouter } from 'next/router';
import HeaderModule from './HeaderModule';

const MiniNavbar = () =>
{

 const router = useRouter()

 const handleChatClick = () => {
  router.push("/Chat")
 }

 const handleVoucherClick = () => {
  router.push("/Voucher")
 }

 return (
  <>
   <HeaderModule />
   <div className={s.mininavbar}>
    <i className="fa-solid fa-link fa-2xl"></i>
    <i className="fa-regular fa-comment fa-2xl" onClick={handleChatClick} ></i>
    <i className="fa-solid fa-ticket fa-2xl" onClick={handleVoucherClick}></i>
    {/* <i className="fa-regular fa-comment fa-2xl">
     <div className={s.smiley}>
      {`:)`}
     </div>
    </i> */}
   </div>
  </>
 );
}

export default MiniNavbar;