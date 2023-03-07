import GetActivePromo from "@/pages/api/GetActivePromo";
import styles from "@/styles/HomePage.module.css"
import PromotionBanner from "@/types/PromotionBanenr";
import { getUrl } from "@/util/ImageController";
import Image from "next/image";
import { useEffect, useState } from "react";
import SideBar from "./Sidebar";


const Carousel = () =>
{

  let loading = true

  const [images, SetImages] = useState<PromotionBanner[]>([])

  useEffect(() =>
  {

    const fetchImages = async () =>
    {
      try
      {
        const response = await GetActivePromo()
        const updatedPromos = []
        for (const promo of response)
        {
          const url = await getUrl(promo.promo_banner)
          const updatedPromo = { ...promo, promo_banner: url }
          updatedPromos.push(updatedPromo)
        }
        SetImages(updatedPromos)
      } catch (error)
      {
        console.error(error)
      }
    }
    fetchImages()
  }, [])

  if (images.length > 0)
  {
    loading = false
  }

  if (!loading)
  {
    return (
      <>
        <SideBar />
        {
          <CarouselImage banners={images} />
        }
      </>
    )
  }
  else
  {
    return (
      <>
        <div>
          Load the carousel
        </div>
      </>
    )
  }
}

interface ImageURL
{
  banners: Array<PromotionBanner>
}

const CarouselImage = ({ banners }: ImageURL) =>
{
  const [index, setIndex] = useState(0)
  const [sliding, setSliding] = useState(false)
  const next = () =>
  {
    setSliding(true)
    setTimeout(() =>
    {
      setIndex((index + 1) % banners.length)
      setSliding(false)
    }, 200)
  }

  const previous = () =>
  {
    setSliding(true)
    setTimeout(() =>
    {
      if (index === 0)
      {
        setIndex(banners.length - 1)
      } else
      {
        setIndex(index - 1)
      }
      setSliding(false)
    }, 200)
  }

  useEffect(() =>
  {
    const timer = setTimeout(() =>
    {
      next()
    }, 4500)

    return () => clearTimeout(timer)

  }, [index])

  return (
    <>
      <div className={styles.buttonscaro} >
        <div onClick={(e) => { previous() }}>
          <button className={`${styles.button} ${styles.left}`}>
            &lt;
          </button>
        </div>
        <div onClick={(e) => { next() }}>
          <button className={`${styles.button} ${styles.right}`}>
            &gt;
          </button>
        </div>
      </div>
      <div className={styles.carousel}>
        <Image
          width={1807}
          height={704}
          src={(banners[index].promo_banner) ? banners[index].promo_banner : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"}
          alt="not found"
          className={`${styles.carouselImage} ${(sliding) ? styles.sliding : ''}`} />
      </div>
    </>
  )

}

export default Carousel;