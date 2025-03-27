import Navlinks from '@/app/ui/nav-links';
import Link from 'next/link';

export default function Navbar() {
  return(
    <header className='h-full flex flex-row justify-around py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm'>
      <Link
      href="/"
      >
        This is where the logo goes.
      </Link>
      <Navlinks />
    </header>
  );
}
