import API from "@/env";
import axios from "axios";

const GetPromo = async () => {

  try {
    
    const response = await axios.get(`${API}/get-poster/all`)
    return response.data

  } catch (error) {
    console.log(error)
  }

}
 
export default GetPromo;