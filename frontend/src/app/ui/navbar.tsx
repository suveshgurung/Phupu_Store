import Navlinks from '@/app/ui/nav-links';
import Link from 'next/link';

export default function Navbar() {
  return(
    <header className='sticky top-0 left-0 w-full flex flex-row justify-around items-center py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-md'>
      <Link
      href="/"
      className="md:w-[30%] pl-[5%]"
      >
        This is where the logo goes.
      </Link>
      <Navlinks />
    </header>
  );
}
