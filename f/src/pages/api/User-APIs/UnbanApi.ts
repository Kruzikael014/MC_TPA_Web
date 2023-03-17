import API from "@/env";
import axios from "axios";

const UnbanApi = async (id:number) => {

  try {
    
    const response = await axios.get(`${API}/unban/${id}`)
    return response.data 

  } catch (error) {
    console.log(error);
    
  }

}
 
export default UnbanApi;