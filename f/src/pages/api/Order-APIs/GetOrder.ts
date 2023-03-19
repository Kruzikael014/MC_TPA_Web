import API from "@/env";
import axios from "axios";


const GetOrder = async (user_id: number, role: string) =>
{

  try
  {
    let userEndpoint = `${API}/get-order-user/${user_id}`
    let shopEndpoint = `${API}/get-order-shop/${user_id}`

    if (role === "Shop Owner")
    {
      const response = await axios.get(shopEndpoint)
      console.log(response);
      return response.data
    }
    else
    {
      const response = await axios.get(userEndpoint)
      console.log(response);
      return response.data
    }


  } catch (error)
  {
    console.log(error);
  }

}

export default GetOrder;