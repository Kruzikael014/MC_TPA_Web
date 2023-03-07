import API from "@/env";
import PayRequest from "@/types/PayRequest";
import axios from "axios";

const PayCheckout = async (request:PayRequest) =>
{

 try
 {
  const response = await axios.post(`${API}/decrease-balance`, request)
  return response.data
 } catch (error)
 {
  console.log(error);
 }

}

export default PayCheckout;