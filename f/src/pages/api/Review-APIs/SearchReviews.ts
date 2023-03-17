import API from "@/env";
import SearchReview from "@/types/SearchReview";
import axios from "axios";

const SearchReviews = async (request: SearchReview) =>
{

  try
  {

    const response = await axios.get(`${API}/search-review?q=${request.q}&shop_id=${request.shop_id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default SearchReviews;