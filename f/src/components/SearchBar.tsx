import GetSingleProduct from '@/pages/api/Product-APIs/GetSingleProduct';
import searchProduct from '@/pages/api/Promo-APIs/SearchProduct';
import s from '@/styles/HomePage.module.css'
import Product from '@/types/Product';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import LiveImage from './LiveImage';

const SearchBar = () =>
{

  const [input, setInput] = useState("")
  const [product, setProduct] = useState<Product | undefined>(undefined)
  const router = useRouter()

  useEffect(() =>
  {

    const fetchAndSetProduct = async () =>
    {
      const response = await searchProduct(input)
      setProduct(response)
    }
    fetchAndSetProduct()

  }, [input])

  const redirectSearchPage = () =>
  {
    router.push({
      pathname: "/search-page",
      query: {
        search: input
      }
    })
  }


  return (
    <div className={s.searc}>
      <div className={s.searchcontainer}>
        <input type={"text"} className={s.search} onChange={(e) => { setInput(e.target.value) }} />
        <div className={s.searchbutt} onClick={redirectSearchPage}>
          <i className="fa-solid fa-magnifying-glass fa-xl"></i>
        </div>
      </div>
      {
        input !== "" &&
        <div className={s.outputsearch}>
          {
            product &&
            <div className={s.mainresult}>
              <h4>
                Result
              </h4>
              <p>
                <div>{product?.id}</div>
              </p>
              <div className={s.result}>
                <div>
                  {/* Product here  */}

                  <div>{product.product_name}</div>
                  <div>{product.product_category}</div>
                  <div>{product.product_description}</div>
                  <div>{product.product_details}</div>
                  <div>{product.product_stock}</div>
                  <div>{product.uploaded_by}</div>
                  <LiveImage imageUrl={product.product_image} />

                  {/* Product here  */}
                </div>
              </div>
            </div>
          }

          <div className={s.otherresult}>
            <div className={s.matchkey}>
              <h4><i>Matching Keywords</i></h4>
            </div>
            <div className={s.matchbrand}>
              <h4><i>Matching Brands</i></h4>
            </div>
            <div className={s.matchrec}>
              <h4><i>Recomendations</i></h4>
            </div>
          </div>

        </div>
      }
    </div>
  );
}

export default SearchBar;