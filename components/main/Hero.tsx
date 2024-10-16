import Image from "next/image";
import Link from "next/link";
import React from "react";

function Hero() {
  return (
    <section id="hero">
      <div className="relative h-[110vh] bg-[url('/images/hero/bg.jpg')] bg-[50%] bg-cover flex justify-center items-center text-white p-8">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        <div className="hidden lg:flex gap-4 flex-row-reverse -rotate-90 text-white absolute top-2/4 -right-8 items-center">
          <p className="uppercase text-xl font-bold tracking-widest z-10">share</p>
          <span className="w-10 bg-[#ff0000] h-[0.1563rem] z-10"></span>
          <div className="text-white gap-4 flex z-10">
            <i className="fa-brands rotate-90 hover:text-[#ff0000] fa-facebook text-xl cursor-pointer ease-in duration-200 "></i>
            <i className="fa-brands rotate-90 hover:text-[#ff0000] fa-twitter text-xl cursor-pointer ease-in duration-200"></i>
            <i className="fa-brands rotate-90 hover:text-[#ff0000] fa-linkedin-in text-xl cursor-pointer ease-in duration-200 "></i>
          </div>
        </div>

        <div className="flex flex-col gap-12 items-center lg:items-start relative lg:ml-[36rem] z-10">
          <Image
            src="/images/abstract/abstract.svg"
            alt="abstract"
            width={270}
            height={270}
            className="absolute left-5.5 lg:left-0 -top-2.5"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <p className="text-black z-10 font-semibold text-lg lg:ml-11">
            FIND YOUR ENERGY
          </p>
          <h1 className="font-bold text-[2.5rem] lg:text-5xl flex flex-col gap-2 text-center lg:text-left leading-snug lg:space-y-2 z-10">
            <span>MAKE YOUR BODY</span>{" "}
            <span className="font-normal">FIT & PERFECT</span>
          </h1>
          <Link
            href="/"
            className="relative flex items-center gap-2 bg-white text-black font-bold px-8 py-4 z-10 after:h-[3.5rem] after:absolute after:w-[13rem] after:duration-300 after:ease-linear after:border after:border-[hsla(0,0%,100%,.362)] after:-top-3 after:-right-3 hover:after:top-0 hover:after:right-0"
          >
            <span>OUR CLASSSES</span>
            <span className="text-[#ff0000]">
              <i className="fa-solid fa-arrow-right undefined"></i>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
