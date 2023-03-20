import API from "@/env";
import axios from "axios";

const SearchManyProduct = async (page: number, query: string, filter: string) =>
{

  try
  {

    const response = await axios.get(`${API}/search-products?page=${page}&q=${query}&filter=${filter}`)
    return response.data

  } catch (error)
  {
    console.log(error);
  }

}

export default SearchManyProduct;