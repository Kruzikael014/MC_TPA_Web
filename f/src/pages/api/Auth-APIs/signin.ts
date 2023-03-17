import API from "@/env";
import LoginRequest from "@/types/LoginRequest";
import axios from "axios"

const SignUserIn = async (req: LoginRequest) =>
{
  try
  {
    const response = await axios.post(API + "/login", req)
    console.log(response)
    return response.data
  } catch (error)
  {
    return -1
  }
}

export default SignUserIn;