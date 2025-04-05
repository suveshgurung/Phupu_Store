interface CategoryFilterProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  showPopularOnly: boolean;
  setShowPopularOnly: React.Dispatch<React.SetStateAction<boolean>>;
  categories: string[];
};

export default function CategoryFilter({ setSearchTerm, selectedCategory, setSelectedCategory, priceRange, setPriceRange, showPopularOnly, setShowPopularOnly, categories }: CategoryFilterProps) {
  return (
    <div className="w-full md:w-1/4 lg:w-1/5">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-lg mb-4">Categories</h3>

        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="form-radio h-4 w-4 text-red-600"
              />
              <span className="text-gray-700">{category}</span>
            </label>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-4">Price Range</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>

        <div className="mt-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPopularOnly}
              onChange={() => setShowPopularOnly(!showPopularOnly)}
              className="form-checkbox h-4 w-4 text-red-600"
            />
            <span className="text-gray-700">Popular Items Only</span>
          </label>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('All');
            setPriceRange([0, 20]);
            setShowPopularOnly(false);
            setSearchTerm('');
          }}
          className="mt-6 w-full py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}
