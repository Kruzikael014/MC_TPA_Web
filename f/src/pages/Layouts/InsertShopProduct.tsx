import ButtonInput from "@/components/ButtonInput"
import InputField from "@/components/InputField"
import styles from "@/styles/HomePage.module.css"
import User from "@/types/User"
import getCookie from "@/util/GetCookie"
import uploadImage, { getUrl } from "@/util/ImageController"
import { useEffect, useState } from "react"
import getUserFromToken from "../api/getuser"

import { v4 } from "uuid"
import Product from "@/types/Product"
import InsertProduct from "../api/InsertProduct"

interface Image
{
  imageFile: File
}

export default function InsertShopProduct()
{

  const [productName, setProductName] = useState("")
  const [ProductCategory, setProductCategory] = useState("")
  const [ProductDescription, setProductDescription] = useState("")
  const [file, setFile] = useState<File | undefined>(undefined)
  const [productPrice, setProductPrice] = useState()
  const [productStock, setProductStock] = useState()
  const [productDetails, setProductDetails] = useState([""])


  const uuid = v4()


  const [product, setProduct] = useState<Product>({ id: 0, product_category: "", product_description: "", product_details: "", product_image: "", product_name: "", product_price: 0, product_stock: 0, uploaded_by: 0, product_rating: 0 })

  const [numDetails, setNumDetails] = useState(1)


  const [user, setUser] = useState<User>({ id: 0, First_name: "", Last_name: "", Email: "", Password: "", Phone_num: "", Email_subscriber: false, Status: "", Role_name: "", balance: 0})

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

    const product:Product = {
      product_category: ProductCategory,
      product_description: ProductDescription,
      product_details: getProductDetails(productDetails),
      product_name: productName,
      product_price: Number(productPrice),
      product_stock: Number(productStock),
      uploaded_by: Number(user.id),
      product_image: getProductImage(file),
      product_rating: 0
    }
      console.log("product : ")
      console.log(product)
      await uploadImage(file, product.product_image)
      const url = await getUrl(product.product_image)
      console.log(url)
      const response = await InsertProduct(product)
      console.log("Backend Response : " + response)
      if (response !== -1)
      {
        alert("Product Successfully inserted!")
      } else if (response === -1)
      {
        alert("Insertion failed!")
      }
      window.location.reload()
  }

  const handleImageChange = (e: any) =>
  {
    if (e.target.files[0])
    {
      setFile(e.target.files[0])
    }
  }

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
      <div className={styles.InsertShopProduct}>
        <form onSubmit={handleFormChange} className={styles.insertproductform}>
          <h1>Insert Product</h1>
          <InputField required placeholder={"Product Name"} width={800} onChange={setProductName} value={productName} />
          <InputField required placeholder={"Product Category"} width={800} onChange={setProductCategory} value={ProductCategory} />
          <input required className={styles.logreginput} style={{ width: "800px", alignSelf: "center" }} accept="image/png, image/jpeg, image/jpg" placeholder="Product Image" type={"file"} onChange={(e) => { handleImageChange(e) }} />
          <InputField required placeholder={"Product Description"} width={800} onChange={setProductDescription} value={ProductDescription} />
          <InputField required width={800} placeholder={"Product Price"} number onChange={setProductPrice} value={productPrice} />
          {/* <div className={styles.productpricelabel}>Product Price</div> */}
          <InputField required width={800} placeholder={"Product Stock"} number onChange={setProductStock} value={productStock} />
          {/* <div className={styles.productstocklabel}>Product Stock</div> */}
          {productDetails.map((detail, index) => (
            <input
              required
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
          <ButtonInput submit blue placeholder="Insert Product" />
        </form>
      </div>
    </>
  )
} 