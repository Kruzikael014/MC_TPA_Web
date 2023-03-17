import API from "@/env";
import CheckoutRequest from "@/types/CheckoutRequest";
import axios from "axios";

const CartCheckout = async (request: CheckoutRequest) =>
{

 try
 {
  const response = await axios.post(`${API}/checkout-cart-content`, request)
  return response.data
 } catch (error)
 {
  console.log(error);
 }

}

export default CartCheckout;