import API from "@/env";
import axios from "axios";


const GetWishlistHeadDetail = async (id: number) =>
{

  try
  {

    console.log(`${API}/get-wishlist/${id}`);
    
    const response = await axios.get(`${API}/get-wishlist/${id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetWishlistHeadDetail;