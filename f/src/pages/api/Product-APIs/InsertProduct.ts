import API from "@/env";
import Product from "@/types/Product";
import axios from "axios";

const InsertProduct = async (product:Product) => {
    try {
      
      const response = await axios.post(API + "/insert-product", product)
      return response.data

    } catch (error) {
      console.log(error)
      return -1
    }
}
 
export default InsertProduct;