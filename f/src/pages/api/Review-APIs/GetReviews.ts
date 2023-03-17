import API from "@/env";
import axios from "axios";

const GetReviews = async (user_id:number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-shopreview?shop_id=${user_id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetReviews;