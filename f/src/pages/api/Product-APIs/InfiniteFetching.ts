import API from "@/env";
import axios from "axios";

const InfiniteFetching = async (offset:number) =>
{
  try
  {
    const response = await axios.get(`${API}/get-offset?offset=${offset*20}`) 
    return response.data
  } catch (error)
  {
    console.log(error)
  }

}

export default InfiniteFetching;