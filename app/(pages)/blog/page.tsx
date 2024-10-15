import React from "react";
import Header from "../../components/main/Header";
import MobileNavbar from "../../components/main/MobileNavbar";
import AboutSidebar from "../../components/main/AboutSidebar";
import Banner from "../../components/main/Banner";
import Footer from "../../components/main/Footer";
import Blog from "../../components/main/Blog";

function page() {
  return (
    <main>
      <Header />
      <MobileNavbar />
      <AboutSidebar />
      <Banner page="Blog" />
      <Blog />
      <Footer />
    </main>
  );
}

export default page;
