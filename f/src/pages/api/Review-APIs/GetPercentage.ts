import API from "@/env"
import axios from "axios"

const GetPercentage = async (type: number, shop_id:number) =>
{
  let endpoint = ""

  if (type === 1)
  {
    endpoint = "get-percentage-ontime"
  }
  if (type === 2)
  {
    endpoint = "get-percentage-satisfaction"
  }
  if (type === 3)
  {
    endpoint = "get-percentage-accuracy"
  }

  const response = await axios.get(`${API}/${endpoint}?shop_id=${shop_id}`)
  return response.data

}

export default GetPercentage;