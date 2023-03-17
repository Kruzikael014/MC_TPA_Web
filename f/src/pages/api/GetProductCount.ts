import API from "@/env";
import axios from "axios";

const GetProductCount = async (id : number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-product-count/${id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetProductCount