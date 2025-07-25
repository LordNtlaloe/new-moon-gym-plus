"use client";

import React, { useEffect, useState } from "react";
import { useUser, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { getUserRoleByClerkId } from "@/app/_actions/users.actions";
import { FaUserCircle } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserButton = () => {
  const { user } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.id) {
        const result = await getUserRoleByClerkId(user.id); // Use the new function

        if (result.error) {
          setError(result.error);
        } else {
          setUserRole(result?.role || null);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = userRole === "Admin";
  const isTrainer = userRole === "Trainer";
  const isMember = userRole === "member" || !userRole; // Consider users with no role as members

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <FaUserCircle size={24} />
              <span>{user?.firstName || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(isAdmin || isTrainer) && (
              <DropdownMenuItem asChild>
                <Link href="/online-sessions">Online Sessions</Link>
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin">Dashboard</Link>
              </DropdownMenuItem>
            )}
            {(isAdmin || isTrainer || isMember) && (
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <SignOutButton>
                <button>Sign Out</button>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>

      <SignedOut>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <FaUserCircle size={24} />
              <span>Guest</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/sign-up">Sign Up</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sign-in">Sign In</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedOut>
    </div>
  );
};

export default UserButton;