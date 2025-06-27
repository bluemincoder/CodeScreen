"use client";

import { SessionProvider } from "next-auth/react";
import ConvexProviderWithAuth from "./ConvexProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ConvexProviderWithAuth>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </ConvexProviderWithAuth>
    </SessionProvider>
  );
}
