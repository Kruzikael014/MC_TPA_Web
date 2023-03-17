import API from "@/env";
import axios from "axios";

const GetFilteredShopProduct = async (request: Object, filter: string) =>
{

  try
  {
    let endpoint = ""

    if (filter === "Lowest Price")
    {
      endpoint = "lowest-priced-products"
    }
    else if (filter === "Highest Price")
    {
      endpoint = "highest-priced-products"
    }
    else if (filter === "Most Bought")
    {
      endpoint = "most-bought-products"
    }
    console.log("request : ");
    
    console.log(request);
    

    const response = await axios.post(`${API}/${endpoint}`, request)
    console.log(response);
    
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetFilteredShopProduct;