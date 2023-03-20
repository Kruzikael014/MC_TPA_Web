import API from "@/env";
import axios from "axios";

const UpdateWishlistHeader = async (request: Object) =>
{

  try
  {

    const response = await axios.patch(`${API}/update-wishlist-header`,request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default UpdateWishlistHeader;