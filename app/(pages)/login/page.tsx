import React from "react";
import Header from "../../components/main/Header";
import Banner from "../../components/main/Banner";
import MobileNavbar from "../../components/main/MobileNavbar";
import Form from "../../components/main/Form";
import Footer from "../../components/main/Footer";
import AboutSidebar from "../../components/main/AboutSidebar";

function page() {
  return (
    <main className="bg-[url('/images/bg/bg.jpg')] bg-[50%] bg-no-repeat bg-cover">
      <Header />
      <MobileNavbar />
      <AboutSidebar />
      <Banner page="Login" />
      <Form />
      <Footer />
    </main>
  );
}

export default page;
