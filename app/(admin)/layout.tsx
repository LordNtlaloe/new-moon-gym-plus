import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSideBar";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className='flex h-screen bg-white text-[#51358C] overflow-hidden'>
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-80' />
        <div className='absolute inset-0 backdrop-blur-sm' />
      </div>
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto bg-violet-200 px-2 z-10">
        <DashboardHeader />
        <div className="bg-white mt-2 p-2 rounded mb-3 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </main>
  );
};

export default layout;
