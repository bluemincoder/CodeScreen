import type { Metadata } from "next";
import localFont from "next/font/local";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Navbar from "@/components/Navbar";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* Ultra-smooth background gradients */}
          <div className="fixed inset-0 bg-blue-100/30 dark:bg-black/70 backdrop-blur-[100px] pointer-events-none" />

          <div className="min-h-[calc(100vh-150px)] relative z-10">
            <div className="md:px-8 px-4">
              <Navbar />
            </div>
            <main className="px-4 sm:px-6 lg:px-8">{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
