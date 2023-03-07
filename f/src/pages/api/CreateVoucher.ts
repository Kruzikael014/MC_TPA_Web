import API from "@/env";
import CreateVoucherRequest from "@/types/CreateVoucherRequest";
import axios from "axios";

const CreateVoucher = async (request: CreateVoucherRequest) =>
{

 try
 {

  const response = await axios.post(`${API}/create-voucher`, request)
  return response.data

 } catch (error)
 {
  console.log(error);
 }

}

export default CreateVoucher;