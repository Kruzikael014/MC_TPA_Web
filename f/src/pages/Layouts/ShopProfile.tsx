import ButtonInput from "@/components/ButtonInput"
import InputField from "@/components/InputField"
import LiveImage from "@/components/LiveImage"
import styles from "@/styles/HomePage.module.css"
import ShopDetail from "@/types/ShopDetail"
import User from "@/types/User"
import getCookie from "@/util/GetCookie"
import uploadImage, { deleteImage, getUrl } from "@/util/ImageController"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { v4 } from "uuid"
import ChangeShopProfile from "../api/ChangeShopProfile"
import getUserFromToken from "../api/getuser"
import ShopDetailAPI from "../api/ShopDetailAPI"

export default function ShopProfile()
{

  const [user, setUser] = useState<User | undefined>(undefined)
  const [shopDetail, setShopDetail] = useState<ShopDetail | undefined>(undefined)
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const router = useRouter()
  const uuid = v4()

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

  useEffect(() =>
  {

    const getShopDetail = async () =>
    {

      if (user !== undefined)
      {
        const response = await ShopDetailAPI(Number(user.id))
        if (response !== 'Failed to find shop detail!')
        {
          setShopDetail(response)
        }
      }

    }
    getShopDetail()

  }, [user])

  const handleFileChanges = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    if (e.target.files !== null && e.target.files.length > 0)
    {
      setFile(e.target.files[0])
    }
  }

  const handleChangeShopProfile = async (e: React.FormEvent<HTMLFormElement>) =>
  {
    const getProductImage = (a: File | undefined) =>
    {
      var res = ""
      if (a !== undefined)
      {
        res = uuid + "_" + a.name
        return res
      }
    }

    e.preventDefault()

    if (file !== null)
    {
      const fileName = getProductImage(file)

      if (shopDetail?.shop_banner !== undefined && shopDetail?.shop_banner !== "")
      {
        // delete dulu supaya gak numpuk
        await deleteImage(`products/${shopDetail?.shop_banner}`)
      }

      await uploadImage(file, fileName)

      const shopDetailRequest: ShopDetail = {
        shop_banner: fileName,
        shop_description: description
      }

      const response = await ChangeShopProfile(Number(shopDetail?.id), shopDetailRequest)
      alert(response)
      window.location.reload()
    }
  }

  const showShopPreview = () =>
  {
    router.push({pathname : `/shop-page`, query : { id: shopDetail?.id }})
  }

  return (
    <>
      <div className={styles.ShopProfile}>
        <h1>
          Manage shop profile
        </h1>
        <form onSubmit={handleChangeShopProfile} className={styles.shopprofileform} >


          <InputField onChange={setDescription} value={description} required width={600} placeholder={"Shop description"} />

          <input type="file"
            style={{ width: "600px", alignSelf: "center" }}
            accept="image/png, image/jpeg, image/jpg"
            placeholder="Shop Banner"
            required
            className={styles.logreginput}
            onChange={handleFileChanges} />

          <div className={styles.formbuttons}>
            <ButtonInput placeholder="Apply Changes" blue centered submit width={240} />
            <ButtonInput blue placeholder="Preview shop" width={240} func={showShopPreview} centered />
          </div>
        </form>
      </div>
    </>
  )
} 