import type { Metadata } from "next";
import localFont from "next/font/local";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import ConvexClerkProvider from "@/components/providers/ConvexClerkProvider";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "CodeScreen",
    description: "Online Interview Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {/* Ultra-smooth background gradients */}
                        <div className="fixed inset-0 bg-gradient-to-br from-blue-100/30 via-transparent dark:from-blue-900/5 dark:via-transparent to-purple-100/5 dark:to-purple-900/15 backdrop-blur-[100px] pointer-events-none" />

                        <SignedIn>
                            <div className="min-h-[calc(100vh-150px)] relative z-10">
                                <div className="mt-4 px-4 sm:px-6 lg:px-8">
                                    <Navbar />
                                </div>
                                <main className="px-4 sm:px-6 lg:px-8">
                                    {children}
                                </main>
                            </div>
                            <Footer />
                        </SignedIn>

                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </ThemeProvider>
                    <Toaster />
                </body>
            </html>
        </ConvexClerkProvider>
    );
}
