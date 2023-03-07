import styles from "@/styles/HomePage.module.css"
import { Dispatch, SetStateAction, useState } from "react"
import AddVoucher from "../Layouts/AddVoucher"
import InsertPromotion from "../Layouts/InsertPromotion"
import ManagePromo from "../Layouts/ManagePromo"
import ManageReport from "../Layouts/ManageReport"
import ManageReview from "../Layouts/ManageReview"
import ManageShop from "../Layouts/ManageShop"
import ManageUser from "../Layouts/ManageUser"
import OpenShop from "../Layouts/OpenShop"
import SendLetter from "../Layouts/SendLetter"

export let changeFunc: Dispatch<SetStateAction<number>> = () => {}

const AdminPage = () =>
{
  const [clickedButton, setClickedButton] = useState(0)
  changeFunc = setClickedButton
  const handleButtonClick = (index: number) =>
  {
    setClickedButton(index)
  }
  
  const showSubcontent = () =>
  {
    if (clickedButton === 1) return <ManageReport />
    if (clickedButton === 2) return <ManageUser />
    if (clickedButton === 3) return <OpenShop />
    if (clickedButton === 4) return <ManageShop />
    if (clickedButton === 5) return <SendLetter />
    if (clickedButton === 6) return <AddVoucher />
    if (clickedButton === 7) return <ManageReview />
    if (clickedButton === 8) return <ManagePromo />
    if (clickedButton === 9) return <InsertPromotion />
  }
  return (
    <div className={styles.adminpage}>
      <div className={styles.featurebuttoncontainer}>
        <div className={`${styles.adminfeaturebutton} ${clickedButton == 1 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(1) }}>
          Manage Report
        </div>
        <div className={`${styles.adminfeaturebutton} ${clickedButton == 2 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(2) }}>
          Manage user
        </div>
        <div className={`${styles.adminfeaturebutton} ${clickedButton == 3 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(3) }}>
          Open shop
        </div>
        <div className={`${styles.adminfeaturebutton} ${clickedButton == 4 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(4) }}>
          Manage shop
        </div>
        <div className={`${styles.adminfeaturebutton} ${clickedButton == 5 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(5) }}>
          Send newsletter
        </div>
        <div className={`${styles.adminfeaturebutton} ${clickedButton == 6 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(6) }}>
          Add Voucher
        </div>
        <div className={`${styles.adminfeaturebutton} ${clickedButton == 7 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(7) }}>
          Manage Reviews
        </div>
        <div className={`${styles.adminfeaturebutton} ${clickedButton == 8 ? styles.clicked : ""}`} onClick={() => { handleButtonClick(8) }}>
          Manage Promotions
        </div>
      </div>
      <div>
        {
          showSubcontent()
        }
      </div>
    </div>
  )
}

export default AdminPage