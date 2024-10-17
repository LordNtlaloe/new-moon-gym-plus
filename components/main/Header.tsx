"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useTogglerContext } from "@/app/context/toggler";
import { usePathname } from "next/navigation";
import { FaBars } from 'react-icons/fa';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import UserButton from "../auth/UserButton";

function Header() {
  const { setMobileNavbar, setAboutSidebar } = useTogglerContext();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onPageScroll = () => {
      headerRef.current!.style.backgroundColor =
        window.pageYOffset > 20 ? "black" : "transparent";
    };
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);

  return (
    <section id="header">
      <header
        className="fixed inset-x-0 top-0 duration-300 ease-linear text-white flex justify-between items-center py-6 px-8 z-50"
        ref={headerRef}
      >
        <div>
          <Link href="/">
            <Image
              src="/images/logo/logo.png"
              alt="logo"
              width={60}
              height={60}
            />
          </Link>
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={`hover:text-[#ff0000] ${usePathname() === "/" ? "text-[#ff0000]" : ""
              } duration-300 ease-linear`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`hover:text-[#ff0000] ${usePathname() === "/about" ? "text-[#ff0000]" : ""
              } duration-300 ease-linear`}
          >
            About
          </Link>
          <Link
            href="/schedule"
            className={`hover:text-[#ff0000] ${usePathname() === "/schedule" ? "text-[#ff0000]" : ""
              } duration-300 ease-linear`}
          >
            Schedule
          </Link>
          {/* <Link
            href="/gallery"
            className={`hover:text-[#ff0000] ${usePathname() === "/gallery" ? "text-[#ff0000]" : ""
              } duration-300 ease-linear`}
          >
            Gallery
          </Link>
          <Link
            href="/blog"
            className={`hover:text-[#ff0000] ${usePathname() === "/blog" ? "text-[#ff0000]" : ""
              } duration-300 ease-linear`}
          >
            Blog
          </Link> */}
          <Link
            href="/contact"
            className={`hover:text-[#ff0000] ${usePathname() === "/contact" ? "text-[#ff0000]" : ""
              } duration-300 ease-linear`}
          >
            Contact
          </Link>
          <Link
            href="/pricing"
            className={`hover:text-[#ff0000] ${usePathname() === "/pricing" ? "text-[#ff0000]" : ""
              } duration-300 ease-linear`}
          >
            Pricing
          </Link>
          <Link
            href="/classes"
            className={`hover:text-[#ff0000] ${usePathname() === "/classes" ? "text-[#ff0000]" : ""
              } duration-300 ease-linear`}
          >
            Sessions
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileNavbar(true)}
            className="text-2xl hover:text-[#ff0000] ease-in duration-200 lg:hidden"
          >
            <FaBars size={24} />
          </button>
          <div className="">
            <UserButton />
          </div>

          {/* Dropdown for Join Us Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="border-[rgb(255,255,255,0.3)] border-2 py-2 px-2 rounded-md flex items-center gap-4">
                <i className="fa-solid fa-plus bg-[#ff0000] text-white p-2.5 rounded-md group-hover:rotate-[180deg] duration-300 ease-linear"></i>
                <h3 className="text-white text-[0.875rem] mr-4 font-bold uppercase tracking-wider">
                  Join Us
                </h3>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/waiting-list">Sign-Up For Our Waiting List</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/book-consultation">Book A Consultation</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </section>
  );
}

export default Header;
