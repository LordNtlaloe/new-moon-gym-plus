import Image from "next/image";
import Link from "next/link";
import React from "react";

function GymTrainers() {
  const trainers = [
    {
      name: "Mohale",
      title: "Senior Bodybuilding Instructor",
      branch: "Ha Pita", 
      image: "/images/gym-trainers/Coach_Mohale.png",
    },
    {
      name: "Jesu",
      title: "Bodybuilding Instructor",
      branch: "Ha Pita", 
      image: "/images/gym-trainers/Coach_Jesu.png",
    },
    {
      name: "Mpitso",
      title: "Senior Weightloss Instructor",
      branch: "Ha Pita", 
      image: "/images/gym-trainers/Coach_Mpitso.png",
    },
    {
      name: "Tsotelo",
      title: "Weightloss Instructor",
      branch: "Ha Pita", 
      image: "/images/gym-trainers/Coach_Tsotelo.png",
    },
    {
      name: "Thabiso",
      title: "Senior Weightloss Instructor",
      branch: "Hi-Fi City", 
      image: "/images/gym-trainers/Coach_Thabiso.png",
    },
    {
      name: "Mpolokeng",
      title: "Weightloss Instructor",
      branch: "Hi-Fi City", 
      image: "/images/gym-trainers/Coach_Mpolokeng.png",
    },
    {
      name: "Dominic",
      title: "Bodybuiding Instructor",
      branch: "Hi-Fi City", 
      image: "/images/gym-trainers/Coach_Dominic.png",
    },
    {
      name: "Palesa",
      title: "Bodybuilding Instructor",
      branch: "Hi-Fi City", 
      image: "/images/gym-trainers/Coach_Palesa.png",
    },
  ];

  return (
    <section id="gym-trainers">
      <div className="bg-[url('/images/gym-trainers/bg.png')] bg-[50%] bg-no-repeat bg-cover px-8 py-24 relative after:content-[url('/images/gym-trainers/bg-after.png')] after:absolute after:top-0 after:right-0 space-y-12">
        <div className="relative flex flex-col gap-8 lg:gap-5 items-center text-center">
          <Image
            src="/images/abstract/abstract.svg"
            alt="abstract"
            width={220}
            height={220}
            className="absolute left-[3rem] lg:left-[32.75rem] -top-1.5"
          />
          <p className="text-white relative z-10 font-bold text-center">
            GYM TRAINERS
          </p>
          <h1 className="font-bold text-4xl">Team Of Expert Coaches</h1>
          <p>
            Expert team of coaches helps you succeed in any goal,
            <br />
            personalized guidance and motivation provided!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-24 lg:gap-12 lg:px-16 max-w-screen-xl m-auto">
          {trainers.map((trainer, index) => (
            <div key={index} className="relative group cursor-pointer">
              <Image
                src={trainer.image}
                alt={trainer.name}
                width={750}
                height={750}
                className="z-10 relative grayscale mx-auto group-hover:grayscale-0 duration-300 ease-linear"
              />
              <Image
                src="/images/gym-trainers/bg-trainer.png"
                alt={trainer.name}
                width={500}
                height={500}
                className="absolute top-1 w-full lg:w-80 lg:left-8"
              />
              <div className="bg-white p-8 flex flex-col gap-2.5 items-center justify-center text-[#646464] shadow-xl rounded-lg z-20 absolute inset-x-0 -bottom-[3.75rem]">
                <Image
                  src="/images/gym-trainers/mountain-shape.png"
                  alt={trainer.name}
                  width={120}
                  height={120}
                  className="absolute -top-[1.5625rem]"
                />
                <div className="absolute h-1 bg-[#ff0000] bottom-0 left-32 right-32 lg:left-36 lg:right-36 group-hover:inset-x-0 duration-300 ease-linear"></div>
                <h3 className="font-bold text-xl text-black">{trainer.name}</h3>
                <p className="lg:-translate-y-1 text-sm">{trainer.title}</p>
                <p className="lg:-translate-y-1 text-sm text-[#FF0000] font-bold">{trainer.branch}</p>
                <div className="flex items-center gap-4">
                  <Link href="https://www.facebook.com">
                    <i className="fa-brands fa-facebook-f"></i>
                  </Link>
                  <Link href="https://www.twitter.com">
                    <i className="fa-brands fa-twitter"></i>
                  </Link>
                  <Link href="https://www.instagram.com">
                    <i className="fa-brands fa-instagram"></i>
                  </Link>
                  <Link href="https://www.gmail.com">
                    <i className="fa-regular fa-envelope"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GymTrainers;
