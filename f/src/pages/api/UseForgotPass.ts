import API from "@/env";
import ForgotPassVerifYRequet from "@/types/ForgotPassVerifyRequest";
import axios from "axios";


const UseForgotPass = async (request:ForgotPassVerifYRequet) =>
{

  try
  {

    const response = await axios.post(`${API}/use-forgot-pass`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default UseForgotPass;