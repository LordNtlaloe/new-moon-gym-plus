import React from "react";
import Banner from "../../../components/main/Banner";
import FeaturedClass from "../../../components/main/FeaturedClass";

function page() {
  return (
    <main>
      <Banner page="Classes" />
      <FeaturedClass />
    </main>
  );
}

export default page;
