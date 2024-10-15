import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaCopyright, FaFacebookF, FaTwitter, FaPinterestP, FaYoutube } from "react-icons/fa";


function Footer() {
  return (
    <section id="footer" className="border-t shadow-neutral-900">
      <footer className="bg-white px-8 py-16 lg:py-24 text-center flex flex-col lg:flex-row lg:text-left gap-16 lg:justify-between lg:px-32">
        <div className="space-y-6 lg:w-96">
          <div className="space-y-4">
            <div>
              <Image
                src="/images/logo.png"
                alt="logo"
                width={60}
                height={60}
                className="m-auto lg:m-0"
              />
              <h1 className="text-[#FF0000] font-bold">NEW MOON GYM PLUS</h1>
            </div>
            <p className="text-[0.9rem]">
              Take your health and body to the next level with our comprehensive
              program designed to help you reach your fitness goals.
            </p>
          </div>
          <div className="flex items-center gap-4 justify-center lg:justify-start">
            <Link
              href="https://www.facebook.com"
              className="bg-[#efefef] w-12 h-12 text-lg flex items-center justify-center rounded-full hover:bg-[#FF0000] hover:text-white duration-300 ease-linear"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="https://www.twitter.com"
              className="bg-[#efefef] w-12 h-12 text-lg flex items-center justify-center rounded-full hover:bg-[#FF0000] hover:text-white duration-300 ease-linear"
            >
              <FaTwitter />
            </Link>
            <Link
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="bg-[#efefef] w-12 h-12 text-lg flex items-center justify-center rounded-full hover:bg-[#FF0000] hover:text-white duration-300 ease-linear"
            >
              <FaPinterestP />
            </Link>
            <Link
              href="https://www.youtube.com"
              className="bg-[#efefef] w-12 h-12 text-lg flex items-center justify-center rounded-full hover:bg-[#FF0000] hover:text-white duration-300 ease-linear"
            >
              <FaYoutube />
            </Link>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="space-y-6">
            <div className="relative">
              <h1 className="font-bold text-2xl">Our Session</h1>
              <span className="top-8 left-[5.75rem] lg:left-0 absolute w-16 h-[4px] bg-[#FF0000]"></span>
            </div>
            <div className="flex flex-col gap-4 items-center lg:items-baseline">
              <Link href="/" className="hover:text-[#ff0000] hover:font-bold">
                Weightloss Therapy
              </Link>
              <Link href="/" className="hover:text-[#ff0000] hover:font-bold">
                Bodybuilding
              </Link>
              <Link href="/" className="hover:text-[#ff0000] hover:font-bold">
                Cardio
              </Link>
              <Link href="/" className="hover:text-[#ff0000] hover:font-bold">
                Nutrition & Meal Plans
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <div className="relative">
              <h1 className="font-bold text-2xl">Working Hours</h1>
              <span className="top-8 left-[4.45rem] lg:left-0 absolute w-16 h-[4px] bg-[#FF0000]"></span>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-bold">Mon - Fri:</span> 05:00 - 19:00
              </p>
              <p>
                <span className="font-bold">Sat:</span> 06:00 - 10:00
              </p>
              <p>
                <span className="font-bold">Sun:</span> Closed
              </p>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-[#FF0000] h-24 flex items-center justify-around px-8">
        <div className="flex items-center space-x-1 text-white">
          <FaCopyright />
          <p>
            {new Date().getFullYear()} New Moon Gym Plus | Privacy Policy
          </p>
        </div>
        <div className="text-white text-sm">
          <p>
            Developed by{" "}
            <a
              href="https://your-portfolio-url.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Teboho Ntlaloe
            </a>
          </p>
        </div>
      </div>

    </section>
  );
}

export default Footer;
