'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx'

interface Navlinks {
  name: string,
  href: string,
  group: "main" | "auth",
};

const links: Navlinks[] = [
  {
    name: "Home",
    href: "/",
    group: "main",
  },
  {
    name: "About Us",
    href: "/",
    group: "main",
  },
  {
    name: "Contact Us",
    href: "/",
    group: "main",
  },
  {
    name: "Login",
    href: "/login",
    group: "auth",
  },
  {
    name: "Sign Up",
    href: "/signup",
    group: "auth",
  }
];

export default function Navlinks() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('nav-open');
      document.body.style.overflow = 'auto';
    }
  }, [isDrawerOpen]);

  return (
    <div className="relative md:w-[70%]">
      {/* For desktop */}
      <div className="hidden md:flex flex-row justify-around gap-4">
        {/* Main group */}
        <div className="flex space-x-4">
          {links.filter(link => link.group === "main").map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "h-[38px] grow items-center justify-center gap-2 rounded-md p-3 text-md font-medium hover:bg-gray-200 md:flex-none md:justify-start md:p-2 md:px-3"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Authentication group */}
        <div className="flex space-x-4">
          {links.filter(link => link.group === "auth").map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "h-[38px] grow items-center justify-center gap-2 rounded-md p-3 text-md font-medium md:flex-none md:justify-start md:p-2 md:px-3",
                {
                  'bg-[#c52128] text-white hover:bg-red-700': link.name === "Login",
                  'bg-[#f5b400] text-white hover:bg-yellow-500': link.name === "Sign Up",
                }
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
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
          className="absolute inset-0 bg-white/60"
          onClick={() => setIsDrawerOpen(false)}
        />
        
        {/* Sidebar Content */}
        <div className={clsx(
          "fixed left-0 top-0 h-full w-64 bg-white/60 transform transition-transform duration-300 ease-in-out z-50",
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
            
            <div className="flex flex-col space-y-2 mt-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={clsx(
                    "w-full px-4 py-3 text-left rounded-md transition-colors duration-200 hover:bg-gray-200",
                    {
                      'mt-5': link.name === "Home",
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
