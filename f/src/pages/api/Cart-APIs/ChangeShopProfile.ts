import API from "@/env";
import ShopDetail from "@/types/ShopDetail";
import axios from "axios";



const ChangeShopProfile = async (id: number, request: ShopDetail) =>
{

  try
  {
    const response = await axios.patch(`${API}/update-shop-profile/${id}`, request)
    return response.data
  } catch (error)
  {
    console.log(error);
  }
}

export default ChangeShopProfile;