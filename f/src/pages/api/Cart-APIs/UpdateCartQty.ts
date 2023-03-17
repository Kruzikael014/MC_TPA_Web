import API from "@/env";
import UpdateRequest from "@/types/UpdateRequest";
import axios from "axios";

const UpdateCartQty = async (requestBody:UpdateRequest) =>
{

  try
  {

    const response = await axios.post(`${API}/update-cart-qty`, requestBody)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default UpdateCartQty;