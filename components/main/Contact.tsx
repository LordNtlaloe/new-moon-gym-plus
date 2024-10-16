import Link from "next/link";
import React from "react";

function Contact() {
  return (
    <section id="contact">
      <div className="py-16 lg:py-24 flex flex-col gap-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-16 lg:gap-0 max-w-screen-xl m-auto">
          <div className="space-y-8 mx-8">
            <h2 className="text-black text-[2rem] font-bold leading-[1.2]">
              We are here for help you! To Shape Your Body.
            </h2>
            <p>
              At Gymate, we are dedicated to helping you achieve the body of
              your dreams. Our expert trainers and nutritionists will work with
              you to create a personalized fitness and nutrition plan that helps
              you reach your specific goals.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col relative space-y-6">
                <h3 className="text-xl font-bold">New York City, USA</h3>
                <span className="bg-[#ff0000] w-[3.25rem] h-1 absolute top-2"></span>
                <p>
                  Ha Pita, Pela Mapoleseng
                  <br /> Maseru, Lesotho
                </p>
                <p>
                  Hi-Fi City Complex, Mohalalitoe
                  <br /> Maseru, Lesotho
                </p>
              </div>
              <div className="flex flex-col relative space-y-6">
                <h3 className="text-xl font-bold">Opening Hours</h3>
                <span className="bg-[#ff0000] w-[3.25rem] h-1 absolute top-2"></span>
                <p>
                  Mon to Fri: 04:00 — 19:00
                  <br /> Sat: 06:00 — 10:00
                  <br /> Sun: Closed
                </p>
              </div>
              <div className="flex flex-col relative space-y-6">
                <h3 className="text-xl font-bold">Contact Information</h3>
                <span className="bg-[#ff0000] w-[3.25rem] h-1 absolute top-2"></span>
                <p>
                  +266 2231 2464
                  {/* <br /> gymat@gymail.com */}
                </p>
              </div>
              <div className="flex flex-col relative space-y-8">
                <h3 className="text-xl font-bold">Follow Us On</h3>
                <span className="bg-[#ff0000] w-[3.25rem] h-1 absolute"></span>
                <div className="flex items-center gap-4 lg:gap-3">
                  <Link
                    href="https://www.facebook.com"
                    className="bg-[#efefef] w-12 h-12 text-lg flex items-center justify-center rounded-full hover:bg-[#ff0366] hover:text-white duration-300 ease-linear"
                  >
                    <i className="fa-brands fa-facebook-f"></i>
                  </Link>
                  <Link
                    href="https://www.twitter.com"
                    className="bg-[#efefef] w-12 h-12 text-lg flex items-center justify-center rounded-full hover:bg-[#ff0366] hover:text-white duration-300 ease-linear"
                  >
                    <i className="fa-brands fa-twitter"></i>
                  </Link>
                  <Link
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="bg-[#efefef] w-12 h-12 text-lg flex items-center justify-center rounded-full hover:bg-[#ff0366] hover:text-white duration-300 ease-linear"
                  >
                    <i className="fa-brands fa-pinterest-p"></i>
                  </Link>
                  <Link
                    href="https://www.youtube.com"
                    className="bg-[#efefef] w-12 h-12 text-lg flex items-center justify-center rounded-full hover:bg-[#ff0366] hover:text-white duration-300 ease-linear"
                  >
                    <i className="fa-brands fa-youtube"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-12 mx-8 p-8 bg-[#f8f8f8] relative">
            <h3 className="text-2xl font-bold">Leave Us Your Info</h3>
            <span className="bg-[#ff0000] w-16 h-1 absolute top-[4.5rem]"></span>
            <div className="flex flex-col gap-6">
              <input
                className="w-full py-3 px-5 h-[3.125rem] text-[0.875rem] border border-[#e4e4e4]"
                placeholder="Full Name *"
                type="text"
              />
              <input
                className="w-full py-3 px-5 h-[3.125rem] text-[0.875rem] border border-[#e4e4e4]"
                placeholder="Email Address *"
                type="email"
              />
              <select className="w-full py-3 px-5 h-[3.125rem] text-[#a1a1a1] text-[0.875rem] border border-[#e4e4e4]">
                <option>Select Class</option>
                <option>Body Building</option>
                <option>Boxing</option>
                <option>Running</option>
                <option>Fitness</option>
                <option>Yoga</option>
                <option>Workout</option>
                <option>Kata</option>
                <option>Meditation</option>
                <option>Cycling</option>
              </select>
              <textarea
                placeholder="Comment"
                className="w-full py-3 px-5 h-[8rem] text-[0.875rem] border border-[#e4e4e4]"
              ></textarea>
            </div>
            <button
              type="submit"
              className="text-white bg-[#ff0000] w-fit py-4 px-8 font-bold text-[0.875rem] uppercase self-center"
            >
              submit now
            </button>
          </div>
        </div>
        <div className="mt-16">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=28.245000%2C-29.505000%2C28.255000%2C-29.495000&layer=mapnik&marker=-29.500000%2C28.250000`}
            allowFullScreen={false}
            loading="lazy"
            title="map"
            className="w-full h-[30rem] border-0"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default Contact;
