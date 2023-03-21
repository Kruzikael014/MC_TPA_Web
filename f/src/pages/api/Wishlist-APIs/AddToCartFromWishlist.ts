import API from "@/env";
import axios from "axios";

const AddToCartFromWishlist = async (request: object) =>
{

  try
  {

    const response = await axios.post(`${API}/copy-wishlist-cart`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default AddToCartFromWishlist;