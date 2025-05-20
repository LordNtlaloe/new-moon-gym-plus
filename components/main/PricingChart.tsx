import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";

function PricingChart() {
  return (
    <section id="pricing-chart">
      <div className="bg-[url('/images/bg/bg.jpg')] px-8 py-16 bg-[50%] bg-no-repeat bg-cover relative space-y-16">
        <Image
          src="/images/pricing-chart/nodaysoff.png"
          alt="no days off"
          width={270}
          height={200}
          className="absolute left-0"
        />
        <Image
          src="/images/pricing-chart/twobarbels.png"
          alt="dunno"
          width={300}
          height={200}
          className="absolute bottom-0 right-0"
        />
        <div className="relative flex flex-col gap-4 items-center text-center">
          <Image
            src="/images/abstract/abstract.svg"
            alt="abstract"
            width={220}
            height={150}
            className="absolute left-[2.95rem] lg:left-[32.75rem] -top-1.5"
          />
          <p className="text-white relative z-10 font-bold text-center mb-4">
            PRICING PLAN
          </p>
          <h1 className="font-bold text-4xl">Exclusive Pricing Plan</h1>
          <p>New Moon Gym Plus Affordable Prices</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 max-w-screen-xl m-auto lg:px-16 gap-6 z-10 relative">
          {/* Pricing Plan 1 */}
          <div className="flex flex-col group">
            <div className="relative">
              <Image
                src="/images/hero/IMG_2339.jpg"
                alt="beginners"
                width={500}
                height={400}
                className="grayscale group-hover:grayscale-0 duration-300 ease-linear w-full"
              />
              <div className="absolute inset-0 bg-red-600 opacity-100 transition-opacity duration-300 ease-linear group-hover:opacity-50"></div>
              <div className="bg-white font-bold text-xl py-4 text-center absolute -bottom-5 left-12 right-12 group-hover:text-[#ff0000] duration-300 ease-linear">
                Ha Pita Branch
              </div>
            </div>
            <div className="bg-white pb-12 pt-8 shadow-xl flex flex-col items-center justify-center gap-6 lg:gap-4">
              <div className="flex gap-2 items-center lg:mb-2">
                <span className="text-xl">M</span>
                <span className="font-bold text-[3.5rem]">650</span>
                <span className="text-xl">p/m</span>
              </div>
              <p className="text-[#FF0000] px-5">Plus M150 Registration Fee</p>
              <ul className="list-none space-y-2">
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Free Personal Trainer</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Progressive Training Schedule</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Results Guaranteed</li>
                <li className="flex items-center"><FaTimesCircle className="text-[#FF0000] mr-2" /> Meal Plan</li>
              </ul>
              <Link
                href="/"
                className="relative text-white flex items-center gap-2 bg-[#ff0000] font-bold px-4 py-2 after:h-[3.5rem] after:absolute after:w-[14rem] after:duration-300 after:ease-linear after:border after:border-[#ff0000] after:-top-3 after:-right-3 hover:after:top-0 hover:after:right-0 mt-4 lg:mt-6 focus:outline-none"
              >
                <span>PURCHASE NOW</span>
                <span>
                  <i className="fa-solid fa-arrow-right undefined"></i>
                </span>
              </Link>
            </div>
          </div>
          {/* Pricing Plan 2 */}
          <div className="flex flex-col group">
            <div className="relative">
              <Image
                src="/images/hero/IMG_2342.jpg"
                alt="basic"
                width={500}
                height={400}
                className="grayscale group-hover:grayscale-0 duration-300 ease-linear w-full"
              />
              <div className="absolute inset-0 bg-green-700 opacity-100 transition-opacity duration-300 ease-linear group-hover:opacity-50"></div>
              <div className="bg-white font-bold text-xl py-4 text-center absolute -bottom-5 left-10 right-10 group-hover:text-[#ff0000] duration-300 ease-linear">
                Weightloss Therapy
              </div>
            </div>
            <div className="bg-white pb-12 pt-8 shadow-xl flex flex-col items-center justify-center gap-6 lg:gap-4">
              <div className="flex gap-2 items-center lg:mb-2">
                <span className="text-xl">M</span>
                <span className="font-bold text-[3.5rem]">850</span>
                <span className="text-xl">p/m</span>
              </div>
              <p className="text-[#FF0000] px-5">Plus M150 Registration Fee</p>
              <ul className="list-none space-y-2">
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Free Personal Trainer</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Meal Plan</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Progress Monitoring</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Nutritional Guidance</li>
              </ul>
              <Link
                href="/"
                className="relative text-white flex items-center gap-2 bg-[#ff0000] font-bold px-4 py-2 after:h-[3.5rem] after:absolute after:w-[14rem] after:duration-300 after:ease-linear after:border after:border-[#ff0000] after:-top-3 after:-right-3 hover:after:top-0 hover:after:right-0 mt-4 lg:mt-6 focus:outline-none"
              >
                <span>PURCHASE NOW</span>
                <span>
                  <i className="fa-solid fa-arrow-right undefined"></i>
                </span>
              </Link>
            </div>
          </div>
          {/* Pricing Plan 3 */}
          <div className="flex flex-col group">
            <div className="relative">
              <Image
                src="/images/hero/IMG_2372.jpg"
                alt="advance"
                width={500}
                height={400}
                className="grayscale group-hover:grayscale-0 duration-300 ease-linear w-full"
              />
              <div className="absolute inset-0 bg-blue-800 opacity-100 transition-opacity duration-300 ease-linear group-hover:opacity-50"></div>
              <div className="bg-white font-bold text-xl py-4 text-center absolute -bottom-5 left-12 right-12 group-hover:text-[#ff0000] duration-300 ease-linear">
                Hi-Fi City Branch
              </div>
            </div>
            <div className="bg-white pb-12 pt-8 shadow-xl flex flex-col items-center justify-center gap-6 lg:gap-4">
              <div className="flex gap-2 items-center lg:mb-2">
                <span className="text-xl">M</span>
                <span className="font-bold text-[3.5rem]">1000</span>
                <span className="text-xl">p/m</span>
              </div>
              <p className="text-[#FF0000] px-5">Plus M150 Registration Fee</p>
              <ul className="list-none space-y-2">
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Free Personal Trainer</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Progressive Training Schedule</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Results Guaranteed</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Showers</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Meal Plan</li>
              </ul>
              <Link
                href="/"
                className="relative text-white flex items-center gap-2 bg-[#ff0000] font-bold px-4 py-2 after:h-[3.5rem] after:absolute after:w-[14rem] after:duration-300 after:ease-linear after:border after:border-[#ff0000] after:-top-3 after:-right-3 hover:after:top-0 hover:after:right-0 mt-4 lg:mt-6 focus:outline-none"
              >
                <span>PURCHASE NOW</span>
                <span>
                  <i className="fa-solid fa-arrow-right undefined"></i>
                </span>
              </Link>
            </div>
          </div>
          {/* Pricing Plan 4 - Students */}
          <div className="flex flex-col group">
            <div className="relative">
              <Image
                src="/images/hero/IMG_2319.jpg"
                alt="students"
                width={500}
                height={400}
                className="grayscale group-hover:grayscale-0 duration-300 ease-linear w-full"
              />
              <div className="absolute inset-0 bg-purple-800 opacity-100 transition-opacity duration-300 ease-linear group-hover:opacity-50"></div>
              <div className="bg-white font-bold text-xl py-4 text-center absolute -bottom-5 left-12 right-12 group-hover:text-[#ff0000] duration-300 ease-linear">
                Student Plan
              </div>
            </div>
            <div className="bg-white pb-12 pt-8 shadow-xl flex flex-col items-center justify-center gap-6 lg:gap-4">
              <div className="flex gap-2 items-center lg:mb-2">
                <span className="text-xl">M</span>
                <span className="font-bold text-[3.5rem]">300</span>
                <span className="text-xl">p/m</span>
              </div>
              <p className="text-[#FF0000] px-5">Plus M150 Registration Fee</p>
              <ul className="list-none space-y-2">
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Free Personal Trainer</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Progressive Training Schedule</li>
                <li className="flex items-center"><FaCheckCircle className="text-[#00FF00] mr-2" /> Results Guaranteed</li>
                <li className="flex items-center"><FaTimesCircle className="text-[#FF0000] mr-2" /> Meal Plan</li>
              </ul>
              <Link
                href="/"
                className="relative text-white flex items-center gap-2 bg-[#ff0000] font-bold px-4 py-2 after:duration-300 after:ease-linear after:border after:border-[#ff0000] after:-top-3 after:-right-3 hover:after:top-0 hover:after:right-0 mt-4 lg:mt-6 focus:outline-none"
              >
                <span>PURCHASE NOW</span>
                <span>
                  <i className="fa-solid fa-arrow-right undefined"></i>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingChart;
