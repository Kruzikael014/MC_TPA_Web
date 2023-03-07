import API from "@/env";
import axios from "axios";

const searchProduct = async (input:string) =>
{

  try {

      const response = await axios.get(`${API}/search-product?name=${input}`)
      return response.data

  } catch (error) {
    console.log(error);
  }

}

export default searchProduct;