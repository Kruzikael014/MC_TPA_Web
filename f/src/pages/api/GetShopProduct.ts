import API from "@/env";
import Product from "@/types/Product";
import axios from "axios";

const GetShopProduct = async (uploaded_by: number | undefined): Promise<Array<Product> | undefined> =>
{

  try
  {
    console.log(`${API}/product?uploaded_by=${uploaded_by}`);
    
    const response = await axios.get(`${API}/product?uploaded_by=${uploaded_by}`)
    return response.data
  } catch (error)
  {
    console.log(error)
  }

}

export default GetShopProduct;