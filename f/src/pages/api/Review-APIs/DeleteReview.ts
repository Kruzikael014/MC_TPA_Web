import API from "@/env";
import axios from "axios";

const DeleteReview = async (review_id: number) =>
{

  try
  {

    const response = await axios.delete(`${API}/delete-review?review_id=${review_id}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default DeleteReview;