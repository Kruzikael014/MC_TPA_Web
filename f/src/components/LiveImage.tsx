import { getUrl } from "@/util/ImageController";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LiveImage
{
  imageUrl: string | undefined
  width?: number | undefined
  height?: number | undefined
}

const LiveImage = (props: LiveImage) =>
{

  let { imageUrl, width, height } = props

  const [url, setUrl] = useState("")

  useEffect(() =>
  {

    const getImageUrl = async () =>
    {
      await getUrl(imageUrl)
        .then((resolve) =>
        {
          setUrl(resolve)
        })
        .catch((reject) =>
        {
          console.log(reject);
        })
    }
    getImageUrl()

  }, [imageUrl])


  return (
    <>
      <div>
        <Image width={(width !== undefined) ? width : 90} height={ (height !== undefined)  ?  height : (width !== undefined) ? width : 90}
          src={
            (url.includes("firebasestorage")) ?
              url
              :
              "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"
          }
          alt="https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"
        />
      </div>
    </>
  );
}

export default LiveImage;