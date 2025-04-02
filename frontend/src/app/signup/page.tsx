'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import validator from 'validator';
import api from '@/app/utilities/api';
import axios, { AxiosResponse } from 'axios';
import ServerResponseData from '@/app/types/server-response';
import ToastNotification from '@/app/types/toast-notification';

interface SignupFormData {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp(): React.ReactElement {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [phoneNumberError, setPhoneNumberError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [formData, setFormData] = useState<SignupFormData>({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
  });

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { message, type, id }]);

    // Remove the toast after 4 seconds.
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 4000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');
    setPhoneNumberError('');
    setPasswordError('');
    setLoading(true);
    let error: boolean = false;

    if (!validator.isEmail(formData.email)) {
      setLoading(false);
      setEmailError("Invalid email!");
      error = true;
    }
    if (!validator.isNumeric(formData.phone_number)) {
      setLoading(false);
      setPhoneNumberError("Invalid phone number!");
      error = true;
    }
    else {
      if (formData.phone_number.length != 10) {
        setLoading(false);
        setPhoneNumberError("Phone number should contain 10 digits!");
        error = true;
      }
    }
    if (formData.password != formData.confirmPassword) {
      setLoading(false);
      setPasswordError("Passwords do not match!");
      error = true;
    }

    if (error) {
      return;
    }

    try {
      const response: AxiosResponse = await api.post("/api/auth/signup", formData);
      const responseData: ServerResponseData = response.data;

      if (responseData.success === true) {
        setLoading(false);
        addToast("Sign up successful!", "success");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    }
    catch (error: unknown) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.data.errorCode === "ER_EMAIL_EXISTS") {
          addToast("Provided email already exists!", "error");
        }
        else if (error.response?.data.errorCode === "ER_PN_EXISTS") {
          addToast("Provided phone number already exists!", "error");
        }
      }
      else {
        addToast("An unexpected error occured!", "error");
      }
    }

  };

  return (
    <div className="max-w-lg mx-auto mt-8 md:mt-12 mb-12 p-4">
      <h1 className="md:text-3xl text-2xl text-center font-semibold my-7">
        Welcome
      </h1>
      <p className="text-gray-600 text-center mt-[-25px]">
        Login to your account or create a new one
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col mt-6 gap-4 text-base md:text-sm">
        <input
          type="text"
          placeholder="Full name"
          className="outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg"
          id="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Email"
          className="outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <div
          className={clsx(
            "w-full text-red-700",
            {
              "hidden": !emailError
            }
          )}
        >
          {emailError}
        </div>
        <input
          type="text"
          placeholder="Phone number"
          className="outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg"
          id="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />
        <div
          className={clsx(
            "w-full text-red-700",
            {
              "hidden": !phoneNumberError
            }
          )}
        >
          {phoneNumberError}
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg pr-10"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <i className="bi bi-eye"></i>
            ) : (
              <i className="bi bi-eye-slash"></i>
            )}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg pr-10"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <i className="bi bi-eye"></i>
            ) : (
              <i className="bi bi-eye-slash"></i>
            )}
          </button>
        </div>
        <div
          className={clsx(
            "w-full text-red-700",
            {
              "hidden": !passwordError
            }
          )}
        >
          {passwordError}
        </div>
        <button
          disabled={loading}
          className="bg-[#f5b400] text-white py-2 sm:py-3 px-3 rounded-lg hover:cursor-pointer hover:opacity-95 disabled:opacity-80 disabled:cursor-auto"
          type="submit"
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>{`Already have an account?`}</p>
        <Link href="/login">
          <span className="text-[#f59e0b]">Login</span>
        </Link>
      </div>

      {/* Toast notifications container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "px-4 py-3 rounded-lg shadow-lg transform transition-all duration-500 animate-fadeIn",
              {
                "bg-red-500 text-white": toast.type === "error",
                "bg-green-500 text-white": toast.type === "success"
              }
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
