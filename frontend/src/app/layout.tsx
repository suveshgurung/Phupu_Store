import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/app/ui/navbar";
import Footer from "@/app/ui/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phupu Store",
  description: "Phupu Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen`}
      >
        <div className='flex flex-col'>
          <div className='w-full h-[8vh]'>
            <Navbar />
          </div>
          <main className="w-full h-[84vh]">
            {children}
          </main>
          <div className='w-full h-[8vh]'>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
