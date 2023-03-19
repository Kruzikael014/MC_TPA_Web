import s from "@/styles/HomePage.module.css"
import UserOrder from "@/types/UserOrder";
import LiveImage from "./LiveImage";

interface UserOrderCardInterface
{
  userOrder: UserOrder
}

const UserOrderCard = (props: UserOrderCardInterface) =>
{

  const { userOrder } = props
  const { product_id, cart_id, delivery_status, product_image, product_name, product_price, quantity, uploaded_by, transaction_id } = userOrder

  return (
    <>
      <div className={s.cartcard}>
        <div className={s.imagecontainer}>
          <LiveImage width={200} imageUrl={product_image} />
        </div>
        <div className={s.middlesection}>
          <h1>
            {product_name} ({quantity} pcs)
          </h1>
          <h3>
            Status : {delivery_status}
          </h3>
        </div>
        <div className={s.rightsection}>

          <div className={s.pricesection}>
            <p>
              {`Rp. ${product_price?.toLocaleString()}, -`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserOrderCard;