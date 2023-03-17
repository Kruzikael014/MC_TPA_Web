import ButtonInput from "@/components/ButtonInput";
import styles from "@/styles/HomePage.module.css"
import PromotionBanner from "@/types/PromotionBanenr";
import uploadImage from "@/util/ImageController";
import { useState } from "react";
import { v4 } from "uuid";
import UploadPromo from "../api/Promo-APIs/UploadPromo";

const InsertPromotion = () =>
{

  const [file, setFile] = useState<File | undefined>(undefined)

  const handleImageChange = (e: any) =>
  {
    if (e.target.files[0])
    {
      setFile(e.target.files[0])
    }
  }
  const uuid = v4()

  const handlePromoSubmit = async (e:any) =>
  {

    e.preventDefault()

    const getProductImage = (a: File | undefined) =>
    {
      var res = ""
      if (a !== undefined)
      {
        res = uuid + "_" + a.name
        return res
      }
    }

    const banner:PromotionBanner = {
      is_showing: true,
      promo_banner: getProductImage(file)
    }

    await uploadImage(file, banner.promo_banner)

    const response = await UploadPromo(banner)

    console.log(response)
    alert(response)
    window.location.reload()
  }

  return (
    <>
      <div className={styles.insertpromo}>
        <h1 className={styles.title}>Insert Promotion</h1>
        <form className={styles.form} onSubmit={(e) => { handlePromoSubmit(e) }}>

          <input required className={styles.logreginput} style={{ width: "800px", alignSelf: "center" }} accept="image/png, image/jpeg, image/jpg" placeholder="Product Image" type={"file"} onChange={(e) => { handleImageChange(e) }} />
          <ButtonInput blue submit placeholder="Add promo" />
        </form>
      </div>

    </>
  );
}

export default InsertPromotion;