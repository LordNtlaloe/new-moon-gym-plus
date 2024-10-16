import Link from "next/link";
import React from "react";

function Cta() {
  return (
    <section id="cta">
      <div className="relative px-8 py-16 bg-no-repeat bg-cover mt-8">

        {/* Background image */}
        <div className="bg-[url('/images/hero/IMG-20230102-WA0000.jpg')] absolute inset-0 bg-[50%] bg-no-repeat bg-cover z-0"></div>

        {/* Add gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 text-white flex flex-col gap-4 font-bold max-w-screen-xl m-auto">
          <h1 className="text-4xl">Want To Book A Consultation?</h1>
          <h3 className="text-2xl flex items-center gap-2">
            <span className="text-[#ff0000]">Click Here:</span>
            <Link
              href="/"
              className="relative text-white flex items-center gap-2 bg-[#ff0000] font-bold px-4 py-2 text-sm after:h-[2.5rem] after:absolute after:w-[9.5rem] after:duration-300 after:ease-linear after:border after:border-[#ff0000] after:-top-2 after:-right-2 hover:after:top-0 hover:after:right-0 mt-6 w-fit"
            >
              <span>PURCHASE NOW</span>
              <span>
                <i className="fa-solid fa-arrow-right undefined"></i>
              </span>
            </Link>
          </h3>
        </div>
      </div>
    </section>
  );
}

export default Cta;
