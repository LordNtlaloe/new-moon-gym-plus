import React from "react";

function Banner({ page }: { page: string }) {
  return (
    <section id="banner">
      <div className="relative h-[45vh] bg-[url('/images/hero/IMG-20230102-WA0000.jpg')] bg-[50%] bg-no-repeat bg-cover flex items-end justify-center p-8">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative text-3xl font-bold text-white z-10">{page}</h1>
      </div>
    </section>
  );
}

export default Banner;
