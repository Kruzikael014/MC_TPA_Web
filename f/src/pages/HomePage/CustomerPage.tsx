import Carousel from "@/components/Carousel"
import ProductPage from "@/components/ProductPage"
import SideBar from "@/components/Sidebar"
import styles from "@/styles/HomePage.module.css"
import { ThemeContext } from "@/types/Theme"
import { useContext } from "react"

const CustomerPage = () =>
{

  const theme = useContext(ThemeContext) 

  return (
    <div className={styles.homepage} style={{color: theme.textColor}}>
      <Carousel />
      <ProductPage />
    </div>
  )
}

export default CustomerPage