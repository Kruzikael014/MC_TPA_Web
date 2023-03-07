import styles from "@/styles/HomePage.module.css"
import { ThemeContext } from "@/types/Theme";
import { useContext } from "react";
import InfiniteProduct from "./InfiniteProduct";

const ProductPage = () =>
{

  const theme = useContext(ThemeContext)

  return (
    <>
      <div className={styles.productpage} style={{color: theme.textColor}}>
        <h1 className={styles.titleproduct}>
          TODAY'S BEST DEAL-S
        </h1>
        <div className={styles.bestdealsitems}>
          <div className={styles.mainbestdeal}>
            1
          </div>
          <div className={styles.besidemain}>
            <div className={styles.row1}>
              <div className={`${styles.data} ${styles.col1}`}></div>
              <div className={`${styles.data} ${styles.col2}`}></div>
            </div>
            <div className={styles.row2}>
              <div className={`${styles.data} ${styles.col1}`}></div>
              <div className={`${styles.data} ${styles.col2}`}></div>
            </div>
          </div>
        </div>
        <div className={styles.bestdealbottom}>
          <div className={styles.data}>1</div>
          <div className={styles.data}>2</div>
          <div className={styles.data}>3</div>
          <div className={styles.data}>4</div>
        </div>
        <div>
          <h1>
            Categories
          </h1>
        </div>

        <div>
          <h1>
            Discover
          </h1>
        </div>

        <div>
          <h1 className={styles.titleproduct}>
            You may also like
          </h1>
          <InfiniteProduct />
        </div>

      </div>


    </>
  );
}

export default ProductPage;