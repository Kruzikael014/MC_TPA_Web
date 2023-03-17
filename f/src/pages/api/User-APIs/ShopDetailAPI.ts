import API from "@/env";
import axios from "axios";


const ShopDetailAPI = async (id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-shop-detail?shop_id=${id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default ShopDetailAPI;