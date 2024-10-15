import React from "react";
import Header from "../../components/main/Header";
import MobileNavbar from "../../components/main/MobileNavbar";
import AboutSidebar from "../../components/main/AboutSidebar";
import Banner from "../../components/main/Banner";
import Footer from "../../components/main/Footer";
import Contact from "../../components/main/Contact";

function page() {
  return (
    <main>
      <Header />
      <MobileNavbar />
      <AboutSidebar />
      <Banner page="Contact Us" />
      <Contact />
      <Footer />
    </main>
  );
}

export default page;
