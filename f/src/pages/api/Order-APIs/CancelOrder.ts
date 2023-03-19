import API from "@/env";
import HandledOrderRequest from "@/types/HandledOrderRequest";
import axios from "axios";

const CancelOrder = async (request: HandledOrderRequest) =>
{

  try
  {

    const response = await axios.post(`${API}/cancel-order`, request)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default CancelOrder;