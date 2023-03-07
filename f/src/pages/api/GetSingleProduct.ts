import API from "@/env";
import axios from "axios";

const GetSingleProduct = async (id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/product/${id}`)
    console.log(response)
    return response.data

  } catch (error)
  {
    console.log(error)
  }

}

export default GetSingleProduct;