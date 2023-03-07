import API from "@/env"
import Shop from "@/types/Shop"
import axios from "axios"


const CreateShop = async (newShop:Shop) => {


  try {
    
    const response = await axios.post(API + "/signup", newShop)
    return response.data

  } catch (error) {
    console.log(error)
    return -1
  }


}

export default CreateShop