import API from "@/env";
import axios from "axios";

const DuplicateWishlist = async (request: Object) =>
{

  try
  {

    const response = await axios.post(`${API}/duplicate-wishlist`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default DuplicateWishlist;