import React from "react";
import Banner from "@/components/main/Banner";
import Blog from "@/components/main/Blog";

function page() {
  return (
    <main>
      <Banner page="Blog" />
      <Blog />
    </main>
  );
}

export default page;
