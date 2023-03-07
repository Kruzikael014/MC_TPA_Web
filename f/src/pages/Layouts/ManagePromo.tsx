
import styles from "@/styles/HomePage.module.css"
import PromotionBanner from "@/types/PromotionBanenr"
import { getUrl } from "@/util/ImageController"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import GetPromo from "../api/GetPromo"
import { changeFunc } from "../HomePage/AdminPage"
import PromotionRow from "./PromotionRow"


const ManagePromo = () =>
{

      const [promo, setPromo] = useState<PromotionBanner[]>([])
      const router = useRouter()
      var loading = true

      useEffect(() =>
      {

            const fetchPromo = async () =>
            {

                  const response = await GetPromo()
                  console.log(response)
                  setPromo(response)

            }
            fetchPromo()

      }, [])

      if (promo.length > 0) loading = false

      const handlePromoAdd = async () =>
      {
            console.log("test");

            changeFunc(9)
            router.push(
                  {
                        pathname: "/",
                        query: {
                              updateId: 5
                        }
                  }
            )
      }


      return (
            <div className={styles.ManagePromo}>
                  <div className={styles.header}>
                        <h1 className={styles.title}>
                              Manage Promo
                        </h1>
                        <div className={styles.plusicon} onClick={handlePromoAdd}>
                              <i className="fa-solid fa-plus fa-2xl"></i>
                        </div>
                  </div>
                  <div className={styles.shopcontainer}>



                        <div className={styles.shopheader}>
                              <div className={styles.id}>
                                    ID
                              </div>
                              <div className={styles.name}>
                                    Image
                              </div>
                              <div className={styles.status}>
                                    Status
                              </div>
                              <div className={styles.action}>
                                    Action
                              </div>
                        </div>
                        {
                              !loading &&
                              promo.map((promo: PromotionBanner, index) =>
                              {
                                    return (
                                          <>
                                                <PromotionRow promo={promo} />
                                          </>
                                    )
                              })
                        }
                  </div>
            </div>
      )
}

export default ManagePromo
