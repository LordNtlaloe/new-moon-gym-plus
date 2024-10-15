import React from "react";
import Header from "../../components/main/Header";
import MobileNavbar from "../../components/main/MobileNavbar";
import AboutSidebar from "../../components/main/AboutSidebar";
import Banner from "../../components/main/Banner";
import Footer from "../../components/main/Footer";
import Gallery from "../../components/main/Gallery";

function page() {
  return (
    <main>
      <Header />
      <MobileNavbar />
      <AboutSidebar />
      <Banner page="Gallery" />
      <Gallery />
      <Footer />
    </main>
  );
}

export default page;
