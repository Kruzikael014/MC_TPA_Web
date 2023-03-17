import API from "@/env";
import OTPRequest from "@/types/OTPRequest";
import axios from "axios";

const GetOTP = async (request:OTPRequest) => {

  try {
      const response = await axios.post(`${API}/get-otp`, request) 
      return response.data
  } catch (error) {
    console.log(error);
  }

}
 
export default GetOTP;