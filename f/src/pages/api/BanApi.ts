import API from "@/env";
import axios from "axios";

const BanApi = async (id:number) => {

  try {
    
    const response = await axios.get(`${API}/ban/${id}`)
    return response.data 

  } catch (error) {
    console.log(error);
  }

}
 
export default BanApi;