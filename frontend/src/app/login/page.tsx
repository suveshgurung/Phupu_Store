'use client'

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import validator from 'validator';
import clsx from 'clsx';
import axios, { AxiosResponse } from 'axios';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import api from '@/app/utilities/api';
import ServerResponseData from '@/app/types/server-response';
import useToastContext from '@/app/hooks/use-toast-context';
import useUserContext from '@/app/hooks/use-user-context';
import ErrorCodes from '@/app/types/error-codes';
import UserInfo from '@/app/types/user-info';
 
interface LoginFormData {
  emailOrPhoneNumber: string;
  password: string;
  isEmail: boolean;
};

export default function Login(): React.ReactElement {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailAndPhoneNumberError, setEmailAndPhoneNumberError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToastContext();
  const { dispatch } = useUserContext();
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhoneNumber: '',
    password: '',
    isEmail: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailAndPhoneNumberError('');
    setPasswordError('');
    setLoading(true);

    if (validator.isNumeric(formData.emailOrPhoneNumber)) {
      if (formData.emailOrPhoneNumber.length != 10) {
        setLoading(false);
        setEmailAndPhoneNumberError("Phone number should contain 10 digits!");

        return;
      }
      formData.isEmail = false;

      try {
        const response: AxiosResponse = await api.post("/api/auth/login", formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        const responseData: ServerResponseData<UserInfo> = response.data;

        if (responseData.success === true) {
          setLoading(false);
          dispatch({ 'type': 'LOG_IN', 'payload': responseData.data });
          showToast("Login successfull!", "success");

          const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY;
          if (!secretKey) {
            throw new Error("Encryption key not provided!");
          }
          const encryptedUserInfo = CryptoJS.AES.encrypt(JSON.stringify(responseData.data), secretKey).toString();
          Cookies.set("user", encryptedUserInfo, { expires: 7, secure: true, sameSite: "Strict" });

          router.push("/");
        }
      }
      catch (error: unknown) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          if (error.response?.data.errorCode === ErrorCodes.ER_INVALID_PASS) {
            showToast("Invalid password!", "error");
          }
          else if (error.response?.data.errorCode === ErrorCodes.ER_EMAIL_NOT_REG) {
            showToast("Email not registered!", "error");
          }
          else if (error.response?.data.errorCode === ErrorCodes.ER_PN_NOT_REG) {
            showToast("Phone number not registered!", "error");
          }
          else {
            showToast("An unexpected error occured!", "error");
          }
        }
        else {
          showToast("An unexpected error occured!", "error");
        }
      }
    }
    else {
      if (!validator.isEmail(formData.emailOrPhoneNumber)) {
        setLoading(false);
        setEmailAndPhoneNumberError("Invalid email!");

        return;
      }
      formData.isEmail = true;

      try {
        const response: AxiosResponse = await api.post("/api/auth/login", formData, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        const responseData: ServerResponseData<UserInfo> = await response.data;

        if (responseData.success === true) {
          setLoading(false);
          dispatch({ 'type': 'LOG_IN', 'payload': responseData.data });
          showToast("Login successfull!", "success");

          const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY;
          if (!secretKey) {
            throw new Error("Encryption key not provided!");
          }
          const encryptedUserInfo = CryptoJS.AES.encrypt(JSON.stringify(responseData.data), secretKey).toString();
          Cookies.set("user", encryptedUserInfo, { expires: 7, secure: true, sameSite: "Strict" });

          router.push("/");
        }
      }
      catch (error: unknown) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
          if (error.response?.data.errorCode === ErrorCodes.ER_INVALID_PASS) {
            showToast("Invalid password!", "error");
          }
          else if (error.response?.data.errorCode === ErrorCodes.ER_EMAIL_NOT_REG) {
            showToast("Email not registered!", "error");
          }
          else if (error.response?.data.errorCode === ErrorCodes.ER_PN_NOT_REG) {
            showToast("Phone number not registered!", "error");
          }
          else {
            showToast("An unexpected error occured!", "error");
          }
        }
        else {
          showToast("An unexpected error occured!", "error");
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-14 md:mt-20 p-4">
      <h1 className="md:text-3xl text-2xl text-center font-semibold my-7">
        Welcome
      </h1>
      <p className="text-gray-600 text-center mt-[-25px]">
        Login to your account or create a new one
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col mt-6 gap-4 text-base md:text-sm">
        <input 
          type="text"
          placeholder="Email or phone number"
          className="outline-none border border-slate-400 h-12 py-3 md:py-2 px-3 rounded-lg"
          id="emailOrPhoneNumber"
          value={formData.emailOrPhoneNumber}
          onChange={handleInputChange}
          required
        />
        <div
          className={clsx(
            "w-full text-red-700",
            {
              "hidden": !emailAndPhoneNumberError
            }
          )}
        >
          {emailAndPhoneNumberError}
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
