import API from "@/env";
import Shop from "@/types/Shop";
import axios from "axios";

interface Shops {
  shops: Array<Shop>
}

const ListShop = async () => {

  try {

    const response = await axios.get(`${API}/shop_owner`)
    return response.data

  } catch (error) {
    console.log(error)
  }

}
 
export default ListShop;