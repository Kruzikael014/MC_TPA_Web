import API from "@/env";
import axios from "axios";

const FollowWishlist = async (request: Object) =>
{

  try
  {

    const response = await axios.post(`${API}/follow-wishlist`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default FollowWishlist;