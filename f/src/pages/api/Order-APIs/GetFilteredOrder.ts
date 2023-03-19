import API from "@/env";
import axios from "axios";

const GetFilteredOrder = async (user_id: number, user_role: string, filter: string) =>
{

  try
  { 
    console.log("a");
    
    const response = await axios.get(`${API}/get-order-filter?user_id=${user_id}&user_role=${user_role}&filter=${filter}`)
    console.log(response);
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetFilteredOrder;