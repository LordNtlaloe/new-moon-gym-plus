import React from "react";
import Header from "../../components/main/Header";
import MobileNavbar from "../../components/main/MobileNavbar";
import AboutSidebar from "../../components/main/AboutSidebar";
import Banner from "../../components/main/Banner";
import Footer from "../../components/main/Footer";
import WhoWeAreAbout from "../../components/main/WhoWeAreAbout";

function page() {
  return (
    <main className="bg-[url('/images/bg/bg.jpg')] bg-[50%] bg-no-repeat bg-cover">
      <Header />
      <MobileNavbar />
      <AboutSidebar />
      <Banner page="About Us" />
      <WhoWeAreAbout />
      <Footer />
    </main>
  );
}

export default page;
