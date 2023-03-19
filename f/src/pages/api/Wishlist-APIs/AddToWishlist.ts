import API from "@/env";
import WishlistDetail from "@/types/WishlistDetail";
import axios from "axios";

const AddToWishlist = async (request: WishlistDetail) =>
{

  try
  {

    const response = await axios.post(`${API}/add-item-wishlist`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default AddToWishlist;