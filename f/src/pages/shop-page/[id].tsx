import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import API from "@/env";
import ShopDetail from "@/types/ShopDetail";
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import getUserFromToken from "../api/User-APIs/getuser";
import s from "@/styles/HomePage.module.css"
import LiveImage from "@/components/LiveImage";
import ProductCategory from "@/types/ProductCategory";
import GetProductCategoryRequest from "@/types/GetProductCategoryRequest";
import GetProductCategory from "../api/Product-APIs/GetProductCategory";
import { useRouter } from "next/router";
import ViewShopProduct from "../Layouts/ViewShopProduct";
import GetUserFromId from "../api/User-APIs/GetUserFromId";
import ButtonInput from "@/components/ButtonInput";
import InputField from "@/components/InputField";
import Review from "@/types/Review";
import SaveReview from "../api/Review-APIs/SaveReview";
import GetReviews from "../api/Review-APIs/GetReviews";

interface ShopDetailInterface
{
  shopDetail: ShopDetail
}

const ShopPagePage = (props: ShopDetailInterface) =>
{

  const { shopDetail } = props
  const [user, setUser] = useState<User | undefined>(undefined)
  const [realUser, setRealUser] = useState<User | undefined>(undefined)
  const [clickedFeature, setClickedFeature] = useState(1)
  const router = useRouter()
  const query = router.query
  const { id } = query

  useEffect(() =>
  {
    const fetchUser = async () =>
    {
      const ob = {
        JWToken: getCookie("JWToken")
      }
      const user = await getUserFromToken(ob)
      setRealUser(user)
    }
    fetchUser()

  }, [])

  useEffect(() =>
  {
    const getCurrUser = async () =>
    {
      const response = await GetUserFromId(Number(id))
      setUser(
        {
          First_name: response.first_name,
          Last_name: response.last_name,
          Email: response.email,
          Password: response.password,
          Phone_num: response.phone_num,
          Email_subscriber: response.email_subscriber,
          Role_name: response.role_name,
          Status: response.status,
          id: response.id,
          balance: response.balance
        })
    }
    getCurrUser();
  }, [])

  const handleClickedFeature = (num: number) =>
  {
    setClickedFeature(num)
  }

  const Case1 = () =>
  {

    const [categories, setCategories] = useState<ProductCategory[] | undefined>(undefined)
    const router = useRouter()

    useEffect(() =>
    {

      if (query.id)
      {
        const fetchCategories = async () =>
        {
          const productCategoryRequest: GetProductCategoryRequest = {
            uploaded_by: Number(query.id)
          }
          const response = await GetProductCategory(productCategoryRequest)
          setCategories(response)
        }
        fetchCategories()
      }

    }, [])

    const handleProductDetail = (id: number | undefined) =>
    {
      router.push(`/Product/${id}`)
    }

    return (
      <>
        <center>
          <LiveImage imageUrl={shopDetail.shop_banner} height={250} width={1500} />
        </center>
        <div className={s.categ}>
          <h1 className={s.categtitle}>
            Shop by category
          </h1>
          <div className={s.horicateg}>
            {
              categories && Array.isArray(categories) &&
              categories.map((category, index: number) =>
              {
                return <>
                  <div key={index} className={s.categorycontainer} onClick={(e) => { handleProductDetail(category.id) }}>
                    <LiveImage imageUrl={category.product_image} height={300} width={300} />
                    <h3>
                      {category.product_category}
                    </h3>
                  </div>
                </>
              })
            }
          </div>
        </div>
      </>
    )
  }

  interface ViewReviewSHopForm
  {
    setStateFunction: Dispatch<SetStateAction<boolean>>
  }

  const ViewReviewShopForm = (props: ViewReviewSHopForm) =>
  {

    const { setStateFunction } = props

    const [rate, setRate] = useState(0)
    const [deliveredOnTime, setDeliveredOnTime] = useState<boolean | null>(null);
    const [itemAsDescribed, setItemAsDescribed] = useState<boolean | null>(null);
    const [satisfactoryService, setSatisfactoryService] = useState<boolean | null>(null);
    const [comment, setComment] = useState("")

    const handleSubmit = async (e: any) =>
    {
      e.preventDefault();
      if (deliveredOnTime === null || itemAsDescribed === null || satisfactoryService === null || comment === "")
      {
        alert("Fill all the form!")
        return
      }

      const newReview: Review = {
        created_at: new Date(),
        message: comment,
        delivered_ontime: deliveredOnTime,
        item_accurate: itemAsDescribed,
        rating_value: rate,
        satisfying_service: satisfactoryService,
        reviewer_id: realUser?.id,
        shop_id: user?.id
      }

      const response = await SaveReview(newReview)
      alert(response)

      setStateFunction(false)
    };

    const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
      setRate(Number(e.target.value));
    };

    return (
      <form onSubmit={handleSubmit} className={s.myFormReview}>
        <InputField onChange={setComment} value={comment} text placeholder="Review Message" width={250} height={30} />
        <label>Rating</label>
        <div className={s.ratingButtons}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="rating"
                value={value}
                onChange={handleRatingChange}
              />
              {value}
            </label>
          ))}
        </div>
        <label htmlFor="deliveredOnTime">
          Item(s) delivered on time?
        </label>
        <div className={s.radioButtons}>
          <input
            type="radio"
            id="deliveredOnTimeYes"
            name="deliveredOnTime"
            value="yes"
            onChange={() => setDeliveredOnTime(true)}
          />
          <label htmlFor="deliveredOnTimeYes">Yes</label>
          <input
            type="radio"
            id="deliveredOnTimeNo"
            name="deliveredOnTime"
            value="no"
            onChange={() => setDeliveredOnTime(false)}
          />
          <label htmlFor="deliveredOnTimeNo">No</label>
        </div>

        <label htmlFor="itemAsDescribed">
          Item(s) as seller described?
        </label>
        <div className={s.radioButtons}>
          <input
            type="radio"
            id="itemAsDescribedYes"
            name="itemAsDescribed"
            value="yes"
            onChange={() => setItemAsDescribed(true)}
          />
          <label htmlFor="itemAsDescribedYes">Yes</label>
          <input
            type="radio"
            id="itemAsDescribedNo"
            name="itemAsDescribed"
            value="no"
            onChange={() => setItemAsDescribed(false)}
          />
          <label htmlFor="itemAsDescribedNo">No</label>
        </div>

        <label htmlFor="satisfactoryService">
          Satisfactory customer service?
        </label>
        <div className={s.radioButtons}>
          <input
            type="radio"
            id="satisfactoryServiceYes"
            name="satisfactoryService"
            value="yes"
            onChange={() => setSatisfactoryService(true)}
          />
          <label htmlFor="satisfactoryServiceYes">Yes</label>
          <input
            type="radio"
            id="satisfactoryServiceNo"
            name="satisfactoryService"
            value="no"
            onChange={() => setSatisfactoryService(false)}
          />
          <label htmlFor="satisfactoryServiceNo">No</label>
        </div>
        <ButtonInput placeholder="Save Review" submit blue centered height={30} width={200} />
      </form>
    );

  }

  const ViewReviewShop = () =>
  {

    const [showForm, setShowForm] = useState(false)
    const [reviews, setReviews] = useState<Review[] | undefined>(undefined)

    useEffect(() =>
    {

      const fetchReviews = async () =>
      {

        const response = await GetReviews(Number(user?.id))
        setReviews(response)

      }
      fetchReviews()

    }, [])


    return (
      <>
        <div className={s.reviewshoppage}>
          <div className={s.up}>
            <div className={s.left}>
              <h3>
                Total Rating
              </h3>
              <h4>
                5000
              </h4>
            </div>
            <div className={s.center}>
              <h3>
                Each rating
              </h3>
              <h5>5 - 300</h5>
              <h5>4 - 300</h5>
              <h5>3 - 300</h5>
              <h5>2 - 300</h5>
              <h5>1 - 300</h5>
            </div>
            <div className={s.right}>
              <div className={s.ratingpercent}>
                <h3>On time</h3>
                <h4>
                  88%
                </h4>
              </div>
              <div className={s.ratingpercent}>
                <h3>Product Accuracy</h3>
                <h4>
                  90%
                </h4>
              </div>
              <div className={s.ratingpercent}>
                <h3>Service Satisfaction</h3>
                <h4>
                  75%
                </h4>
              </div>
            </div>
          </div>
          <div className={s.down}>
            {
              showForm ?
                <>
                  <ViewReviewShopForm setStateFunction={setShowForm} />
                </>
                :
                <>
                  <center className={s.revitt}>
                    <h1>
                      Reviews
                    </h1>
                    {
                      user?.id !== realUser?.id ?
                        <i className="fa-sharp fa-solid fa-plus fa-2x" onClick={(e) => { setShowForm(true) }}></i>
                        :
                        ""
                    }
                  </center>
                  <div className={s.reviewcontents}>
                    {
                      reviews?.map((review, index) =>
                      {
                        return (
                          <>
                            <div key={index}>
                              {review.message}
                            </div>
                          </>
                        )
                      })
                    }
                  </div>
                </>
            }
          </div>
        </div>
      </>
    )
  }

  const showSubcontent = () =>
  {
    switch (clickedFeature)
    {
      case 1:

        if (user?.Status !== "Clear")
        {
          return <>
            <center>
              <h1>
                Shop has been banned
              </h1>
            </center>
          </>
        }
        else
        {
          return <>
            <Case1 />
          </>
        }

      case 2:
        return <>
          <div className={s.ViewShopProductShoPage}>
            <ViewShopProduct notauthorized id={shopDetail?.id} />
          </div>
        </>
      case 3:
        return <>
          <ViewReviewShop />
        </>
      case 4:
        return <>

        </>
      case 5:
        return <>
          <div className={s.shoapboutut}>
            <h1>
              About us
            </h1>
            <div>
              <p style={{ textAlign: "justify", marginTop: "4rem" }}>
                {shopDetail.shop_description}
              </p>
            </div>
          </div>
        </>
    }

  }


  return (
    <>
      <div className={s.shopdetailpage}>
        <Navbar />
        <HeaderModule />
        <ThemeToggle />
        <div className={s.profileheader}>
          <div className={s.circler}>
            <i className="fa-solid fa-user fa-4x"></i>
          </div>
          <div className={s.profiledata}>
            <div className={s.title}>
              <h1>
                {user?.First_name} {user?.Last_name} Store
              </h1>
            </div>
            <div className={s.salesrate}>
              {shopDetail.number_of_sales} total sales | 80 followers | {shopDetail.average_rating} (80% positive in the last 12 months)
            </div>
          </div>
        </div>
        <hr />
        <div className={s.rotate}>
          <div className={s.path}>
            Home - {(typeof sessionStorage !== 'undefined') ? sessionStorage.getItem("country") : "Unknown place"} &gt; {user?.First_name + " " + user?.Last_name}
          </div>
          <div className={s.storepagebutton}>
            <div className={(clickedFeature === 1) ? `${s.und} ${s.txt}` : `${s.txt}`} onClick={(e) => { handleClickedFeature(1) }}>
              Store home
            </div>
            <div className={(clickedFeature === 2) ? `${s.und} ${s.txt}` : `${s.txt}`} onClick={(e) => { handleClickedFeature(2) }}>
              All products
            </div>
            <div className={(clickedFeature === 3) ? `${s.und} ${s.txt}` : `${s.txt}`} onClick={(e) => { handleClickedFeature(3) }}>
              Reviews
            </div>
            <div className={(clickedFeature === 4) ? `${s.und} ${s.txt}` : `${s.txt}`} onClick={(e) => { handleClickedFeature(4) }}>
              Return Policy
            </div>
            <div className={(clickedFeature === 5) ? `${s.und} ${s.txt}` : `${s.txt}`} onClick={(e) => { handleClickedFeature(5) }}>
              About us
            </div>
          </div>
        </div>
        <hr className={s.gap} />

        {showSubcontent()}


        <div className={s.footercontainer}>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default ShopPagePage;


export async function getStaticPaths()
{

  const response = await fetch(`${API}/shop-detail/all`)
  const shops = await response.json()

  const paths = shops.map((shop: ShopDetail) => ({
    params: {
      id: String(shop.id),
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

  const response = await fetch(`${API}/shop-detail/${id}`)
  const shopDetail: ShopDetail = await response.json()

  return {
    props: {
      shopDetail,
    }
  }

}
