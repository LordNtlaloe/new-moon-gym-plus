"use client";

import React from "react";

function Bmi() {
  // const [weight, setWeight] = useState<number | null>(null);
  // const [height, setHeight] = useState<number | null>(null);
  // const [result, setResult] = useState<{
  //   bmi: number | null;
  //   status: string;
  // }>({
  //   bmi: null,
  //   status: "",
  // });

  // function getResult() {
  //   // const result = weight! / ((height! / 100) * (height! / 100));

  //   // let status;

  //   // switch (true) {
  //   //   case result <= 18.4:
  //   //     status = "Underweight";
  //   //     break;
  //   //   case result >= 18.5 && result <= 24.9:
  //   //     status = "Normal";
  //   //     break;
  //   //   case result >= 25 && result <= 39.9:
  //   //     status = "Overweight";
  //   //     break;
  //   //   case result >= 40:
  //   //     status = "Obese";
  //   //     break;
  //   //   default:
  //   //     status = "Invalid Input!";
  //   //     break;
  //   // }

  //   // return { bmi: result, status: status };
  // }

  return (
<section id="bmi">
  <div className="bg-[url('/images/hero/IMG_2330.jpg')] bg-no-repeat bg-cover bg-[100%] px-8 py-12 lg:py-20 relative lg:grid grid-cols-2">
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
    
    <div className="space-y-6 text-white z-20 relative max-w-screen-xl m-auto">
      <h1 className="font-bold text-4xl">
      &#34;The journey of a thousand miles begins with a single step.&#34;
      </h1>
      <p>
        Every step you take towards your health is a step worth celebrating.
      </p>
    </div>
  </div>
</section>

  );
}

export default Bmi;
