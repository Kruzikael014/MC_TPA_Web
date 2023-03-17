import API from "@/env";
import axios from "axios";

const GetTotalTransaction = async (userId: number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-transaction-count/${userId}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetTotalTransaction;