import { Search, UserIcon } from "lucide-react";
import React from "react";
import { SignedIn, UserButton, SignedOut, SignOutButton } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import DashboardMobileNav from "./DashboardMobileNav";

const DashboardHeader = () => {
  return (
    <div className="z-10 flex flex-col gap-2 w-full">
      {/* Top bar for larger screens */}
      <div className="hidden md:grid md:grid-cols-3 items-center bg-white p-4 rounded-md shadow-md">
        {/* Search input */}
        <div className="flex items-center bg-slate-100 rounded-full p-2 px-4 gap-2 w-full">
          <Search className="text-gray-500" />
          <input
            type="text"
            className="bg-slate-100 outline-none w-full placeholder-gray-500"
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
                <UserIcon size={24} className="cursor-pointer text-gray-500" />
              </SignedOut>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-lg rounded-lg p-2 mt-2">
              <SignedIn>
                <DropdownMenuItem>
                  <button className="w-full text-left">Profile</button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton>
                    <button className="w-full text-left">Logout</button>
                  </SignOutButton>
                </DropdownMenuItem>
              </SignedIn>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation for smaller screens */}
      <div className="md:hidden h-20 bg-blue-950 text-white flex items-center justify-between px-4 shadow-lg rounded-md">
        <DashboardMobileNav />
      </div>
    </div>
  );
};

export default DashboardHeader;
