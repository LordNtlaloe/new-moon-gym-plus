import Link from "next/link";
import React from "react";

function Cta() {
  return (
    <section id="cta">
      <div className="bg-[url('/images/cta/bg.jpg')] px-8 py-16 bg-[50%] bg-no-repeat bg-cover mt-8">
        <div className="text-white flex flex-col gap-4 font-bold max-w-screen-xl m-auto">
          <h1 className="text-4xl">Want To Book A Consultation?</h1>
          <h3 className="text-2xl flex items-center gap-2">
            <span className="text-[#ff0000]">Click Here:</span>
            <Link
              href="/"
              className="relative text-white flex items-center gap-2 bg-[#ff0000] font-bold px-6 py-4 after:h-[1.5rem] after:absolute after:w-[13.25rem] after:duration-300 after:ease-linear after:border after:border-[#ff0000] after:-top-3 after:-right-3 hover:after:top-0 hover:after:right-0 mt-6 w-fit"
            >
              <span>PURCHASE NOW</span>
              <span>
                <i className="fa-solid fa-arrow-right undefined"></i>
              </span>
            </Link>
          </h3>
          <div>
            
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cta;
