
import styles from "@/styles/HomePage.module.css"
import { useEffect, useState } from "react"
import BanApi from "../api/User-APIs/BanApi"
import ListCustomer from "../api/User-APIs/ListCustomer"
import UnbanApi from "../api/User-APIs/UnbanApi"

const ManageUser = () =>
{

  const [user, setUser] = useState([])
  let loading = true

  useEffect(() =>
  {
    const fetchUser = async () =>
    {
      const response = await ListCustomer()

      console.log(response)
      setUser(response)
    }
    fetchUser()

  }, [])

  if (user.length !== 0) loading = false

  const unban = async (id: number) =>
  {
    const response = await UnbanApi(id)
    console.log(response)
    alert(response)
    window.location.reload()
  }

  const ban = async (id: number) =>
  {
    const response = await BanApi(id)
    console.log(response)
    alert(response)
    window.location.reload()
  }

  return (
    <div className={styles.ManageUser}>
      <div className={styles.title}>
        <h1>
          User list
        </h1>
      </div>
      <div className={styles.shopcontainer}>

        <div className={styles.shopheader}>
          <div className={styles.id}>
            ID
          </div>
          <div className={styles.name}>
            Name
          </div>
          <div className={styles.email}>
            Email
          </div>
          <div className={styles.phone}>
            Phone Number
          </div>
          <div className={styles.status}>
            Status
          </div>
          <div className={styles.action}>
            Action
          </div>
        </div>

        <div className={styles.shops}>
          {
            (!loading) &&
            user
              .map((shop: any, index: any) =>
              {
                return (
                  <div className={styles.shop} key={index}>
                    <div className={styles.id}>
                      {shop.id}
                    </div>
                    <div className={styles.name}>
                      {shop.first_name}&nbsp;{shop.last_name}
                    </div>
                    <div className={styles.email}>
                      {shop.email}
                    </div>
                    <div className={styles.phone}>
                      {shop.phone_num}
                    </div>
                    <div className={styles.status}>
                      {shop.status}
                    </div>
                    <div className={styles.buttons}>
                      <button onClick={(e) => { unban(shop.id) }} className={`${styles.button} ${styles.colgreen}`}>
                        <i className="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;
                        Unban
                      </button>
                      <button onClick={(e) => { ban(shop.id) }} className={`${styles.button} ${styles.colred}`}>
                        <i className="fa-solid fa-trash"></i>&nbsp;&nbsp;
                        Ban
                      </button>
                    </div>
                  </div>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

export default ManageUser