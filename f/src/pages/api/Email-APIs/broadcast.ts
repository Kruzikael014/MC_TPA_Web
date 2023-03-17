import API from "@/env"
import BroadcastRequest from "@/types/BroadcastRequest"
import axios from "axios"


const Broadcast = async (message: BroadcastRequest) =>
{

  try
  {
    const reponse = await axios.post(API + "/broadcast", message)
    return reponse
  } catch (error)
  {
    console.log(error + " MC debug")
    return -1
  }

}

export default Broadcast