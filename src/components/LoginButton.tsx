"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

function LoginButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg
             transition-all duration-200 font-medium shadow-lg"
    >
      <LogIn className="w-4 h-4 transition-transform" />
      <span className="max-sm:hidden">Sign In</span>
    </button>
  );
}

export default LoginButton;
