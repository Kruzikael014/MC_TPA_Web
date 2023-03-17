import API from "@/env";
import axios from "axios";

const GetReviewCount = async (shop_id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/shop-review-counts?shop_id=${shop_id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetReviewCount;