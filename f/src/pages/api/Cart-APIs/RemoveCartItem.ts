import API from "@/env";
import RemoveCartRequest from "@/types/RemoveCartRequest";
import axios from "axios";

const RemoveCartItem = async (request: RemoveCartRequest) =>
{

  try
  {

    const response = await axios.post(`${API}/remove-cart-item`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default RemoveCartItem;