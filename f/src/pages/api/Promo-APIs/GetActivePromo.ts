import API from "@/env";
import axios from "axios";

const GetActivePromo = async () => {

  try {
    
    const response = await axios.get(`${API}/get-active-poster`)
    return response.data

  } catch (error) {
    console.log("TF");
    
    console.log(error)
  }

}
 
export default GetActivePromo;