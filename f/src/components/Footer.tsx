import styles from "@/styles/HomePage.module.css"
import { ThemeContext } from "@/types/Theme"
import Link from "next/link"
import { useContext } from "react"

export default function Footer()
{

  const theme = useContext(ThemeContext)

  return (
    <div>
      <div className={styles.footer} style={{backgroundColor: theme.footer}} >
        <div className={`${styles.custseg} ${styles.vert}`}>
          <div className={styles.segmenthead}>
            Customer Service
          </div>
          <div className={styles.segmentcontent}>
            <div>
              Help Center
            </div>
            <div>
              Track an Order
            </div>
            <div>
              Return anIitem
            </div>
            <div>
              Return Policy
            </div>
            <div>
              Privacy & Security
            </div>
            <div>
              Feedback
            </div>
          </div>
        </div>
        <div className={`${styles.accountseg} ${styles.vert}`}>
          <div className={styles.segmenthead}>
            MY ACCOUNT
          </div>
          <div className={styles.segmentcontent}>
            <Link href={"/signin"} className={styles.logreglink}>
              <div className={styles.logreg}>
                Login/Register
              </div>
            </Link>
            <div>
              Order History
            </div>
            <div>
              Returns History
            </div>
            <div>
              Address Book
            </div>
            <div>
              Wish Lists
            </div>
            <div>
              My Build Lists
            </div>
            <div>
              My Build Showcase
            </div>
            <div>
              Email Notifications
            </div>
            <div>
              Subscriptions Orders
            </div>
            <div>
              Auto Notifications
            </div>
          </div>
        </div>
        <div className={`${styles.companyseg} ${styles.vert}`}>
          <div className={styles.segmenthead}>
            COMPANY INFORMATION
          </div>
          <div className={styles.segmentcontent}>
            <div>
              About Newegg
            </div>
            <div>
              Investor Relations
            </div>
            <div>
              Awards/Rankings
            </div>
            <div>
              Hours and Locations
            </div>
            <div>
              Press Inquiries
            </div>
            <div>
              Newegg Careers
            </div>
            <div>
              Newsroom
            </div>
            <div>
              Newegg Insider
            </div>
            <div>
              Calif. Transparency in Supply CHains Act
            </div>
            <div>
              Cigna MRF
            </div>
          </div>
        </div>
        <div className={`${styles.resourceseg} ${styles.vert}`}>
          <div className={styles.segmenthead}>
            TOOLS & RESOURCES
          </div>
          <div className={styles.segmentcontent}>
            <div>
              Sell on Newegg
            </div>
            <div>
              For Your Business
            </div>
            <div>
              New Egg Partner Services
            </div>
            <div>
              Become an Affiliate
            </div>
            <div>
              Newegg Creators
            </div>
            <div>
              Site Map
            </div>
            <div>
              Shop by Brand
            </div>
            <div>
              Rebates
            </div>
            <div>
              Mobile Apps
            </div>
          </div>
        </div>
        <div className={`${styles.brandseg} ${styles.vert}`}>
          <div className={styles.segmenthead}>
            SHOP OUR BRANDS
          </div>
          <div className={styles.segmentcontent}>
            <div>
              Newegg Business
            </div>
            <div>
              Newegg Global
            </div>
            <div>
              ABS
            </div>
            <div>
              Rosewill
            </div>
          </div>
        </div>
      </div>
      <div className={styles.disclaimer} style={{backgroundColor: theme.light_background}}>
        <div className={styles.leftdiv}>
          <div className={styles.copyright}>
            @2000 - 2023 Newegg Inc. All rights reserved.
          </div>
          <div className={styles.disclaimerbuttons}>
            <div className={styles.button} >
              Tems & Conditions
            </div>
            <div className={styles.button} >
              Privacy Policy
            </div>
            <div className={styles.button} >
              Cookie Preferences
            </div>
          </div>
        </div>
        <div className={styles.socialmedia}>
          <a className={styles.socmedlink} href="https://www.facebook.com/Newegg/">
            <i className="fa-brands fa-facebook fa-2xl"></i>
          </a>
          <a className={styles.socmedlink} href="https://twitter.com/Newegg">
            <i className="fa-brands fa-twitter fa-2xl"></i>
          </a>
          <a className={styles.socmedlink} href="https://www.instagram.com/newegg/">
            <i className="fa-brands fa-square-instagram fa-2xl"></i>
          </a>
          <a className={styles.socmedlink} href="https://www.linkedin.com/company/newegg-com">
            <i className="fa-brands fa-linkedin fa-2xl"></i>
          </a>
          <a className={styles.socmedlink} href="https://www.pinterest.com/newegg/">
            <i className="fa-brands fa-pinterest-p fa-2xl"></i>
          </a>
          <a className={styles.socmedlink} href="https://www.youtube.com/channel/UCJ1rSlahM7TYWGxEscL0g7Q">
            <i className="fa-brands fa-youtube fa-2xl"></i>
          </a>
          <a className={styles.socmedlink} href="https://www.twitch.tv/newegg">
            <i className="fa-brands fa-twitch fa-2xl"></i>
          </a>
          <a className={styles.socmedlink} href="https://discord.com/invite/newegg">
            <i className="fa-brands fa-discord fa-2xl"></i>
          </a>
          <a className={styles.socmedlink} href="https://www.tiktok.com/@newegg?lang=en">
            <i className="fa-brands fa-tiktok fa-2xl --fa-primary-color"></i>
          </a>
        </div>
      </div>
    </div>
  )

}