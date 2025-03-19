import React from "react";
import Header from "@/components/main/Header";
import MobileNavbar from "@/components/main/MobileNavbar";
import AboutSidebar from "@/components/main/AboutSidebar";
import Banner from "@/components/main/Banner";
import Footer from "@/components/main/Footer";
import Schedule from "@/components/main/Schedule";

function page() {
  return (
    <main>
      <Header />
      <MobileNavbar />
      <AboutSidebar />
      <Banner page="Schedule by Day" />
      <Schedule />
      <Footer />
    </main>
  );
}

export default page;
