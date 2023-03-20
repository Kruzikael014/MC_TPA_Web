import API from "@/env";
import axios from "axios";

const MoveToCart = async (request: Object) =>
{

  try
  {

    const response = await axios.post(`${API}/extract-from-wishlist`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default MoveToCart;