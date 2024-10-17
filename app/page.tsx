import AboutSidebar from "../components/main/AboutSidebar";
import Bmi from "../components/main/Bmi";
import Cta from "../components/main/Cta";
import FeaturedClass from "../components/main/FeaturedClass";
import Footer from "../components/main/Footer";
import GymTrainers from "../components/main/GymTrainers";
import Header from "../components/main/Header";
import Hero from "../components/main/Hero";
// import LatestBlog from "../components/main/LatestBlog";
import MobileNavbar from "../components/main/MobileNavbar";
import PricingChart from "../components/main/PricingChart";
// import Sponsors from "./components/main/Sponsors";
import WhoWeAre from "../components/main/WhoWeAre";
import WhyChooseUs from "../components/main/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <Header />
      <MobileNavbar />
      <AboutSidebar />
      <Hero />
      <WhoWeAre />
      <FeaturedClass />
      <WhyChooseUs />
      <GymTrainers />
      {/* <Sponsors /> */}
      <Bmi />
      <PricingChart />
      {/* <LatestBlog /> */}
      <Cta />
      <Footer />
    </main>
  );
}
