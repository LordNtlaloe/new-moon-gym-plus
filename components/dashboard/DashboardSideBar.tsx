import React , { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DashboardSidebarMenu from "./DashboardSidebarMenu";

const DashboardSidebar = () => {
  return (
    <main className="hidden md:flex z-10">
      <DashboardSidebarMenu />
    </main>
  );
};

export default DashboardSidebar;