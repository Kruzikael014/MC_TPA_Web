import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import AddCartRequest from "@/types/AddCartRequest";
import CartItem from "@/types/Cart";
import Cart from "@/types/Cart";
import Product from "@/types/Product";
import { onLog } from "firebase/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GetCart from "../api/Cart-APIs/GetCart";
import s from "@/styles/HomePage.module.css"
import GetSingleProduct from "../api/Product-APIs/GetSingleProduct";
import LiveImage from "@/components/LiveImage";
import CartCard from "@/components/CartCard";
import ButtonInput from "@/components/ButtonInput";
import GetCartTotal from "../api/Cart-APIs/GetCartTotal";

const CartPage = () =>
{

  const router = useRouter()
  const query = router.query

  const [cart, setCart] = useState<CartItem[] | undefined>(undefined)
  const [products, setProducts] = useState<Product[] | undefined>(undefined)
  const [totalPrice, setTotalPrice] = useState(0)



  useEffect(() =>
  {

    const fetchCart = async () =>
    {
      const response: CartItem[] | undefined = await GetCart(Number(query.id));
      setCart(response)

      if (Array.isArray(response))
      {
        const promises = response.map(async (cartItem: CartItem) =>
        {
          const productResponse: Product = await GetSingleProduct(Number(cartItem.product_id));
          return productResponse;
        });

        const products = await Promise.all(promises);
        setProducts(products);
      }
    };
    fetchCart()

  }, [query.id])

  const updateTotalPrice = async () =>
  {
    if (cart)
    {
      const response = await GetCartTotal(Number(cart[0].cart_id))
      setTotalPrice(Number(response))
    }
  }

  useEffect(() =>
  {
    updateTotalPrice()
  }, [cart])

  useEffect(() =>
  {
    if (Array.isArray(cart))
    {
      const quantityChanged = cart?.some(cartItem => cartItem.quantity)
      if (quantityChanged)
      {
        updateTotalPrice()
      }
    }
  }, [cart])

  const handleCheckout = () =>
  {
    router.push({
      pathname: "/Checkout",
      query: {
        carts: JSON.stringify(cart),
        products: JSON.stringify(products),
        totalPrice: totalPrice
      }
    })
  }


  return (
    <>
      <Navbar />
      <HeaderModule />
      <ThemeToggle />

      <div className={s.cartpage}>
        <h2 className={s.carttitle}>
          Shopping cart {`( ${(products?.length === 0 ? 0 : products?.length)} item(s) )`}
        </h2>

        <div className={s.offheader}>
          <div className={s.cartcontent}>
            {
              (products !== undefined && cart !== undefined) ?
                products.map((product: Product, index) =>
                {
                  return (
                    <>
                      <CartCard cart={cart[index]} product={product} onChangex={updateTotalPrice} />
                    </>
                  )
                })
                :
                <h1>
                  No item in cart, go add some
                </h1>
            }

          </div>
          <div className={s.cartsummary}>
            <h2>
              Summary
            </h2>
            <div className={s.pricerow}>
              <p>
                Item(s):
              </p>
              <b>
                <p>
                  {`Rp. ${totalPrice.toLocaleString()}, -`}
                </p>
              </b>
            </div>
            <div className={s.pricerow}>
              <p>
                Est. Delivery:
              </p>
              <b>
                <p>
                  {`Rp. 0, -`}
                </p>
              </b>
            </div>
            <div className={s.pricerow}>
              <p>
                Est. GST:
              </p>
              <b>
                <p>
                  {`Rp. 0, -`}
                </p>
              </b>
            </div>
            <div className={s.buttoncontainer}>
              <ButtonInput orange placeholder="SECURE CHECKOUT" func={handleCheckout} />
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default CartPage;