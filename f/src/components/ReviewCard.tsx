import GetUserFromId from "@/pages/api/User-APIs/GetUserFromId";
import Review from "@/types/Review";
import User from "@/types/User";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import s from "@/styles/HomePage.module.css"
import InputField from "./InputField";
import SaveReview from "@/pages/api/Review-APIs/SaveReview";
import ButtonInput from "./ButtonInput";


interface ReviewCardInterface
{
  review: Review
}

const ReviewCard = (props: ReviewCardInterface) =>
{

  const { review } = props
  const [uploader, setUploader] = useState<User | undefined>(undefined)
  const [shop, setShop] = useState<User | undefined>(undefined)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() =>
  {

    const getUploader = async () =>
    {

      if (review !== undefined)
      {
        const response = await GetUserFromId(Number(review?.reviewer_id))
        setUploader((prev) => ({
          ...prev,
          balance: response.balance,
          Email: response.email,
          Email_subscriber: response.email_subscriber,
          First_name: response.first_name,
          Last_name: response.last_name,
          Password: response.password,
          Phone_num: response.phone_num,
          Role_name: response.role_name,
          Status: response.status,
          id: response.id
        }))
      }

    }
    getUploader()

  }, [])

  useEffect(() =>
  {

    const getShop = async () =>
    {

      if (review !== undefined)
      {
        const response = await GetUserFromId(Number(review?.shop_id))
        setShop((prev) => ({
          ...prev,
          balance: response.balance,
          Email: response.email,
          Email_subscriber: response.email_subscriber,
          First_name: response.first_name,
          Last_name: response.last_name,
          Password: response.password,
          Phone_num: response.phone_num,
          Role_name: response.role_name,
          Status: response.status,
          id: response.id
        }))
      }

    }
    getShop()

  }, [])

  const getAvgRev = () =>
  {
    if (review !== undefined)
    {
      let res = 0
      if (review.delivered_ontime) res += 1
      if (review.item_accurate) res += 1
      if (review.satisfying_service) res += 1
      return res / 3
    }
    else
      return 0
  }

  const handleEdit = async () =>
  {
    setShowReviewForm(true)
    console.log("Updating review with id", review.review_id);
    
  }
  
  const handleRemove = async () =>
  {
    console.log("deleting review with id", review.review_id);

  }

  return (
    <>
    {
      showReviewForm ?
      <ViewReviewShopForm oldReview={review} setStateFunction={setShowReviewForm} />
      :
       <div className={s.reviewcard}>
        <div style={{ display: "flex", flexDirection: "column", rowGap: "2rem", marginRight: "1rem" }}>
          <div onClick={handleEdit}>
            <i className="fa-solid fa-pen-to-square fa-2x"></i>
          </div>
          <div onClick={handleRemove}>
            <i className="fa-solid fa-trash fa-2x"></i>
          </div>
        </div>
        <div className={s.namediv}>
          <div>
            Name
          </div>
          <h4>
            {uploader?.First_name + " " + uploader?.Last_name}
          </h4>
          <div>
            Date Uploaded
          </div>
          <h4>
            {review.created_at?.toString()}
          </h4>
        </div>
        <div className={s.messagediv}>
          <div className={s.star}>
            <span>
              Rate
            </span>
            <span className={s.starts}>
              {Array.from({ length: (review?.rating_value) ? review?.rating_value : 0 }, (_, index) => (
                <span key={index}>⭐</span>
              ))}
            </span>
          </div>
          <div>
            message :
          </div>
          <div>
            {review.message}
          </div>
          <div className={s.statistic}>
            <div>
              Average : {getAvgRev()}
            </div>
          </div>
        </div>
        <div className={s.questiondiv}>
          <div className={s.question}>
            <b>
              This shop Deliver item on time?&nbsp;&nbsp;
            </b>
            <p>
              {(review.delivered_ontime) ? "Yes" : " No"}
            </p>
          </div>
          <div className={s.question}>
            <b>
              This shop sent accurate product?&nbsp;&nbsp;
            </b>
            <p>
              {(review.item_accurate) ? "Yes" : " No"}
            </p>
          </div>
          <div className={s.question}>
            <b>
              This shop give satisfying service?&nbsp;&nbsp;
            </b>
            <p>
              {(review.satisfying_service) ? "Yes" : " No"}
            </p>
          </div>
        </div>
      </div>
    }

    </>
  )

}

export default ReviewCard;


interface ViewReviewSHopForm
{
  setStateFunction: Dispatch<SetStateAction<boolean>>,
  oldReview: Review
}

const ViewReviewShopForm = (props: ViewReviewSHopForm) =>
{

  const { setStateFunction, oldReview } = props

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
      reviewer_id: oldReview?.review_id,
      shop_id: oldReview?.reviewer_id
    }
    console.log("with data ", newReview);
    // const response = await SaveReview(newReview)
    // alert(response)
    setStateFunction(false)
    // window.location.reload()
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
        <input type="radio" id="itemAsDescribedYes" name="itemAsDescribed" value="yes" onChange={() => setItemAsDescribed(true)}
        />
        <label htmlFor="itemAsDescribedYes">Yes</label>
        <input type="radio" id="itemAsDescribedNo" name="itemAsDescribed" value="no" onChange={() => setItemAsDescribed(false)}
        />
        <label htmlFor="itemAsDescribedNo">No</label>
      </div>

      <label htmlFor="satisfactoryService">
        Satisfactory customer service?
      </label>
      <div className={s.radioButtons}>
        <input
          type="radio" id="satisfactoryServiceYes" name="satisfactoryService" value="yes" onChange={() => setSatisfactoryService(true)}
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