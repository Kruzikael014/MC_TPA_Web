import API from "@/env";
import AddCartRequest from "@/types/AddCartRequest";
import axios from "axios";

const AddCart = async (newItem: AddCartRequest) =>
{

  try
  {

    console.log(newItem.quantity);
    alert(newItem.quantity)
    

    const response = await axios.post(`${API}/add-to-cart`, newItem)
    return response.data

  } catch (error)
  {

    console.log(error);

  }

}

export default AddCart;