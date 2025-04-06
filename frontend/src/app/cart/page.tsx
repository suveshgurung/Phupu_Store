'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ArrowLeft, CreditCard, Truck } from 'lucide-react';
import Link from 'next/link';
import useCartContext from '@/app/hooks/use-cart-context';
import useUserContext from '@/app/hooks/use-user-context';
import useToastContext from '@/app/hooks/use-toast-context';
import axios, { AxiosResponse } from 'axios';
import api from '@/app/utilities/api';
import ErrorCodes from '@/app/types/error-codes';
import ServerResponseData from '@/app/types/server-response';

export default function CartPage() {
  const { cart, setCart } = useCartContext();
  const { user } = useUserContext();
  const { showToast } = useToastContext();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [loading, setLoading] = useState<boolean>(false);
  const [processingOrder, setProcessingOrder] = useState<boolean>(false);

  // Calculate totals
  const subtotal = cart.reduce((total, cartItem) => 
    total + (cartItem.item.price * cartItem.quantity), 0
  );
  const deliveryFee = 2.99;
  const tax = subtotal * 0.07; // Assuming 7% tax
  const total = subtotal + deliveryFee + tax;

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    try {
      setLoading(true);
      const response: AxiosResponse = await api.delete(`/api/cart/${itemId}`, {
        withCredentials: true
      });

      const responseData: ServerResponseData = response.data;

      if (responseData.success === true) {
        setCart(prevCart => prevCart.filter(cartItem => cartItem.item.id !== itemId));
        showToast("Item removed from cart", "success");
      }
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_DOES_NOT_EXIST) {
          showToast("The product is not added to be deleted!", "error");
        }
        else if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_NOT_DELETED) {
          showToast("The product could not be deleted!", "error");
        }
      }
      else {
        showToast("An unexpected error occurred!", "error");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Update item quantity in cart
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    try {
      setLoading(true);
      const response: AxiosResponse = await api.patch("/api/cart", {
        quantity: newQuantity,
        product_id: itemId
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const responseData: ServerResponseData = response.data;

      if (responseData.success === true) {
        setCart(prevCart => 
          prevCart.map(cartItem => 
            cartItem.item.id === itemId 
              ? { ...cartItem, quantity: newQuantity } 
              : cartItem
          )
        );
      }
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_DOES_NOT_EXIST) {
          showToast("Product quantity can't be updated. Product must be added first!", "error");
        }
        else if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_QUANTITY_NOT_UPDATED) {
          showToast("Product quantity can't be updated! Try again later.", "error");
        }
      }
      showToast("An unexpected error occurred!", "error");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showToast("Your cart is empty", "warning");
      return;
    }

    setProcessingOrder(true);
    
    // Here you would implement the actual order placement logic
    // This would typically involve an API call to your backend
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success:
      showToast("Order placed successfully!", "success");
      setCart([]);
      
      // Redirect to order confirmation page (you'd need to create this)
      // router.push('/order-confirmation');
    } catch (error) {
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your cart</h2>
        <Link href="/login" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-16">
      <div className="flex items-center mb-8">
        <Link href="/" className="flex items-center text-gray-600 hover:text-red-600 transition-colors">
          <ArrowLeft className="mr-2" size={20} />
          <span>Continue Shopping</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold ml-auto">Your Cart</h1>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2">Processing...</p>
          </div>
        </div>
      )}

      {cart.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Cart Items ({cart.reduce((acc, item) => acc + item.quantity, 0)})</h2>
              </div>
              
              <div className="divide-y">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={cartItem.item.product_image_url}
                        alt={cartItem.item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{cartItem.item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{cartItem.item.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:text-red-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1">{cartItem.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-red-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600 font-semibold">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                          <p className="text-gray-500 text-sm">${cartItem.item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden sticky top-20">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                        paymentMethod === 'card' 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'border-gray-300 hover:border-red-600'
                      }`}
                    >
                      <CreditCard size={20} className="mr-2" />
                      <span>Credit Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                        paymentMethod === 'cod' 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'border-gray-300 hover:border-red-600'
                      }`}
                    >
                      <Truck size={20} className="mr-2" />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={placeOrder}
                  disabled={processingOrder}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                >
                  {processingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Place Order • $${total.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center justify-center">
          <Image
            src="/api/placeholder/200/200" 
            alt="Empty cart" 
            width={200}
            height={200}
            className="mb-4 opacity-50"
          />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 text-center">Looks like you {`haven't`} added any items to your cart yet.</p>
          <Link href="/" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Browse Menu
          </Link>
        </div>
      )}
    </div>
  );
}
