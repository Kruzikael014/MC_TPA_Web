import API from "@/env";
import Product from "@/types/Product";
import axios from "axios";

const GetShopProduct = async (uploaded_by: number | undefined, page?: number): Promise<Array<Product> | undefined> =>
{

  try
  {
    
    const response = await axios.get(`${API}/product-paginated?uploaded_by=${uploaded_by}&page=${page}`)
    return response.data
  } catch (error)
  {
    console.log(error)
  }

}

export default GetShopProduct;