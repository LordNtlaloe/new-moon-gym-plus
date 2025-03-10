"use client";

import { dashboardMenu } from "@/lib/constants";
import { Menu } from "lucide-react";
import Link from "next/link";
import logo from "/public/images/logo.png";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const DashboardSidebarMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname(); // Get the current path

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-[#1D1D1D] text-white backdrop-blur-md px-4 flex flex-col shadow-sm shadow-gray-400">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 flex items-center justify-between space-x-2"
        >
          <Menu size={24} className="rounded-full hover:text-[#0D0D0D] transition-colors" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image src={logo} width={60} height={60} alt="Pawreedy Logo" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <nav className="mt-0 flex-grow">
          {dashboardMenu.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <motion.div
                className={`flex items-center p-4 text-sm font-medium rounded-lg mb-2 transition-all ${
                  pathname === item.href ? "bg-[#2d2d2d] text-white" : "hover:bg-[#1D1D1D] text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon
                  size={20}
                  style={{
                    color: pathname === item.href ? "#0D0D0D" : "white",
                    minWidth: "20px",
                    transition: "color 0.2s",
                  }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default DashboardSidebarMenu;
