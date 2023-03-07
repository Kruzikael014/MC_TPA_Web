import API from "@/env";
import axios from "axios";

const GetAllProduct = async () =>
{
  try {
    const response = await axios.get(`${API}/products/all`)
    return response.data
  } catch (error) {
    console.log(error);
    
  }
}

export default GetAllProduct;