import API from "@/env";
import axios from "axios";

const SearchOrder = async (user_id: number, user_role: string, query: string) =>
{

  try
  {

    const response = await axios.get(`${API}/search-order?user_id=${user_id}&role=${user_role}&q=${query}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default SearchOrder;