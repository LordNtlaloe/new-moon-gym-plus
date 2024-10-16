import React from "react";
import Banner from "../../../components/main/Banner";
import PricingChart from "../../../components/main/PricingChart";

function page() {
  return (
    <main>
      <Banner page="Pricing" />
      <PricingChart />
    </main>
  );
}

export default page;
