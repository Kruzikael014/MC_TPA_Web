import API from "@/env";
import Review from "@/types/Review";
import axios from "axios";

const SaveReview = async (newRequest: Review) =>
{

  try
  {

    const response = await axios.post(`${API}/save-review`, newRequest)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default SaveReview;