import API from "@/env";
import axios from "axios";

const GetSortedReview = async (shop_id: number, sort: string) =>
{

  try
  {

    const response = await axios.get(`${API}/get-shopreview-filtered?shop_id=${shop_id}&sort=${sort}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetSortedReview;