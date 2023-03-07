import API from "@/env"
import axios from "axios"

const getUserFromToken = async (token:object) => {
  try {
    const response = await axios.post(API+"/validate", token)
    return response.data.message

  } catch (error) {
    return -1
  }
}
 
export default getUserFromToken;