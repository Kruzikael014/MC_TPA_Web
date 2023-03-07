import API from "@/env";
import axios from "axios";

const DeleteShopProduct = async (id:number | undefined) => {

  try {
    
    const response = await axios.delete(`${API}/delete-product/${id}`)
    console.log(response + " in api call")
    return response.data

  } catch (error) {
    console.log(error)
  }

}
 
export default DeleteShopProduct;