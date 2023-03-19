import API from "@/env";
import axios from "axios";

const GetFilteredOrder = async (user_id: number, user_role: string, filter: string) =>
{

  try
  {

    const response = await axios.get(`${API}/get-order-filter?user_id=${user_id}&fitler=${filter}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetFilteredOrder;