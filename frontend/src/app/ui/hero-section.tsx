import React from 'react';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

export default function HeroSection({ searchTerm, setSearchTerm }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-r from-yellow-400 to-red-500 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Delicious Home-Made Food Delivered to Your Doorstep
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Experience the authentic taste of home-made foods with no added preservatives.
          </p>
          <div className="relative flex w-full max-w-md rounded-full overflow-hidden shadow-lg bg-white">
            <input
              type="text"
              placeholder="Search for your favorite dishes..."
              className="w-full px-4 py-3 text-gray-800 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-0 top-0 h-full px-4 text-gray-600 hover:text-gray-800">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-20">
        <div className="w-full h-full bg-contain bg-no-repeat bg-right-bottom" style={{ backgroundImage: 'url(/api/placeholder/400/400)' }}></div>
      </div>
    </section>
  );
}
