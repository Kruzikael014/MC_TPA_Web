import API from "@/env";
import axios from "axios";

const ListCustomer = async () =>
{

  try
  {

    const response = await axios.get(`${API}/user`)
    return response.data

  } catch (error)
  {
    console.log(error)
  }

}

export default ListCustomer;