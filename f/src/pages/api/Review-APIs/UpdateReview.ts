import API from "@/env";
import axios from "axios";

const UpdateReview = async (request: object) =>
{

  try
  {

    const response = await axios.patch(`${API}/update-review`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default UpdateReview;