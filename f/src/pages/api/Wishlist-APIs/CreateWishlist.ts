import API from "@/env";
import axios from "axios";

const CreateWishList = async (request: Object) =>
{

  try
  {

    const response = await axios.post(`${API}/create-wishlist-header`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default CreateWishList;