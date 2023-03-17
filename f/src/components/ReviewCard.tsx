import GetUserFromId from "@/pages/api/User-APIs/GetUserFromId";
import Review from "@/types/Review";
import User from "@/types/User";
import { useEffect, useState } from "react";
import s from "@/styles/HomePage.module.css"


interface ReviewCardInterface
{
  review: Review
}

const ReviewCard = (props: ReviewCardInterface) =>
{

  const { review } = props
  const [uploader, setUploader] = useState<User | undefined>(undefined)
  const [shop, setShop] = useState<User | undefined>(undefined)

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

  const getAvgRev = () => {
    if (review !== undefined) {
      let res = 0
      if (review.delivered_ontime) res += 1
      if (review.item_accurate) res += 1
      if (review.satisfying_service) res += 1
      return res/3
    }
    else 
    return 0
  }
  return (
    <>
      <div className={s.reviewcard}>
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
    </>
  )

}

export default ReviewCard;