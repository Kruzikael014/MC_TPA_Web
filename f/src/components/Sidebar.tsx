import styles from "@/styles/HomePage.module.css"

const SideBar = () =>
{
  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-solid fa-server"></i>
            <p>Components & Storage</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-sharp fa-solid fa-desktop"></i>
            <p>Computer Systems</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-solid fa-keyboard"></i>
            <p>Computer Peripherals</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-solid fa-headphones"></i>
            <p>Electronics</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-sharp fa-solid fa-puzzle-piece"></i>
            <p>Gaming</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-brands fa-uncharted"></i>
            <p>Software & Services</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-solid fa-network-wired"></i>
            <p>Networking</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-regular fa-building"></i>
            <p>Office Solutions</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-solid fa-car"></i>
            <p>Automotive & Industrial</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-solid fa-wrench"></i>
            <p>Home & Tools</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-solid fa-bicycle"></i>
            <p>Health & Sports</p>
          </div>
          <p>&gt;</p>
        </div>
        <div className={styles.sidebaritem}>
          <div className={styles.obj}>
            <i className="fa-solid fa-bicycle"></i>
            <p>Apparel & Accessories</p>
          </div>
          <p>&gt;</p>
        </div>
      </div>

    </>
  );
}

export default SideBar;