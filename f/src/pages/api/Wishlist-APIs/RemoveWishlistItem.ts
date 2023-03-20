import API from "@/env";
import axios from "axios";

const RemoveWishlistItem = async (request: Object) =>
{

  try
  {

    const response = await axios.post(`${API}/remove-wishlist-item`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default RemoveWishlistItem;