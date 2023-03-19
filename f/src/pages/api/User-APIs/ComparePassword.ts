import API from "@/env";
import axios from "axios";

const ComparePass = async (request: Object) =>
{

  try
  {

    const response = await axios.post(`${API}/compare-pass`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default ComparePass;