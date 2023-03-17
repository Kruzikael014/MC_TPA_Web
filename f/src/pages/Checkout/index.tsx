import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import CartItem from "@/types/Cart";
import Product from "@/types/Product";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import s from "@/styles/HomePage.module.css"
import LiveImage from "@/components/LiveImage";
import InputField from "@/components/InputField";
import ThemeToggle from "@/components/ThemeToggle";
import ButtonInput from "@/components/ButtonInput";
import CartCheckout from "../api/Cart-APIs/CartCheckout";
import CheckoutRequest from "@/types/CheckoutRequest";
import User from "@/types/User";
import getCookie from "@/util/GetCookie";
import getUserFromToken from "../api/User-APIs/getuser";
import PayRequest from "@/types/PayRequest";
import PayCheckout from "../api/Cart-APIs/PayCheckout";

const CheckoutForm = () =>
{

  const router = useRouter();
  const query = router.query

  const [user, setUser] = useState<User | undefined>(undefined)
  const [cartList, setCartList] = useState<CartItem[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() =>
  {
    const cartsJSON = query.carts as string;
    const productsJSON = query.products as string;
    const totalPriceQuery = parseInt(query.totalPrice as string);

    if (cartsJSON)
    {
      setCartList(JSON.parse(cartsJSON));
    }

    if (productsJSON)
    {
      setProductList(JSON.parse(productsJSON));
    }

    if (totalPriceQuery)
    {
      setTotalPrice(totalPriceQuery)
    }

  }, [router.query.carts, router.query.products, router.query.totalPrice]);

  const [delivery, setDelivery] = useState("")
  const [payment, setPayment] = useState("")


  useEffect(() =>
  {
    const getCurrUser = async () =>
    {
      const ob = {
        JWToken: getCookie("JWToken")
      }
      const response = await getUserFromToken(ob)
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

  const handleFormSubmit = async (e: any) =>
  {

    e.preventDefault()

    if (delivery === "")
    {
      alert("This field must not be empty")
      return
    }

    if (payment === "" || !payment)
    {
      alert("This field must not be empty")
      return
    }

    // console.log(cartList);
    // console.log(totalPrice);
    // console.log(delivery);
    // console.log(payment);
    // console.log(user);
    
    // kalau misalnya dia pilih cryptocurrency / debit credit langsung checkout aja (tidak bisa kita kurangin karena gamungkin kita minta credit / debitnya terus kurangin duit dia $5000 beneran)
    if (payment === "Credit/Debit" || payment === "Cryptocurrency")
    {
      const request: CheckoutRequest = {
        cart_id: Number(cartList[0].cart_id),
        delivery_provider: delivery,
        transaction_payment: payment
      }
      const response = await CartCheckout(request)
      alert(response)
    }

    // kalau misalnya dia pilih OldEggCurrency, validasiin oldegg money user nya dulu
    else
    {
      const payRequest: PayRequest = {
        total_amount: Number(totalPrice),
        user_id: Number(user?.id)
      }
      const response = await PayCheckout(payRequest)
      if (response === "You dont have enough balance!") {
        alert(response)
        return
      }
      const request: CheckoutRequest = {
        cart_id: Number(cartList[0].cart_id),
        delivery_provider: delivery,
        transaction_payment: payment
      }
      const checkoutResponse = await CartCheckout(request)
      if (checkoutResponse === "Cart successfully checked out!") {
        alert(checkoutResponse)
        router.push("/")
      }
    }

  }

  return (
    <>
      <Navbar />
      <ThemeToggle />
      <HeaderModule />
      <div className={s.checkoutform}>
        <h1 className={s.title}>
          Checkout form
        </h1>
        <form onSubmit={handleFormSubmit} className={s.theform}>
          <InputField onChange={setDelivery} value={delivery} required placeholder="Input your delivery service provider" width={650} height={35} />
          <select defaultValue={""} className={s.inputselect} onChange={(e) => { setPayment(e.target.value) }}>
            <option value="" disabled>Select payment method</option>
            <option value="Cryptocurrency">Cryptocurrency</option>
            <option value="Credit/Debit">Credit/Debit</option>
            <option value="OldEggcurrency">OldEggcurrency</option>
          </select>
          <div className={s.buttoncontainer}>
            <ButtonInput submit blue centered width={200} placeholder={"Checkout now"} />
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default CheckoutForm;

{/* <div>
          {
            cartList.map((cart) =>
            {
              return (
                <>
                  <h1>
                    {cart.product_id} | {cart.user_id}
                  </h1>
                </>
              )
            })
          }
        </div>
        -----------
        <div>
          {
            productList.map((product) =>
            {
              return (
                <>

                <LiveImage imageUrl={product.product_image} width={150} />

                </>
              )
            })
          }
        </div> */}