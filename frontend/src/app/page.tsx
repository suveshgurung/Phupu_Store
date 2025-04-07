'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import axios, { AxiosResponse } from 'axios';
import Link from 'next/link';
import HeroSection from '@/app/ui/hero-section';
import CategoryFilter from '@/app/ui/category-filter';
import FoodItem from '@/app/types/food-item';
import ServerResponseData from '@/app/types/server-response';
import ErrorCodes from '@/app/types/error-codes';
import useUserContext from '@/app/hooks/use-user-context';
import useToastContext from '@/app/hooks/use-toast-context';
import useCartContext from '@/app/hooks/use-cart-context';
import useFoodItemsContext from '@/app/hooks/use-food-items-context';
import api from '@/app/utilities/api';

export default function Home() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [showPopularOnly, setShowPopularOnly] = useState<boolean>(false);
  
  const { setCart } = useCartContext();
  const { foodItems } = useFoodItemsContext();
  const { user } = useUserContext();
  const { showToast } = useToastContext();

  // Add item to cart
  const addToCart = async (item: FoodItem) => {
    if (!user) {
      return showToast("You must be logged in!", "warning");
    }

    // Update cart data in backend.
    try {
      const response: AxiosResponse = await api.post("/api/cart", {
        product_id: item.id 
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true 
      });
      const responseData: ServerResponseData = response.data;

      if (responseData.success === true) {
        // update the cart state variable.
        setCart(prevCart => {
          // check if the item already exists in cart.
          const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
          if (existingItem) {
            return prevCart.map(cartItem => 
              cartItem.item.id === item.id 
                ? { ...cartItem, quantity: cartItem.quantity + 1 } 
                : cartItem
            );
          } 
          else {
            return [...prevCart, { item, quantity: 1 }];
          }
        });

        return showToast("Item added to cart!", "success");
      }
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_QUANTITY_NOT_UPDATED) {
          return showToast("Product quantity can't be updated! Try again later.", "error");
        }
      }
      else {
        return showToast("An unexpected error occurred!", "error");
      }
    }
  };
  
  // Remove item from cart
  // const removeFromCart = async (itemId: number) => {
  //   try {
  //     const response: AxiosResponse = await api.delete(`/api/cart/${itemId}`, {
  //       withCredentials: true
  //     });
  //
  //     const responseData: ServerResponseData = response.data;
  //
  //     if (responseData.success === true) {
  //       setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
  //       return;
  //     }
  //   }
  //   catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_DOES_NOT_EXIST) {
  //         return showToast("The product is not added to be deleted!", "error");
  //       }
  //       else if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_NOT_DELETED) {
  //         return showToast("The product could not be deleted!", "error");
  //       }
  //     }
  //     else {
  //       return showToast("An unexpected error occurred!", "error");
  //     }
  //   }
  // };
  
  // Update item quantity in cart
  // const updateQuantity = async (itemId: number, newQuantity: number) => {
  //   if (newQuantity < 1) {
  //     removeFromCart(itemId);
  //     return;
  //   }
  //
  //   try {
  //     const response: AxiosResponse = await api.patch("/api/cart", {
  //       quantity: newQuantity,
  //       product_id: itemId
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       withCredentials: true
  //     });
  //
  //     const responseData: ServerResponseData = response.data;
  //
  //     if (responseData.success === true) {
  //       setCart(prevCart => 
  //         prevCart.map(cartItem => 
  //           cartItem.item.id === itemId 
  //             ? { ...cartItem, quantity: newQuantity } 
  //             : cartItem
  //         )
  //       );
  //     }
  //   }
  //   catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_DOES_NOT_EXIST) {
  //         return showToast("Product quantity can't be updated. Product must be added first!", "error");
  //       }
  //       else if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_QUANTITY_NOT_UPDATED) {
  //         return showToast("Product quantity can't be updated! Try again later.", "error");
  //       }
  //     }
  //     return showToast("An unexpected error occured!", "error");
  //   }
  // };

  if (!foodItems) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

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
                    <Link
                      href={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      key={item.id}
                      className="block flex flex-col h-full"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.product_image_url} 
                          alt={item.name} 
                          fill
                          className="w-full h-full object-cover"
                        />
                        {item.popular && (
                          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <span className="text-red-600 font-medium">${item.price.toFixed(2)}</span>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 h-10 mb-4">{item.description}</p>

                        <div className="flex-grow"></div>

                        <div className="mt-auto flex justify-between items-center">
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            {item.category}
                          </span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(item);
                            }}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer transition-colors text-sm"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>
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
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
