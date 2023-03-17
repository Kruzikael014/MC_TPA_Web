
import styles from "@/styles/HomePage.module.css"
import PromotionBanner from "@/types/PromotionBanenr";
import { getUrl } from "@/util/ImageController";
import Image from "next/image";
import { useEffect, useState } from "react";
import UpdatePromo from "../api/Promo-APIs/UpdatePromo";

interface Promotion
{
  promo: PromotionBanner
}

const PromotionRow = (props: Promotion) =>
{

  const { promo } = props

  let { id, promo_banner, is_showing } = promo

  const [imageUrls, setImageUrls] = useState("")

  useEffect(() =>
  {
    const fetchShopItem = async () =>
    {
      const url = await getUrl(promo_banner)
      setImageUrls(url)
    }
    fetchShopItem()
  }, [])

  const handleActivation = async () =>
  {
    console.log("The request being sent : "  + id)
    const response = await UpdatePromo(id)
    alert(response)
    window.location.reload()
  }

  return (
    <>
      <div className={styles.shopspromo}>
        <div className={styles.shop} key={id}>
          <div className={styles.id}>
            {id}
          </div>
          <div className={styles.name}>
            <div className={styles.imagecontainer}>
              <Image alt="NOT FOUND" width={900} height={506} src={(imageUrls) ? imageUrls : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"} className={styles.theimage} />
            </div>
          </div>
          <div className={styles.email}>
            {(is_showing) ? "Active" : "Inactive"}
          </div>
          <div className={styles.buttons}>
            {
              (is_showing)
                ?
                <button onClick={handleActivation} className={`${styles.button} ${styles.colgreen}`}>
                  <i className="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;
                  Activate
                </button>
                :
                <button onClick={handleActivation}
                  className={`${styles.button} ${styles.colred}`}>
                  <i className="fa-solid fa-trash"></i>&nbsp;&nbsp;
                  Deactivate
                </button>
            }
          </div>
        </div>
      </div>

    </>
  );
}

export default PromotionRow;