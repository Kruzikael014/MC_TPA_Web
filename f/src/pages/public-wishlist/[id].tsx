import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import API from "@/env";
import PublicWishlist from "@/types/PublicWishlist";
import s from '@/styles/HomePage.module.css'
import PublicWishlistCard from "@/components/PublicWishlistCard";
import Product from "@/types/Product";
import LiveImage from "@/components/LiveImage";
import CartCard from "@/components/CartCard";
import ProductCard from "@/components/ProductCard";
import ProductWishlistCard from "@/components/ProductWishlistCard";
import GetWishlistHeadDetail from "../api/Wishlist-APIs/GetWishlistHeadDetail";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import ButtonInput from "@/components/ButtonInput";
import getUserFromToken from "../api/User-APIs/getuser";
import getCookie from "@/util/GetCookie";
import User from "@/types/User";
import commentWishlist from "../api/Wishlist-APIs/CommentWishlist";


interface PublicWishlistDetailInterface
{
  publicWishlist: PublicWishlist;
}

const PublicWishlistDetail = (props: PublicWishlistDetailInterface) =>
{
  const { publicWishlist } = props;
  const [productCards, setProductCards] = useState([]);
  const [comment, setComment] = useState("")
  const [commentAs, setCommentAS] = useState("Comment as yourself")
  const [user, setUser] = useState<User | undefined>(undefined)

  const getWishlistDetail = async () =>
  {
    const response = await GetWishlistHeadDetail(Number(publicWishlist.id));
    console.log(response);
    return response.wishlist_details;
  };

  useEffect(() =>
  {
    const getCurrUser = async () =>
    {
      const ob = {
        JWToken: getCookie("JWToken")
      }
      const response = await getUserFromToken(ob)
      setUser(prevUser => ({
        ...prevUser,
        id: response.id,
        First_name: response.first_name,
        Last_name: response.last_name,
        Email: response.email,
        Password: response.password,
        Phone_num: response.phone_num,
        Email_subscriber: response.email_subscriber,
        Status: response.status,
        Role_name: response.role_name,
        balance: response.balance
      }))
    }
    getCurrUser()
  }, [])

  useEffect(() =>
  {
    getWishlistDetail().then((wishlistDetails) =>
    {
      const cards = publicWishlist.product_list.map(
        async (product: Product, index: number) =>
        {
          const wishlistDetail = wishlistDetails[index];
          return (
            <div key={product.id}>
              <ProductCard isAuthorized={false}
                product={product}
                wishlistDetail={wishlistDetail}
              />
            </div>
          );
        }
      );
      Promise.all(cards).then((resolvedCards: any) =>
      {
        setProductCards(resolvedCards);
      });
    });
  }, []);

  const handleCommentClick = async () =>
  {
    if (comment === "")
    {
      alert("Comment must not be empty")
      return
    }
    if (user !== undefined)
    {
      const request = {
        wishlist_id: Number(publicWishlist.id),
        comment: comment,
        uploaded_by: Number(user.id),
        comment_as: commentAs
      }
      const response = await commentWishlist(request)
      alert(response)
      if (response === "Comment successfully posted!")
      {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        setComment("")
      }
    }
  }

  return (
    <div className={s.publicwishlistdetail}>
      <Navbar />
      <ThemeToggle />
      <HeaderModule />
      <div className={s.content}>
        <div className={s.header}>
          <h1>{publicWishlist.wishlist_name} Wishlist</h1>
        </div>
        <div className={s.wishcardcontent}>
          {productCards}
        </div>
        <div className={s.commentcontent}>
          <div className={s.commentehader}>
            <h1>
              Comment
            </h1>
            <select defaultValue={"Comment Anonymously"} onChange={(e) => { setCommentAS(e.target.value) }}>
              <option value="Comment as yourself">Comment as yourself</option>
              <option value="Comment Anonymously">Comment Anonymously</option>
            </select>
            <InputField text onChange={setComment} value={comment} height={80} width={800} placeholder={"Comment here..."} />
            <ButtonInput orange placeholder="Comment" centered width={150} func={handleCommentClick} />
          </div>
          <div className={s.comments}>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicWishlistDetail;


export async function getStaticPaths()
{

  const response = await fetch(`${API}/get-all-public-wishlist`)
  const wishlists = await response.json()

  const paths = wishlists.map((wishlist: PublicWishlist) => ({
    params: {
      id: String(wishlist.id),
    }
  }))

  return {
    paths,
    fallback: false,
  }
}

interface GetStaticProps
{
  params: {
    id: string;
  }
}

export async function getStaticProps(context: GetStaticProps)
{

  const { id } = context.params

  const response = await fetch(`${API}/get-single-public-wishlist/${id}`)
  const wishlist: PublicWishlist = await response.json()

  return {
    props: {
      publicWishlist: wishlist,
    }
  }

}