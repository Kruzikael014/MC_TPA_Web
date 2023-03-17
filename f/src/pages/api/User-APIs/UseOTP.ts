import API from "@/env";
import OTPVerifyRequest from "@/types/OTPVerifyRequest";
import axios from "axios";

const UseOTP = async(request:OTPVerifyRequest) =>
{

  try
  {

    const response = await axios.post(`${API}/use-otp`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default UseOTP;