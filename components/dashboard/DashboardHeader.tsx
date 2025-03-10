import { Search, UserIcon } from "lucide-react";
import React from "react";
import { SignedIn, UserButton, SignedOut, SignOutButton } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import DashboardMobileNav from "./DashboardMobileNav";

const DashboardHeader = () => {
  return (
    <div className="z-10 flex flex-col gap-2 w-full">
      {/* Top bar for larger screens */}
      <div className="hidden md:grid md:grid-cols-3 items-center bg-[#1D1D1D] p-4 rounded-md shadow-md">
        {/* Search input */}
        <div className="flex items-center bg-[#2D2D2D] rounded-full p-2 px-4 gap-2 w-full">
          <Search className="text-gray-500" />
          <input
            type="text"
            className="bg-[#2D2D2D] outline-none w-full placeholder-gray-500"
            placeholder="Search Dashboard..."
          />
        </div>

        {/* Placeholder for center content if needed */}
        <div className="hidden md:flex justify-center"></div>

        {/* User profile dropdown */}
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-10">
              <SignedIn>
                <div className="rounded-full overflow-hidden">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <UserIcon size={24} className="cursor-pointer text-gray-50" />
              </SignedOut>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1D1D1D] shadow-lg rounded-lg p-2 mt-2 w-20 z-10">
              <SignedIn>
                <DropdownMenuItem>
                  <button className="w-full text-left text-white">Profile</button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton>
                    <button className="w-full text-left text-white">Logout</button>
                  </SignOutButton>
                </DropdownMenuItem>
              </SignedIn>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation for smaller screens */}
      <div className="md:hidden h-20 bg-[#0D0D0D] text-white flex items-center justify-between px-4 shadow-lg rounded-md">
        <DashboardMobileNav />
      </div>
    </div>
  );
};

export default DashboardHeader;
