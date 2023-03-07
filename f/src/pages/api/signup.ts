import API from "@/env";
import User from "@/types/User";
import axios from "axios";


const SignUserUp = async (newUser: User) =>
{

  try
  {

    const response = await axios.post(API + '/signup', newUser)
    console.log(response.data)
    return response.data;

  } catch (error)
  {
    return -1;
  }

}

export default SignUserUp;
