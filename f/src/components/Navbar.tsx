import styles from '@/styles/HomePage.module.css'
import logo from "@/assets/newEgg.png"
import burger from "@/assets/hamburger_icon.png"
import locationicon from "@/assets/location.png"
import cart from "@/assets/cart.png"
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import User from '@/types/User'
import getCookie from '@/util/GetCookie'
import getUserFromToken from '../pages/api/User-APIs/getuser'
import clearCookie from '@/util/DeleteCookie'
import GetCountry, { getLocation } from '@/util/LocationFetcher'
import { useRouter } from 'next/router'
import SearchBar from './SearchBar'
import ReactSwitch from 'react-switch'
import { ThemeContext } from '@/types/Theme'
import NotificationBar from './NotificationBar'
import Shortcut from './Shortcut'



export default function Navbar()
{
  const [user, setUser] = useState<User>({ First_name: "", Last_name: "", Email: "", Password: "", Phone_num: "", Email_subscriber: false, Status: "", Role_name: "", balance: 0 })
  const [showShortcut, setShowShortcut] = useState(false);
  const [showNotif, setShowNotif] = useState(false)
  const [country, setCountry] = useState<string | null>("")
  const router = useRouter()

  const [countryLoaded, setCountryLoaded] = useState(false)

  const theme = useContext(ThemeContext)

  useEffect(() =>
  {
    const fetchLocation = async () =>
    {
      try
      {
        const coords = await getLocation();
        if (location !== null)
        {
          const countryResult = await GetCountry(coords.latitude, coords.longitude)

          setCountry(countryResult)
          if (countryResult)
          {
            sessionStorage.setItem("country", countryResult)
          }

          setCountryLoaded(true)
        }
      } catch (error)
      {
        console.error(error);
      }
    }
    fetchLocation()
  }, [])

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

  const profileClick = () =>
  {
    if (user.Email !== undefined)
    {
      setShowShortcut(!showShortcut);
    }
  };

  const signout = () =>
  {
    // clear cookie 
    clearCookie("JWToken")
    //  reload page
    window.location.reload()
  }

  const handleCartButtonClick = (e: any) =>
  {
    router.push(`/Cart/${user.id}`)
  }

  const notificationClick = () =>
  {
    if (user.Email !== undefined)
    {
      console.log("a");
      setShowNotif(!showNotif)
    }
  }

  const handleOrderClick = () =>
  {
    router.push("/order-page")
  }

  return (
    <div className={styles.navbar} style={{ backgroundColor: theme.navbar, color: theme.textColor }}>
      <div className={styles.money} style={{ backgroundColor: theme.navbar, color: theme.textColor, display: (user && user.balance !== 0) ? "block" : "none" }}>
        <p>Balance</p>
        <p> {(user && user.balance !== undefined) ? `Rp. ${user.balance.toLocaleString()}, -` : ""} </p>
      </div>
      <div className={styles.vertidiv}>
        <div className={styles.horidiv}>
          <Image src={burger} width={35} height={35} alt='not found' style={{ color: theme.textColor }} />
          <Image src={logo} alt='error not found' width={101} height={51} onClick={(e) => { router.push("/") }} />
          <div className={styles.horidiv}>
            <Image alt='not found' src={locationicon ? locationicon : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"} width={28} height={28} />
            <div className={styles.vertidiv}>
              <p className={styles.locatext}>
                Deliver to
              </p>
              {
                countryLoaded &&
                <select
                  style={{
                    backgroundColor: theme.navbar,
                    color: theme.textColor
                  }}
                  className={styles.locatext2}
                  name="country"
                  id="country"
                  defaultValue={(country) ? country : ""}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  <option value={(country) ? country : ""}>
                    {country}
                  </option>
                  <option value="Singapore">
                    Singapore
                  </option>
                  <option value={"Malaysia"}>
                    Malaysia
                  </option>
                  <option value={"Thailand"}>
                    Thailand
                  </option>
                  <option value={"America"}>
                    America
                  </option>
                </select>
              }
            </div>


          </div>

          {/* Search bar here */}

          <SearchBar />

          {/* Search bar here */}

          <div className={styles.notifbutton} onClick={notificationClick}>
            <i className="fa-regular fa-bell fa-xl"></i>
          </div>
          {
            showNotif &&
            <>
              <NotificationBar user={user} />
            </>
          }
          <div className={styles.lang}>
            <i className="fa-solid fa-flag"></i>
          </div>
          <div className={styles.themebutt}>

          </div>

          {
            showShortcut && (
              <Shortcut />
            )
          }

          <Link href={user.Email !== undefined ? "" : "/signin"} onClick={profileClick} className={styles.dontblue}>
            <div className={styles.signin}>
              <i className="fa-regular fa-user fa-2xl"></i>
              <div className={styles.textcontainer}>
                <div>
                  Welcome
                </div>
                <div>
                  {user.First_name !== undefined ? `${user.First_name + " " + user.Last_name}` : `Sign in/Register`}
                </div>
              </div>
            </div>
          </Link>
          <div className="vertidiv" onClick={handleOrderClick}>
            <div>
              Returns
            </div>
            <b>
              <div className='b'>
                & Orders
              </div>
            </b>
          </div>
          <div className='cartbutton' title={`${2} items, $${5.099}`} onClick={handleCartButtonClick}>
            <Image width={28} height={28} src={cart ? cart : "https://www.meme-arsenal.com/memes/c9e6371faa3b57eaee1d35595ca8e910.jpg"} alt='not found' />
          </div>
        </div>
        <div className={styles.horidiv}>
          <div className={styles.horidiv1}>
            <p className="smalltext">Today's Best Deals</p>
            <p className="smalltext">Best Seller</p>
            <p className="smalltext">RTX4070/4060/4050 Gaming Laptops</p>
            <p className="smalltext">Valentine's Day</p>
            <p className="smalltext">PC Builder</p>
            <p className="smalltext">VR</p>
            <p className="smalltext">Browsing History</p>
            <p className="smalltext">Gaming PC Finder</p>
            <p className="smalltext">Newegg Creator</p>
          </div>
          <div className={styles.horidivlower}>
            <div className={styles.nebusiness}>
              <div className={styles.blue} style={{ color: theme.textColor }}>
                NEWEGG
              </div>
              <div>
                BUSINESS
              </div>
            </div>
            <div className={styles.feedback}>
              <i className="fa-sharp fa-solid fa-comment"></i>
              <div>
                FEEDBACK
              </div>
            </div>
            <div className={styles.help}>
              <i className="fa-sharp fa-solid fa-question"></i>
              <div>
                HELP CENTER
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}