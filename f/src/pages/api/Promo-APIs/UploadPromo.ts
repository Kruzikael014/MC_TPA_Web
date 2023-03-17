import API from "@/env";
import PromotionBanner from "@/types/PromotionBanenr";
import axios from "axios";

const UploadPromo = async (promo:PromotionBanner) => {

  try {
    
    const response = await axios.post(`${API}/upload-promo`, promo )
    return response.data

  } catch (error) {
    console.log(error)
  }

}
 
export default UploadPromo;