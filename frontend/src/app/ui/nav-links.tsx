'use client'

import Link from 'next/link';
import clsx from 'clsx'
import { usePathname } from 'next/navigation';

const links = [
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
  const pathname = usePathname();
  return (
    <div className="flex flex-row justify-center space-x-5">
      {links.map((link) => {
        return (
          <Link
          key={link.name}
          href={link.href}
          className={clsx(
            "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
            {
              'bg-sky-100 text-blue-600': pathname === link.href,
            },
          )}
          >
          <p className="hidden md:block">{link.name}</p>
          </Link>
        )

      })}
    </div>
  );
}
