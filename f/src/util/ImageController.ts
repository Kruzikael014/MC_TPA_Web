
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import storage from "./Firebase"


export default async function uploadImage(imagefile: File | undefined, Filename:string | undefined)
{
  if (imagefile !== undefined)
  {
    const storageRef = ref(storage, `products/${Filename}`)
    await uploadBytes(storageRef, imagefile)
    return
  }
  alert("image is blank")
}

export async function getUrl(fileName: string | undefined): Promise<string>
{
  let url = ""
  if (fileName !== undefined)
  {

    const storageRef = ref(storage, `products/${fileName}`)
    await getDownloadURL(storageRef).then((resolve) => {
      url = resolve
    }).catch((error) => {
      console.log(error);
      
    })
  } else {
    return ""
  }
  return url
}

export async function deleteImage(imagePath: string | undefined)
{
  const storageRef = ref(storage, imagePath)
  await deleteObject(storageRef).then((resolve) =>
  {
    console.log(resolve)
    console.log("Image deleted successfully")
  }).catch((reject) =>
  {
    console.log(reject)
    console.log("Failed to delete the image!")
  })
}
