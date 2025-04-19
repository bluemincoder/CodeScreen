import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import DasboardBtn from "./DasboardBtn";
import LoginButton from "./LoginButton";
import { Blocks } from "lucide-react";

function Navbar() {
  return (
      <nav className="">
          <div className="flex h-16 items-center container mx-auto bg-transparent">
              {/* LEFT SIDE -LOGO */}
              <Link
                  href="/"
                  className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 group relative"
              >
                  {/* Logo hover effect */}
                  <div
                      className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                            group-hover:opacity-100 transition-all duration-500 blur-xl"
                  />

                  {/* Logo */}
                  <div
                      className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-1 xs:p-1.5 sm:p-2 rounded-lg sm:rounded-xl ring-1
                            ring-white/10 group-hover:ring-white/20 transition-all"
                  >
                      <Blocks className="size-3.5 xs:size-4 sm:size-5 md:size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                  </div>

                  <div className="flex flex-col">
                      <span className="block text-2xl xs:text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 text-transparent bg-clip-text ">
                          CodeScreen
                      </span>
                      <span className="hidden md:block text-xs text-blue-400/60 font-medium">
                          Interactive Interview Platform
                      </span>
                  </div>
              </Link>

              {/* RIGHT SIDE - ACTIONS */}
              <div className="flex items-center space-x-4 ml-auto">
                  <SignedIn>
                      <DasboardBtn />
                  </SignedIn>
                  <ModeToggle />
                  <SignedIn>
                      <UserButton />
                  </SignedIn>
                  <SignedOut>
                      <LoginButton />
                  </SignedOut>
              </div>
          </div>
      </nav>
  );
}
export default Navbar;
