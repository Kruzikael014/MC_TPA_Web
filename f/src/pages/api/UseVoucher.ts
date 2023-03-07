import API from "@/env";
import UseVoucherRequest from "@/types/UseVoucherRequest";
import axios from "axios";


const UseVoucher = async (request: UseVoucherRequest) =>
{

 try
 {

  const response = await axios.post(`${API}/use-voucher`, request)
  return response.data

 } catch (error)
 {
  console.log(error);
 }

}

export default UseVoucher;