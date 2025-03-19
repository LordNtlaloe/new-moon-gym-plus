import React from "react";
import Banner from "@/components/main/Banner";
import WhoWeAreAbout from "@/components/main/WhoWeAreAbout";

function page() {
  return (
    <main className="bg-[url('/images/bg/bg.jpg')] bg-[50%] bg-no-repeat bg-cover">
      <Banner page="About Us" />
      <WhoWeAreAbout />
    </main>
  );
}

export default page;
