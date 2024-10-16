import Image from "next/image";
import Link from "next/link";
import React from "react";
import { LucideApple, LucideUserCheck, LucideTrendingUp, LucideUsers  } from "lucide-react";


function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="bg-[url('/images/whychooseus/black-bg.jpg')] bg-[50%] bg-cover"
    >
      <div className="bg-[#ff0000] lg:bg-[url('/images/whychooseus/red-bg.png')] bg-[50%] bg-cover bg-no-repeat lg:h-[16rem] py-8 px-12 flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left lg:gap-32">
        <h1 className="text-white font-bold text-2xl lg:text-4xl lg:w-[42rem] lg:leading-snug">
          We Are Always Providing Best Fitness Service For You
        </h1>
        <Link
          href="/"
          className="relative flex items-center gap-2 bg-white text-black font-bold px-8 py-4 after:h-[3.5rem] after:absolute after:w-[13rem] after:duration-300 after:ease-linear after:border after:border-[hsla(0,0%,100%,.362)] after:-top-3 after:-right-3 hover:after:top-0 hover:after:right-0"
        >
          <span>Work With Us</span>
          <span className="text-[#ff0000]">
            <i className="fa-solid fa-arrow-right undefined"></i>
          </span>
        </Link>
      </div>
      <div className="text-white px-8 pt-32 lg:grid lg:grid-cols-2 lg:gap-32 max-w-screen-xl m-auto">
        <div className="relative">
          <div className="absolute bottom-0 lg:bottom-24 lg:-left-4 h-[42%] w-2.5 bg-[#ff0000]"></div>
          <div className="absolute -top-16 lg:top-16 lg:right-0 right-[2.125rem] h-[28.8125rem] w-2.5 bg-[#ff0000] rotate-[174deg]"></div>
          <Image
            src="/images/whychooseus/main.jpg"
            alt="why choose us"
            width={1000}
            height={1000}
            className="m-auto w-60 lg:w-[32rem]"
          />
        </div>
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8 py-16 relative">
          <Image
            src="/images/abstract/abstract.svg"
            alt="abstract"
            width={250}
            height={250}
            className="absolute left-9 lg:left-0 top-14"
          />
          <h3 className="font-bold z-10 lg:translate-x-14">WHY CHOOSE US</h3>
          <h1 className="font-bold text-4xl">
            We Can Give A Shape Of Your Body Here!
          </h1>
          <p className="text-[#b4b4b4]">
            At <strong>New Moon Gym Plus</strong>, we are dedicated to helping you achieve
            the body of your dreams. Our expert trainers and nutritionists will
            work with you to create a personalized fitness and nutrition plan
            that helps you reach your specific goals.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-12 lg:px-0">
            <div className="flex items-center gap-4">
              <LucideUserCheck className="bg-[#2b2b2b] text-white hover:bg-[#ff0000] hover:text-white ease-linear duration-300 rounded-full text-center p-4 w-[80px] h-[70px]" />

              <h1 className="font-bold text-lg">Free Personal Trainers</h1>
            </div>
            <div className="flex items-center gap-4">
              <LucideTrendingUp className="bg-[#2b2b2b] text-white hover:bg-[#ff0000] hover:text-white ease-linear duration-300 rounded-full p-4 w-[70px] h-[70px]" />

              <h1 className="font-bold text-lg">Results Guaranteed</h1>
            </div>
            <div className="flex items-center gap-4">
              <LucideUsers className="bg-[#2b2b2b] text-white hover:bg-[#ff0000] hover:text-white ease-linear duration-300 rounded-full p-4 w-[80px] h-[70px]" />

              <h1 className="font-bold text-lg">Group Workout Sessions</h1>
            </div>
            <div className="flex items-center gap-4">
              <LucideApple className="bg-[#2b2b2b] text-white hover:bg-[#ff0000] hover:text-white ease-linear duration-300 rounded-full p-4 w-[70px] h-[70px]" />
              <h1 className="font-bold text-lg">Nutrition</h1>
            </div>
          </div>
          <div>
            <Link
              href="/"
              className="relative text-white flex items-center gap-2 bg-[#595959] hover:bg-[#ff0000] font-bold px-8 py-4 after:h-[3.5rem] after:absolute after:w-[12.5rem] after:duration-300 after:ease-linear after:border after:border-[rgb(89,89,89)] hover:after:border-[#ff0000] after:-top-3 after:-right-3 hover:after:top-0 hover:after:right-0 my-8"
            >
              <span>OUR CLASSES</span>
              <span>
                <i className="fa-solid fa-arrow-right undefined"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
