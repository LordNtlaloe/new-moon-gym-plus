import Image from "next/image";
import React from "react";

function FeaturedClass() {
  return (
    <section id="featured-class">
      <div className="px-8 py-16 flex flex-col gap-8 max-w-screen-xl m-auto lg:px-0 lg:py-24">
        <div className="relative">
          <Image
            src="/images/abstract/abstract.svg"
            alt="abstract"
            width={270}
            height={270}
            className="absolute left-[1.65rem] lg:left-[39.25%] -top-2.5"
          />
          <p className="text-white relative z-10 font-bold text-center">
            OUR SESSIONS
          </p>
        </div>
        <h1 className="font-bold text-4xl text-center">
          Morning and Afternoon Cardio & Bodybuilding Sessions
        </h1>

        {/* Morning Classes Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center">Morning Sessions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4 lg:mt-4">
            {/* Cardio Class */}
            <div className="group h-[20rem] flex items-end relative p-6 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-[url('/images/featured-class/cardio-morning.jpeg')] bg-cover bg-[50%] grayscale group-hover:grayscale-0 group-hover:scale-125 duration-300 ease-linear"></div>
              <div className="space-y-4 text-white z-10">
                <h1 className="font-bold text-3xl">Cardio</h1>
                <p className="bg-[#ff0000] px-4 py-1">04:00am - 09:00am (Every Hour)</p>
              </div>
            </div>

            {/* Bodybuilding Class */}
            <div className="group h-[20rem] flex items-end relative p-6 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-[url('/images/featured-class/building-morning.jpeg')] bg-cover bg-[50%] grayscale group-hover:grayscale-0 group-hover:scale-125 duration-300 ease-linear"></div>
              <div className="space-y-4 text-white z-10">
                <h1 className="font-bold text-3xl">Bodybuilding</h1>
                <p className="bg-[#ff0000] px-4 py-1">04:00am - 09:00am (Every Hour)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Afternoon Classes Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center">Afternoon Sessions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4 lg:mt-4">
            {/* Cardio Class */}
            <div className="group h-[20rem] flex items-end relative p-6 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-[url('/images/featured-class/cardio-evening.jpeg')] bg-cover bg-[50%] grayscale group-hover:grayscale-0 group-hover:scale-125 duration-300 ease-linear"></div>
              <div className="space-y-4 text-white z-10">
                <h1 className="font-bold text-3xl">Cardio</h1>
                <p className="bg-[#ff0000] px-4 py-1">04:00pm - 07:00pm (Every Hour)</p>
              </div>
            </div>

            {/* Bodybuilding Class */}
            <div className="group h-[20rem] flex items-end relative p-6 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-[url('/images/featured-class/building-evening.jpeg')] bg-cover bg-[50%] grayscale group-hover:grayscale-0 group-hover:scale-125 duration-300 ease-linear"></div>
              <div className="space-y-4 text-white z-10">
                <h1 className="font-bold text-3xl">Bodybuilding</h1>
                <p className="bg-[#ff0000] px-4 py-1">04:00pm - 07:00pm (Every Hour)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedClass;
