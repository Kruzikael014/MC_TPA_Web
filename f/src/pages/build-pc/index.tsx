import Footer from "@/components/Footer";
import HeaderModule from "@/components/HeaderModule";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";


const BuildPc = () =>
{


  return (
    <div>
      <Navbar />
      <ThemeToggle />
      <HeaderModule />
      <center>
        <h1>
          Hello im build PC
        </h1>
      </center>
      <Footer />
    </div>
  )

}

export default BuildPc;