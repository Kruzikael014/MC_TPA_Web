import API from "@/env";
import axios from "axios";

const ChangePhoneNumber = async (request: Object) =>
{

  try
  {

    const response = await axios.post(`${API}/change-phone`, request)
    return response.data

  } catch (error)
  {
    console.log();
  }

}

export default ChangePhoneNumber;