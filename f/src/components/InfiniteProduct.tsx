import Product from "@/types/Product"
import { useEffect, useState } from "react"
import styles from "@/styles/HomePage.module.css"
import MediumProductCard from "./MediumProductCard"
import InfiniteFetching from "@/pages/api/Product-APIs/InfiniteFetching"



const InfiniteProduct = () =>
{
  const [items, setItems] = useState<Product[]>([])
  const [offset, setOffset] = useState(0)

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      await InfiniteFetching(offset)
        .then((newItems: Product[]) => setItems(prevItems => [...prevItems, ...newItems]))
    }
    fetchData()
  }, [offset])

  const handleScroll = () =>
  {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    if (scrollTop + clientHeight >= scrollHeight)
    {
      setOffset(prevOffset => prevOffset + 1)
    }
  }

  useEffect(() =>
  {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className={styles.infiniteprod}>
        {items.length !== 0 &&
          items.map((e: Product, i: number) =>
          {
            return (
              <MediumProductCard index={i} product={e} key={i} />
            )
          })}
      </div>
    </>
  );
}

export default InfiniteProduct;