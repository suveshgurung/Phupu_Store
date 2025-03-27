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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-w-screen`}
      >
        <div className='flex flex-col min-h-screen'>
          <Navbar />
          <main className="w-full flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
