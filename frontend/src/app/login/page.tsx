'use client'

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';

interface AuthFormData {
  email: string;
  password: string;
  phoneNumber: string;
}

export default function Authentication(): React.ReactElement {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    phoneNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    console.log(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-4">
      <h1 className="md:text-3xl text-2xl text-center font-semibold my-7">
        Welcome
      </h1>
      <p className="text-gray-600 text-center mt-[-25px]">
        Login to your account or create a new one
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col mt-6 gap-4 text-base md:text-sm">
        <input 
          type="text"
          placeholder="Email"
          className="outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input 
          type="text"
          placeholder="Phone Number"
          className="outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
        />
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Password" 
            className="w-full outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg pr-10"
            id="password" 
            value={formData.password}
            onChange={handleInputChange}
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
        <button
          disabled={loading}
          className="bg-[#f5b400] text-white py-2 sm:py-3 px-3 rounded-lg hover:cursor-pointer hover:opacity-95 disabled:opacity-80 disabled:cursor-auto"
          type="submit"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <div className="flex gap-2 mt-5">
        <p>{`Don't have an account?`}</p>
        <Link href="/signup">
          <span className="text-[#f59e0b]">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
