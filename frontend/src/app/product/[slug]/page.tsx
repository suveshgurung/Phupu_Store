'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import api from '@/app/utilities/api';
import useUserContext from '@/app/hooks/use-user-context';
import useToastContext from '@/app/hooks/use-toast-context';
import useCartContext from '@/app/hooks/use-cart-context';
import axios, { AxiosResponse } from 'axios';
import FoodItem from '@/app/types/food-item';
import ServerResponseData from '@/app/types/server-response';
import ErrorCodes from '@/app/types/error-codes';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [product, setProduct] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  const { user } = useUserContext();
  const { showToast } = useToastContext();
  const { setCart } = useCartContext();

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);

        const response: AxiosResponse = await api.get(`/api/product/${slug}`);
        const responseData: ServerResponseData<FoodItem> = response.data;
        
        if (responseData.success && responseData.data) {
          setProduct(responseData.data);
        } else {
          setError('Product not found');
        }
      } 
      catch (error) {
        setError('Failed to load product details');
      } 
      finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductDetail();
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) {
      return showToast("You must be logged in!", "warning");
    }
    
    if (!product) return;

    try {
      // Add to cart multiple times based on quantity
      const response: AxiosResponse = await api.post("/api/cart", {
        product_id: product.id,
        quantity: quantity
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
          const existingItem = prevCart.find(cartItem => cartItem.item.id === product.id);
          if (existingItem) {
            return prevCart.map(cartItem => 
              cartItem.item.id === product.id 
                ? { ...cartItem, quantity: quantity } 
                : cartItem
            );
          } 
          else {
            return [...prevCart, { product, quantity: quantity }];
          }
        });
        showToast(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`, "success");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_QUANTITY_NOT_UPDATED) {
          showToast("Product quantity can't be updated! Try again later.", "error");
        }
      }
      showToast("An unexpected error occurred!", "error");
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || 'Product not found'}
        </h2>
        <Link href="/" className="text-red-600 hover:text-red-700 flex items-center justify-center gap-2">
          <ArrowLeft size={16} />
          Back to home page
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:mt-14">
      <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-6">
        <ArrowLeft size={16} className="mr-2" />
        Back to home page
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="relative h-72 md:h-full">
              <Image
                src={product.product_image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.popular && (
                <span className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                  Popular
                </span>
              )}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {product.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-red-600 text-xl font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>
            
            {/* Quantity selector */}
            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border-l border-r">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center cursor-pointer"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
