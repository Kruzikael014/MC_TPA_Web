import API from "@/env";
import GetProductCategoryRequest from "@/types/GetProductCategoryRequest";
import axios from "axios";

const GetProductCategory = async (request:GetProductCategoryRequest) =>
{

  try
  {

    const response = await axios.post(`${API}/get-product-category`, request)
    console.log(response);
    
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetProductCategory;
