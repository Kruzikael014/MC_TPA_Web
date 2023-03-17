import API from "@/env";
import axios from "axios";

const GetAnnouncement = async (id: number) =>
{

  try
  {

    const response = await axios.get(`${API}/get-announcement/${id}`)
    console.log("Api call");
    
    console.log(response.data);
    console.log(response);
    
    
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default GetAnnouncement;