"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import DasboardBtn from "./DasboardBtn";
import LoginButton from "./LoginButton";
import { Blocks, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Navbar() {
  const { data: session, status } = useSession();

  // Type assertion to use our custom session type with role
  const typedSession = session as any;

  return (
    <nav className="flex flex-row h-16 sm:h-20 items-center justify-between ">
      <div className="flex flex-row items-center justify-between w-full">
        {/* LEFT SIDE - LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 group relative"
        >
          {/* Hover Effect Background */}
          <div
            className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
              group-hover:opacity-100 transition-all duration-500 blur-xl"
          />

          {/* Logo Icon */}
          <div
            className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-1.5 sm:p-2 rounded-lg sm:rounded-xl ring-1
              ring-white/10 group-hover:ring-white/20 transition-all"
          >
            <Blocks className="size-4 sm:size-5 md:size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
          </div>

          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 text-transparent bg-clip-text">
              CodeScreen
            </span>
            <span className="hidden md:block text-xs text-blue-400/60 font-medium whitespace-nowrap">
              Interactive Interview Platform
            </span>
          </div>
        </Link>

        {/* RIGHT SIDE - NAVIGATION & AUTH */}
        <div className="flex items-center justify-end gap-2 sm:gap-4">
          {/* Auth Section */}
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
          ) : typedSession ? (
            <div className="flex items-center gap-2">
              {/* Dashboard Button for Interviewers */}
              {typedSession.user?.role === "interviewer" && <DasboardBtn />}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={typedSession.user?.image || undefined}
                        alt={typedSession.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {typedSession.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {typedSession.user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {typedSession.user?.email || "No email"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {typedSession.user?.role || "Unknown"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
