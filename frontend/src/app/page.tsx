'use client'

import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { AxiosResponse } from 'axios';
import HeroSection from '@/app/ui/hero-section';
import CategoryFilter from '@/app/ui/category-filter';
import FoodItem from '@/app/types/food-item';
import CartItems from '@/app/types/cart-info';
import ServerResponseCartData from '@/app/types/server-response-cart-data';
import useUserContext from '@/app/hooks/use-user-context';
import useToastContext from '@/app/hooks/use-toast-context';
import api from '@/app/utilities/api';
import ServerResponseData from '@/app/types/server-response';

// Sample food items data
const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Classic Momo",
    description: "Steamed dumplings filled with spiced minced meat or vegetables",
    price: 8.99,
    category: "Nepali",
    imageUrl: "/api/placeholder/300/200",
    popular: true
  },
  {
    id: 2,
    name: "Chicken Biryani",
    description: "Fragrant basmati rice cooked with tender chicken and aromatic spices",
    price: 12.99,
    category: "Indian",
    imageUrl: "/api/placeholder/300/200",
    popular: true
  },
  {
    id: 3,
    name: "Veggie Chow Mein",
    description: "Stir-fried noodles with fresh vegetables and savory sauce",
    price: 9.99,
    category: "Chinese",
    imageUrl: "/api/placeholder/300/200",
    popular: false
  },
  {
    id: 4,
    name: "Butter Chicken",
    description: "Tender chicken cooked in a rich and creamy tomato-based sauce",
    price: 14.99,
    category: "Indian",
    imageUrl: "/api/placeholder/300/200",
    popular: true
  },
  {
    id: 5,
    name: "Spicy Thukpa",
    description: "Hot and spicy noodle soup with vegetables and your choice of protein",
    price: 10.99,
    category: "Tibetan",
    imageUrl: "/api/placeholder/300/200",
    popular: false
  },
  {
    id: 6,
    name: "Dal Bhat",
    description: "Traditional Nepali meal with lentil soup, rice, and various side dishes",
    price: 16.99,
    category: "Nepali",
    imageUrl: "/api/placeholder/300/200",
    popular: true
  },
  {
    id: 7,
    name: "Tandoori Chicken",
    description: "Marinated chicken cooked in a traditional clay oven",
    price: 13.99,
    category: "Indian",
    imageUrl: "/api/placeholder/300/200",
    popular: false
  },
  {
    id: 8,
    name: "Vegetable Pakora",
    description: "Mixed vegetables dipped in spiced chickpea batter and deep-fried",
    price: 7.99,
    category: "Indian",
    imageUrl: "/api/placeholder/300/200",
    popular: false
  },
  {
    id: 9,
    name: "Chicken Chilli",
    description: "Crispy fried chicken tossed with bell peppers and spicy sauce",
    price: 11.99,
    category: "Nepali-Chinese",
    imageUrl: "/api/placeholder/300/200",
    popular: true
  },
  {
    id: 10,
    name: "Sel Roti",
    description: "Traditional Nepali sweet ring-shaped rice bread",
    price: 5.99,
    category: "Nepali",
    imageUrl: "/api/placeholder/300/200",
    popular: false
  },
  {
    id: 11,
    name: "Aloo Paratha",
    description: "Whole wheat flatbread stuffed with spiced mashed potatoes",
    price: 6.99,
    category: "Indian",
    imageUrl: "/api/placeholder/300/200",
    popular: false
  },
  {
    id: 12,
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 4.99,
    category: "Indian",
    imageUrl: "/api/placeholder/300/200",
    popular: true
  }
];

export default function Home() {
  // State for cart items
  const [cart, setCart] = useState<CartItems[]>([]);
  const [showCart, setShowCart] = useState<boolean>(false);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [showPopularOnly, setShowPopularOnly] = useState<boolean>(false);
  
  // Get unique categories for filter dropdown
  const categories = ['All', ...Array.from(new Set(foodItems.map(item => item.category)))];
  
  // Filter food items based on search, category, and price
  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesPopular = showPopularOnly ? item.popular : true;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesPopular;
  });

  const { user } = useUserContext();
  const { showToast } = useToastContext();

  // Get the user cart items.
  useEffect(() => {
    const getCartItems = async () => {
      if (user) {
        try {
          const response: AxiosResponse = await api.get("/api/cart", {
            withCredentials: true,
          });

          const responseData: ServerResponseData<ServerResponseCartData[]> = response.data;

          if (responseData.success === true) {
            const cartData = responseData.data?.map(({ product_id, quantity }) => {
              const item = foodItems.find(food => food.id === product_id);
              if (!item) {
                return null;
              }

              return { item, quantity };
            })
            .filter(Boolean) as { item: FoodItem, quantity: number }[];

            setCart(cartData);
          }
        }
        catch (error: unknown) {
          showToast("An unexpected error occured!", "error");
        }
      }
    };

    getCartItems();
  }, [user, showToast]);
  
  // Add item to cart
  const addToCart = (item: FoodItem) => {
    if (!user) {
      showToast("You must be logged in!", "warning");
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevCart, { item, quantity: 1 }];
      }
    });
    // TODO: send the cart information to the backend.
  };
  
  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
  };
  
  // Update item quantity in cart
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(cartItem => 
        cartItem.item.id === itemId 
          ? { ...cartItem, quantity: newQuantity } 
          : cartItem
      )
    );
  };
  
  // Calculate total price of items in cart
  const cartTotal = cart.reduce((total, cartItem) => 
    total + (cartItem.item.price * cartItem.quantity), 0
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      {/* Filters and food menu section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Menu</h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Category Filters */}
          <CategoryFilter setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} priceRange={priceRange} setPriceRange={setPriceRange} showPopularOnly={showPopularOnly} setShowPopularOnly={setShowPopularOnly} categories={categories} />
          
          {/* Right Content - Food Items Grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        width={300}
                        height={300}
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                      {item.popular && (
                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className="text-red-600 font-medium">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{item.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          {item.category}
                        </span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer transition-colors text-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setPriceRange([0, 20]);
                    setShowPopularOnly(false);
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Cart Button */}
      {user && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setShowCart(!showCart)}
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-white w-6 h-6 rounded-full flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      )}
      
      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
          <div className="absolute top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl transform transition-transform">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4">
                {cart.length > 0 ? (
                  cart.map(cartItem => (
                    <div key={cartItem.item.id} className="flex items-center py-4 border-b">
                      <div className="w-16 h-16 rounded overflow-hidden mr-4">
                        <Image
                          width={200}
                          height={200}
                          src={cartItem.item.imageUrl}
                          alt={cartItem.item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{cartItem.item.name}</h3>
                        <p className="text-red-600">${cartItem.item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l"
                        >
                          -
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100">
                          {cartItem.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ShoppingCart size={64} className="text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="p-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Total:</span>
                    <span className="font-semibold text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
