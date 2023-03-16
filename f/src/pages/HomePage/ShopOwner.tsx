import styles from "@/styles/HomePage.module.css"
import { Dispatch, SetStateAction, useState } from "react"
import InsertPromotion from "../Layouts/InsertPromotion"
import InsertShopProduct from "../Layouts/InsertShopProduct"
import ResetShopPassword from "../Layouts/ResetShopPassword"
import ShopProfile from "../Layouts/ShopProfile"
import UpdateShopProduct from "../Layouts/UpdateShopProduct"
import ViewShopOrder from "../Layouts/ViewShopOrder"
import ViewShopProduct from "../Layouts/ViewShopProduct"


export let changeFunc: Dispatch<SetStateAction<number>> = () => {}

export default function ShopOwner()
{

  const [clickedButton, setClickedButton] = useState(0)

  changeFunc = setClickedButton

  const handleButtonClick = (num: number) =>
  {
    setClickedButton(num)
  }

  const showSubcontent = () =>
  {
    if (clickedButton === 1) return <ViewShopProduct />
    if (clickedButton === 3) return <ShopProfile />
    if (clickedButton === 4) return <InsertShopProduct />
    if (clickedButton === 5) return <UpdateShopProduct />
    if (clickedButton === 6) return <ResetShopPassword />
    if (clickedButton === 7) return <ViewShopOrder />
  }

  

  return (
    <>
      <div className={styles.shopowner} >
        <h1>
          My Shop
        </h1>
        <div className={styles.featurebuttoncontainer}>
          <div className={`${styles.shopownerfeaturebutton} ${clickedButton == 1 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(1) }}>
            View product
          </div>

          <div className={`${styles.shopownerfeaturebutton} ${clickedButton == 3 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(3) }}>
            Shop Profile
          </div>
          <div className={`${styles.shopownerfeaturebutton} ${clickedButton == 4 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(4) }}>
            Insert product
          </div>
          <div className={`${styles.shopownerfeaturebutton} ${clickedButton == 6 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(6) }}>
            Reset Password
          </div>
          <div className={`${styles.shopownerfeaturebutton} ${clickedButton == 7 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(7) }}>
            View Order
          </div>
        </div>
        
        <div className={styles.shopownersubpage}>
          {showSubcontent()}
        </div>

      </div>
    </>
  )

}