import API from "@/env";
import ForgotPassRequest from "@/types/ForgotPassRequest";
import axios from "axios";


const GetForgotPass = async (request:ForgotPassRequest) =>
{

  try
  {

    const response = await axios.post(`${API}/get-forgot-pass`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetForgotPass;