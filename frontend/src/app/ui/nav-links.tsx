'use client'

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx'

interface Navlinks {
  name: string,
  href: string,
};

const links: Navlinks[] = [
  {
    name: "Login",
    href: "/login",
  },
  {
    name: "Sign Up",
    href: "/signup",
  }
];

export default function Navlinks() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      {/* For desktop */}
      <div className="flex flex-row justify-center gap-4">
        {links.map((link) => {
          return (
            <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "hidden md:flex h-[38px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-[#e06d3d] md:flex-none md:justify-start md:p-2 md:px-3",
              {
                'bg-[#c52128] text-white hover:bg-red-700': link.name === "Login",
                'bg-[#f5b400] text-white hover:bg-yellow-500': link.name === "Sign Up",
              },
            )}
            >
            <p className="hidden md:block">{link.name}</p>
            </Link>
          )

        })}
      </div>

      {/* For mobiles */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
        aria-label="Toggle navigation menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      
      <div className={clsx(
        "fixed inset-0 z-50 transition-opacity duration-300 md:hidden",
        {
          "opacity-0 pointer-events-none": !isDrawerOpen,
          "opacity-100": isDrawerOpen,
        }
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsDrawerOpen(false)}
        />
        
        {/* Sidebar Content */}
        <div className={clsx(
          "relative h-screen w-64 bg-white transform transition-transform duration-300 ease-in-out",
          {
            "-translate-x-full": !isDrawerOpen,
            "translate-x-0": isDrawerOpen,
          }
        )}>
          <div className="p-4">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="mb-4 text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <hr />
            
            <div className="flex flex-col space-y-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "w-full px-4 py-3 text-left rounded-md transition-colors duration-200",
                    {
                      'mt-5': link.name === "Login",
                    }
                  )}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
