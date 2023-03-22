import API from "@/env";
import axios from "axios";

const GetUserFromId = async (id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-user-by-id/${id}`)
    // console.log(response);
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetUserFromId;