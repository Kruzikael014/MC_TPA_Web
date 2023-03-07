import ButtonInput from "@/components/ButtonInput"
import InputField from "@/components/InputField"
import styles from "@/styles/HomePage.module.css"
import Product from "@/types/Product"
import User from "@/types/User"
import getCookie from "@/util/GetCookie"
import uploadImage, { deleteImage, getUrl } from "@/util/ImageController"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { v4 } from "uuid"
import GetSingleProduct from "../api/GetSingleProduct"
import getUserFromToken from "../api/getuser"
import UpdateProduct from "../api/UpdateProduct"
import ShopOwner from "../HomePage/ShopOwner"
import Footer from "../../components/Footer"
import Navbar from "../../components/Navbar"

export default function UpdateShopProduct()
{

  const [productName, setProductName] = useState("")
  const [ProductCategory, setProductCategory] = useState("")
  const [ProductDescription, setProductDescription] = useState("")
  const [file, setFile] = useState<File | undefined>(undefined)
  const [productPrice, setProductPrice] = useState()
  const [productStock, setProductStock] = useState()
  const [productDetails, setProductDetails] = useState([""])
  const [productRating, setProductRating] = useState(0)


  const uuid = v4()


  const [product, setProduct] = useState<Product>({ id: 0, product_category: "", product_description: "", product_details: "", product_image: "", product_name: "", product_price: 0, product_stock: 0, uploaded_by: 0, product_rating: 0 })

  const [numDetails, setNumDetails] = useState(1)

  const handleImageChange = (e: any) =>
  {
    if (e.target.files[0])
    {
      setFile(e.target.files[0])
    }
  }

  const [user, setUser] = useState<User>({ id: 0, First_name: "", Last_name: "", Email: "", Password: "", Phone_num: "", Email_subscriber: false, Status: "", Role_name: "", balance: 0 })

  useEffect(() =>
  {
    const getCurrUser = async () =>
    {
      const ob = {
        JWToken: getCookie("JWToken")
      }
      const response = await getUserFromToken(ob)
      setUser(prevUser => ({
        ...prevUser,
        id: response.id,
        First_name: response.first_name,
        Last_name: response.last_name,
        Email: response.email,
        Password: response.password,
        Phone_num: response.phone_num,
        Email_subscriber: response.email_subscriber,
        Status: response.status,
        Role_name: response.role_name,
        balance: response.balance
      }))
    }

    getCurrUser()
  }, [product])


  const handleFormChange = async (e: any) =>
  {

    const getProductDetails = (a: string[]) =>
    {
      let result = ""
      a.forEach((e, i) =>
      {
        result += e + ";"
      })
      return result
    }
    const getProductImage = (a: File | undefined, b?: string) =>
    {
      var res = ""
      if (b && a !== undefined)
      {
        res = b + "_" + a.name
        return res
      }
      if (a !== undefined)
      {
        res = uuid + "_" + a.name
        return res
      }
    }

    e.preventDefault()

    const oldproduct: Product = await GetSingleProduct(Number(id))

    console.log("old product : ")
    console.log(oldproduct)
    console.log("old product id : " + oldproduct.id);

    const productx: Product = {
      id: oldproduct.id,
      product_category: (ProductCategory !== null && ProductCategory !== undefined && ProductCategory !== "") ? ProductCategory : oldproduct.product_category,
      product_description: (ProductDescription !== null && ProductDescription !== undefined && ProductDescription !== "") ? ProductDescription : oldproduct.product_description,
      product_details: (productDetails !== null && productDetails !== undefined && productDetails[0] !== "") ? getProductDetails(productDetails) : oldproduct.product_details,
      product_name: (productName !== null && productName !== undefined && productName !== "") ? productName : oldproduct.product_name,
      product_price: (productPrice !== null && productPrice !== undefined && Number(productPrice) !== 0) ? Number(productPrice) : oldproduct.product_price,
      product_stock: (productStock !== null && productStock !== undefined && Number(productStock) !== 0) ? Number(productStock) : oldproduct.product_stock,
      uploaded_by: Number(user.id),
      product_image: (getProductImage(file) !== null && getProductImage(file) !== undefined && ProductCategory !== "") ? getProductImage(file) : oldproduct.product_image,
      product_rating: product?.product_rating
    }

    console.log("new product : ")
    console.log(productx)

    console.log("deleting products/" + oldproduct.product_image);
    await deleteImage(`products/${oldproduct}`)
    await uploadImage(file, productx.product_image)

    const response = await UpdateProduct(productx)
    const url = await getUrl(productx.product_image)
    const updateStatus = await UpdateProduct(productx)

    if (updateStatus !== -1)
    {
      console.log("Success")
      window.location.reload()
    } else
    {
      console.log("Failed to update");
    }
  }


  const router = useRouter()
  const id = router?.query?.updateId
  console.log(id)

  const handleDetailChange = (e: any, index: number) =>
  {
    const newDetails = [...productDetails]
    if (e.target && e)
    {
      newDetails[index] = e.target?.value
      setProductDetails(newDetails)
    }
  }

  const increaseDetail = () =>
  {
    setNumDetails(numDetails + 1)
    setProductDetails([...productDetails, ""])
  }

  return (
    <>
      <div className={styles.UpdateShopProduct}>
        <form onSubmit={handleFormChange} className={styles.insertproductform}>
          <h1>
            Update Product
          </h1>
          <InputField placeholder={"Product Name"} width={800} onChange={setProductName} value={productName} />
          <InputField placeholder={"Product Category"} width={800} onChange={setProductCategory} value={ProductCategory} />
          <input className={styles.logreginput} style={{ width: "800px", alignSelf: "center" }} accept="image/png, image/jpeg, image/jpg" placeholder="Product Image" type={"file"} onChange={(e) => { handleImageChange(e) }} />
          <InputField placeholder={"Product Description"} width={800} onChange={setProductDescription} value={ProductDescription} />
          <InputField width={800} placeholder={"Product Price"} number onChange={setProductPrice} value={productPrice} />
          {/* <div className={styles.productpricelabel}>Product Price</div> */}
          <InputField width={800} placeholder={"Product Stock"} number onChange={setProductStock} value={productStock} />
          {/* <div className={styles.productstocklabel}>Product Stock</div> */}
          {productDetails.map((detail, index) => (
            <input

              className={styles.logreginput}
              key={index}
              placeholder={"Product Details"}
              style={{
                width: "800px"
              }}
              onChange={(e: any) => handleDetailChange(e, index)}
              value={detail}
            />
          ))}
          {[...Array(numDetails)].map((_, index) => (
            <i
              key={index}
              className="fa-solid fa-square-plus fa-3x"
              onClick={increaseDetail}
              style={{ display: index === numDetails - 1 ? "inline-block" : "none" }}
            />
          ))}
          <ButtonInput submit blue placeholder="Update
           Product" />
        </form>
      </div>

    </>
  )
} 