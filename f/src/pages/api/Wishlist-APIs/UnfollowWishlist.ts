import API from "@/env";
import axios from "axios";

const UnfollowWishlist = async (request: object) =>
{

  try
  {

    const response = await axios.post(`${API}/unfollow-wishlist`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default UnfollowWishlist;