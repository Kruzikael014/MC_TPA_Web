import API from "@/env";
import axios from "axios";

const GetCartTotal = async (cart_id:number | undefined) =>
{

  try
  {

    const response = await axios.get(`${API}/get-cart-total/${Number(cart_id)}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetCartTotal;