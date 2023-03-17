import API from "@/env";
import axios from "axios";

const GetCart = async (id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-cart?user_id=${id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetCart;