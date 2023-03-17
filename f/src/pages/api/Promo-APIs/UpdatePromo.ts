import API from "@/env";
import axios from "axios";

const UpdatePromo = async (id:number | undefined) => {

try {
  const response = await axios.post(`${API}/update-poster/${id}`)
  return response.data
} catch (error) {
  console.log(error)
}

}
 
export default UpdatePromo;