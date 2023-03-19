import LiveImage from "./LiveImage";
import s from "@/styles/HomePage.module.css"
import ShopOrder from "@/types/ShopOrder";
import HandledOrderRequest from "@/types/HandledOrderRequest";
import DeliverOrder from "@/pages/api/Order-APIs/DeliverOrder";
import CancelOrder from "@/pages/api/Order-APIs/CancelOrder";
import { useRouter } from "next/router";

interface ShopOrderCardInterface
{
  ShopOrder: ShopOrder
}

const ShopOrderCard = (props: ShopOrderCardInterface) =>
{

  const { ShopOrder } = props
  const { product_id, transaction_id, cart_id, delivery_status, product_image, product_name, product_price, quantity, user_id } = ShopOrder
  const router = useRouter()

  const handleRemoveClick = async () =>
  {
    // console.log("Item id " + product_id + " on cart " + cart_id + " on transaction " + transaction_id + " is going to be canceled, checking the transaction again and update it if all products have been delivered or canceled")

    const request: HandledOrderRequest = {
      cart_id: Number(cart_id),
      product_id: Number(product_id),
      transaction_id: Number(transaction_id)
    }
    const response = await CancelOrder(request)
    alert(response)
    if (response !== "Action failed!")
    {
      router.push("/")
    }

  }


  const handleDeliverClick = async () =>
  {
    // console.log("Item id " + product_id + " on cart " + cart_id + " on transaction " + transaction_id + " is going to be delivered, checking the transaction again and update it if all products have been delivered or canceled")

    const request: HandledOrderRequest = {
      cart_id: Number(cart_id),
      product_id: Number(product_id),
      transaction_id: Number(transaction_id)
    }
    const response = await DeliverOrder(request)
    alert(response)
    if (response !== "Action failed!")
    {
      router.push("/")
    }
  }

  return (
    <>
      <div className={s.cartcard}>
        <div className={s.imagecontainer}>
          <LiveImage width={200} imageUrl={product_image} />
        </div>
        <div className={s.middlesection}>
          <h1>
            {product_name} ({quantity}pcs)
          </h1>
          <h3>
            {`Rp. ${product_price?.toLocaleString()}, -`}
          </h3>
          <h3>
            {delivery_status}
          </h3>
        </div>
        <div className={s.rightsection}>

          {
            delivery_status === "In progress" &&
            <div className={s.pricesection} style={{ display: "flex", flexDirection: "row", columnGap: "5rem" }}>
              <button className={s.delbut} onClick={handleDeliverClick}>
                <i className="fa-sharp fa-solid fa-truck"></i>
                <span>
                  Deliver
                </span>
              </button>
              <button className={s.delbut} onClick={handleRemoveClick}>
                <i className="fa-solid fa-trash"></i>
                <span>
                  Cancel
                </span>
              </button>
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default ShopOrderCard;