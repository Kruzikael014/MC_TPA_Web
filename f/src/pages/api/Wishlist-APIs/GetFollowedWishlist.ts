import API from "@/env";
import axios from "axios";

const GetFollowedWishlist = async (user_id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-followed-wishlist?user_id=${user_id}`)
    console.log(response);
    return response.data

  } catch (error)
  {
    console.log(error);

  }

}

export default GetFollowedWishlist;