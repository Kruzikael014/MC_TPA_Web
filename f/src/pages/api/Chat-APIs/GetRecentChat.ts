import API from "@/env";
import axios from "axios";

const GetRecentChat = async (user_id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/recent-chat/${user_id}`)
    console.log(response);
    
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetRecentChat;