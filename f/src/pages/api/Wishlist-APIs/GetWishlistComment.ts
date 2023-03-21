import API from "@/env";
import axios from "axios";

const GetWishlistComment = async (wishlist_id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-wishlist-comments?wishlist_id=${wishlist_id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetWishlistComment;