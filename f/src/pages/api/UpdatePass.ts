import API from "@/env";
import ChangePassRequest from "@/types/ChangePassRequest";
import axios from "axios";


const UpdatePass = async (request:ChangePassRequest) =>
{

  try
  {

    const response = await axios.post(`${API}/change-pass`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default UpdatePass;