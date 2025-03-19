import React from "react";
import Banner from "@/components/main/Banner";
import Gallery from "@/components/main/Gallery";

function page() {
  return (
    <main>
      <Banner page="Gallery" />
      <Gallery />
    </main>
  );
}

export default page;
