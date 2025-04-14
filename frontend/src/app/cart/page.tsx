'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Minus, Plus, ArrowLeft, Truck, Wallet, Upload } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'bank' | 'cod'>('cod');
  const [processingOrder, setProcessingOrder] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Customer information states
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>(user?.phone_number || '');
  const [district, setDistrict] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');

  // Calculate totals
  const subtotal = cart.reduce((total, cartItem) => 
    total + (cartItem.item.price * cartItem.quantity), 0
  );
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  // Districts of Nepal
  const nepalDistricts = [
    "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara", "Bardiya", 
    "Bhaktapur", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang", "Darchula", "Dhading", 
    "Dhankuta", "Dhanusa", "Dolakha", "Dolpa", "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", 
    "Ilam", "Jajarkot", "Jhapa", "Jumla", "Kailali", "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", 
    "Kathmandu", "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung", "Mahottari", "Makwanpur", "Manang", 
    "Morang", "Mugu", "Mustang", "Myagdi", "Nawalparasi East", "Nawalparasi West", "Nuwakot", "Okhaldhunga", 
    "Palpa", "Panchthar", "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa", "Rautahat", "Rolpa", 
    "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari", "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", 
    "Solukhumbu", "Sunsari", "Surkhet", "Syangja", "Tanahun", "Taplejung", "Tehrathum", "Udayapur", 
    "Western Rukum"
  ];

  // Effect to show QR code when esewa or bank is selected
  useEffect(() => {
    if (paymentMethod === 'esewa' || paymentMethod === 'bank') {
      setShowQR(true);
    } else {
      setShowQR(false);
      setPaymentScreenshot(null);
      setPreviewUrl(null);
    }
  }, [paymentMethod]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast("File size too large. Please upload an image smaller than 5MB", "error");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showToast("Please upload an image file", "error");
        return;
      }
      
      setPaymentScreenshot(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clean up the object URL when component unmounts or when the file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  // Remove payment screenshot
  const removeScreenshot = () => {
    setPaymentScreenshot(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    try {
      const response: AxiosResponse = await api.delete(`/api/cart/${itemId}`, {
        withCredentials: true,
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
    }
  };
  
  // Update item quantity in cart
  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    try {
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
    }
  };

  // Validate form before order placement
  const validateForm = () => {
    if (!fullName.trim()) {
      showToast("Please enter your full name", "warning");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      showToast("Please enter a valid email address", "warning");
      return false;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone)) {
      showToast("Please enter a valid 10-digit phone number", "warning");
      return false;
    }
    if (!district) {
      showToast("Please select your district", "warning");
      return false;
    }
    if (!address.trim()) {
      showToast("Please enter your delivery address", "warning");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showToast("Your cart is empty", "warning");
      return;
    }

    if ((paymentMethod === 'esewa' || paymentMethod === 'bank') && !paymentScreenshot) {
      showToast("Please upload your payment screenshot", "warning");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setProcessingOrder(true);
    
    try {
      const simplifiedCartItems = cart.map(cartItem => ({
        product_id: cartItem.item.id,
        quantity: cartItem.quantity,
      }));
      
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('phone_number', phone);
      formData.append('payment_method', paymentMethod);
      formData.append('district', district);
      formData.append('address', address);
      formData.append('landmark', landmark);
      if (paymentScreenshot) {
        formData.append('payment_screenshot', paymentScreenshot);
      }
      formData.append('cart_items', JSON.stringify(simplifiedCartItems));
      
      const response: AxiosResponse = await api.post("/api/place-order", formData, {
        withCredentials: true
      });

      const responseData: ServerResponseData = response.data;

      if (responseData.success === true) {
        // delete the items from the user cart.
        try {
          const deleteResponse: AxiosResponse = await api.delete("/api/cart", {
            withCredentials: true,
          });
          const deleteResponseData: ServerResponseData = deleteResponse.data;

          if (deleteResponseData.success === true) {
            showToast("Order placed successfully!", "success");
          }
        }
        catch (error) {
          throw error;
        }
      }
      
      // Redirect to order confirmation page (you'd need to create this)
      // router.push('/order-confirmation');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.errorCode === ErrorCodes.ER_UNAUTHORIZED) {
          showToast("Login to place an order.", "warning");
        }
        else if (error.response?.data.errorCode === ErrorCodes.ER_FORBIDDEN) {
          showToast("Log out and try again.", "warning");
        }
        else if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_NOT_DELETED) {
          showToast("No item to be deleted!", "error");
        }
        else {
          showToast("Failed to place order. Please try again.", "error");
        }
      }
      else {
        showToast("Failed to place order. Please try again.", "error");
      }
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
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold ml-auto">Checkout</h1>
      </div>

      {cart.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Products and Order Summary (Left side) */}
          <div className="w-full lg:w-1/2">
            {/* Cart Items */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Cart Items ({cart.reduce((acc, item) => acc + item.quantity, 0)})</h2>
              </div>
              
              <div className="divide-y max-h-96 overflow-y-auto">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex flex-row items-center p-4 gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={cartItem.item.product_image_url}
                        alt={cartItem.item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{cartItem.item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm">{cartItem.item.category}</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 py-1 text-sm">{cartItem.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600 font-semibold">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                          <p className="text-gray-500 text-xs">${cartItem.item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-red-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Payment Method</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('esewa')}
                      className={`flex items-center justify-center p-2 border rounded-lg transition-colors cursor-pointer ${
                        paymentMethod === 'esewa' 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'border-gray-300 hover:border-red-600'
                      }`}
                    >
                      <Wallet size={18} className="mr-1" />
                      <span className="text-sm">Esewa</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('bank')}
                      className={`flex items-center justify-center p-2 border rounded-lg transition-colors cursor-pointer ${
                        paymentMethod === 'bank' 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'border-gray-300 hover:border-red-600'
                      }`}
                    >
                      <Wallet size={18} className="mr-1" />
                      <span className="text-sm">Bank</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex items-center justify-center p-2 border rounded-lg transition-colors cursor-pointer ${
                        paymentMethod === 'cod' 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'border-gray-300 hover:border-red-600'
                      }`}
                    >
                      <Truck size={18} className="mr-1" />
                      <span className="text-sm">COD</span>
                    </button>
                  </div>
                </div>
                
                {/* QR Code Display */}
                {showQR && (
                  <div className="mb-6 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg mb-3">
                      <p className="text-sm mb-3">
                        {paymentMethod === 'esewa' ? 'Scan to pay with Esewa' : 'Scan to pay via Bank Transfer'}
                      </p>
                      <div className="mb-2 inline-block p-2 bg-white rounded-lg">
                        <Image 
                          src={paymentMethod === 'esewa' ? 
                            "/api/placeholder/150/150" : 
                            "/api/placeholder/150/150"} 
                          alt={`${paymentMethod} QR code`}
                          width={150}
                          height={150}
                          className="mx-auto"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mb-4">
                        {paymentMethod === 'esewa' ? 
                          'After payment, upload screenshot as proof' : 
                          'Please upload payment receipt as proof'
                        }
                      </p>
                      
                      {/* Payment Screenshot Upload */}
                      <div className="mt-3">
                        <label htmlFor="payment-screenshot" className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Payment Screenshot
                        </label>
                        
                        {!previewUrl ? (
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-red-500 transition-colors"
                               onClick={() => document.getElementById('payment-screenshot')?.click()}>
                            <div className="space-y-1 text-center">
                              <Upload className="mx-auto h-10 w-10 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label htmlFor="payment-screenshot" className="relative cursor-pointer rounded-md font-medium text-red-600 hover:text-red-500">
                                  <span>Upload a file</span>
                                  <input 
                                    id="payment-screenshot" 
                                    name="payment-screenshot" 
                                    type="file" 
                                    accept="image/*"
                                    className="sr-only" 
                                    onChange={handleFileChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 relative">
                            <div className="relative h-32 w-full overflow-hidden rounded-lg">
                              <Image 
                                src={previewUrl} 
                                alt="Payment Screenshot" 
                                fill
                                className="object-contain"
                              />
                              <button 
                                onClick={removeScreenshot}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100 transition-colors"
                                aria-label="Remove screenshot"
                              >
                                <X size={16} className="text-red-600" />
                              </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-500 text-center">
                              Screenshot uploaded successfully
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Customer Information (Right side) */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold">Customer Information</h2>
              </div>
              
              <div className="p-6">
                {/* General Information */}
                <div className="mb-6">
                  <h3 className="font-bold mb-4 text-gray-700">1. General Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        value={user.name}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={user.email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={user.phone_number}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter 10-digit phone number"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Delivery Address */}
                <div className="mb-6">
                  <h3 className="font-bold mb-4 text-gray-700">2. Delivery Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                        District *
                      </label>
                      <select
                        id="district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select District</option>
                        {nepalDistricts.map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter your complete address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        id="landmark"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Nearby landmark for easier navigation"
                      />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={placeOrder}
                  disabled={processingOrder || ((paymentMethod === 'esewa' || paymentMethod === 'bank') && !paymentScreenshot)}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center justify-center cursor-pointer"
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
            src="/empty-cart.png" 
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
