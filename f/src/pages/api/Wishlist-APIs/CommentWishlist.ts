import API from "@/env";
import axios from "axios";

const commentWishlist = async (request: object) =>
{

  try
  {

    const response = await axios.post(`${API}/comment-wishlist`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default commentWishlist;