import API from "@/env";
import axios from "axios";

const UpdateWishlistQty = async (request: Object) =>
{

  try
  {

    const response = await axios.patch(`${API}/update-wishlist-qty`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default UpdateWishlistQty;