'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, Home, Truck, AlertCircle } from 'lucide-react';
import useToastContext from '@/app/hooks/use-toast-context';
import useUserContext from '@/app/hooks/use-user-context';
import api from '@/app/utilities/api';
import Image from 'next/image';

export default function OrderConfirmationPage() {
  const { showToast } = useToastContext();
  const { user } = useUserContext();
  const [fromCart, setFromCart] = useState<boolean>(false);

  // clear the user cart.
  useEffect(() => {
    const deleteItemsFromCart = async () => {
      try {
        await api.delete("/api/cart", {
          withCredentials: true,
        });
      }
      catch (error) {
      }
    };

    deleteItemsFromCart();

    const fromCart = sessionStorage.getItem("fromCartPage");
    if (fromCart === "true") {
      setFromCart(true);
      sessionStorage.removeItem("fromCartPage");
    }
  }, [showToast]);

  if (!fromCart || !user) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-md text-center">
          <div className="bg-red-50 px-6 py-8 flex flex-col items-center border-b">
            <AlertCircle size={64} className="text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-700 mb-2">No Order Placed</h1>
            <p className="text-gray-600">
              It seems you {`haven't`} placed an order yet or accessed this page directly.
            </p>
          </div>
          
          <div className="p-6">
            <Image
              src="/empty-cart.png"
              alt="Empty cart"
              width={200}
              height={150}
              className="mx-auto mb-4 opacity-60"
            />
            
            <p className="text-gray-600 mb-6">
              Please browse our menu and add items to your cart to place an order.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                <Home size={18} className="mr-2" />
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mb-16">
      {/* Order Success Header */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="bg-green-50 px-6 py-8 flex flex-col items-center text-center border-b border-green-100">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 max-w-md">
            Your order has been successfully placed and is being prepared. Thank you for your purchase! You will soon receive an email confirming your order.
          </p>
        </div>
      </div>
      
      {/* Next Steps */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">What Happens Next?</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <Clock size={32} className="text-red-600" />
              </div>
              <h3 className="font-medium mb-2">Preparing Your Order</h3>
              <p className="text-gray-600 text-sm">
                Your food is now being prepared with care and attention to every detail.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <Truck size={32} className="text-red-600" />
              </div>
              <h3 className="font-medium mb-2">Delivery On The Way</h3>
              <p className="text-gray-600 text-sm">
                Soon a delivery partner will pick up your order and bring it straight to your doorstep.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <CheckCircle size={32} className="text-red-600" />
              </div>
              <h3 className="font-medium mb-2">Enjoy Your Meal</h3>
              <p className="text-gray-600 text-sm">
                We hope you enjoy your meal! {`Don't`} forget to rate your experience after delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
          <Home size={18} className="mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}
