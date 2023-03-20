import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import LargeProductCard from "@/components/LargeProductCard";
import LiveImage from "@/components/LiveImage";
import MediumProductCard from "@/components/MediumProductCard";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import s from "@/styles/HomePage.module.css"
import Product from "@/types/Product";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SearchManyProduct from "../api/Product-APIs/SearchProductss";

const SearchPage = () =>
{

  const router = useRouter()
  const query = router.query
  const [products, setProducts] = useState<Product[] | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("All")

  useEffect(() =>
  {
    const fetchProducts = async () =>
    {
      if (query !== undefined && query.search !== undefined)
      {
        console.log(query.search);
        const response = await SearchManyProduct(Number(page), String(query.search), String(filter))
        setProducts(response)

      }

    }
    fetchProducts()

  }, [query, page, filter])

  const increasePage = () =>
  {
    setPage(page + 1)
  }

  const decreasePage = () =>
  {

    if (page !== 1)
    {
      setPage(page - 1)
    }

  }


  return (
    <div className={s.searchpage}>
      <Navbar />
      <HeaderModule />
      <ThemeToggle />
      <div className={s.content}>
        <div className={s.utils}>
          <h1 className={s.tit}>
            Result
          </h1>
          <div className={s.rightsect}>
            <div className={s.filter}>
              <i className="fa-solid fa-filter"></i>
              <select defaultValue={"All"} onChange={(e) => { setFilter(e.target.value) }}>
                <option value="All">All</option>
                <option value="Price">Price</option>
                <option value="Rating">Rating</option>
                <option value="Review">Review</option>
                <option value="Number Bought">Number Bought</option>
              </select>
            </div>
            <div className={s.paginator}>
              <div>
                <i className="fa-solid fa-backward" onClick={decreasePage}></i>
              </div>
              {page}
              <div>
                <i className="fa-solid fa-forward" onClick={increasePage}></i>
              </div>
            </div>
          </div>
        </div>
        <div className={s.grid}>
          {
            Array.isArray(products) && products.length > 0 &&
            products.map((product: Product, index) =>
            {
              return (
                // <div>
                //   <LiveImage imageUrl={product.product_image} />
                //   {product.product_name}
                // </div>
                <MediumProductCard key={index} product={product} index={index} />
              )
            })
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;