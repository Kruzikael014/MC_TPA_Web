import API from "@/env";
import axios from "axios";

const GetRecommendation = async (category : string) =>
{
  try
  {

    const response = await axios.get(`${API}/get-similar-product?category=${category}`)
    console.log(response);
    
    return response.data

  } catch (error)
  {
    console.log(error);
  }
}

export default GetRecommendation;