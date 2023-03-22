import API from "@/env";
import axios from "axios";

const GetChat = async (from: string, to: string) =>
{

  try
  {

    const response = await axios.get(`${API}/get-message?from=${from}&to=${to}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetChat;