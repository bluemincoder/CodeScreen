"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import ConvexProviderWithAuth from "./ConvexProvider";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "react-hot-toast";

function RoleRedirect({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // If user is authenticated but doesn't have a role and not already on role selection page
    if (
      session?.user &&
      !(session.user as any).role &&
      pathname !== "/auth/role-selection" &&
      !pathname.startsWith("/auth/signin")
    ) {
      router.push("/auth/role-selection");
    }
  }, [session, status, router, pathname]);

  return <>{children}</>;
}

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
          <RoleRedirect>{children}</RoleRedirect>
          <Toaster />
        </ThemeProvider>
      </ConvexProviderWithAuth>
    </SessionProvider>
  );
}
