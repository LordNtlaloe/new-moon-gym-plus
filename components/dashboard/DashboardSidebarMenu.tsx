"use client";

import { dashboardMenu } from "@/lib/constants";
import { LayoutDashboardIcon, Menu, SettingsIcon, User2Icon, Users } from "lucide-react";
import Link from "next/link";
import logo from '/public/logo01.png';
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DashboardSidebarMenu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className='h-full bg-white text-[#51358C] bg-opacity-50 backdrop-blur-md p-4 flex flex-col shadow-sm shadow-violet-950'>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 max-w-fit'
        >
          <div className="flex items-center justify-between">
            <Menu size={24} className="rounded-full hover:bg-gray-700 transition-colors"/>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Image src={logo} width={120} height={60} alt="Pawreedy Logo" className="ml-2" />
              </motion.div>
            )}
          </div>
        </motion.button>

        <nav className='mt-0 flex-grow'>
          {dashboardMenu.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'
              >
                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className='ml-4 whitespace-nowrap'
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
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
