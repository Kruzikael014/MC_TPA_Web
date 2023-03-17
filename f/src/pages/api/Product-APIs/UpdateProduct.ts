import API from "@/env";
import Product from "@/types/Product";
import axios from "axios";

const UpdateProduct = async (product:Product) => {

  try {
    
    const response = await axios.patch(`${API}/update-product/${product.id}`, product)

    return response.data
  } catch (error) {
    console.log(error)
  }

}
 
export default UpdateProduct;