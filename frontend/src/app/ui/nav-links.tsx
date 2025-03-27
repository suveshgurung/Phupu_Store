import Link from 'next/link';
import clsx from 'clsx'

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
  return (
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
  );
}
