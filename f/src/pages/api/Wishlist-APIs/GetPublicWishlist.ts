import API from "@/env";
import axios from "axios";

const GetPublicWishlist = async (page:number, size:number, filter: string, user_id:number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-public-wishlist?page=${page}&size=${size}&filter=${filter}&user_id=${user_id}`)
    console.log(response);
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetPublicWishlist;