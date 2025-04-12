'use client'

import { createContext, ReactNode, useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import CartItems from '@/app/types/cart-info';
import FoodItem from '@/app/types/food-item';
import ServerResponseData from '@/app/types/server-response';
import ServerResponseCartData from '@/app/types/server-response-cart-data';
import ErrorCodes from '@/app/types/error-codes';
import useUserContext from '@/app/hooks/use-user-context';
import useToastContext from '@/app/hooks/use-toast-context';
import useFoodItemsContext from '@/app/hooks/use-food-items-context';
import api from '@/app/utilities/api';

interface CartContextType {
  cart: CartItems[];
  setCart: React.Dispatch<React.SetStateAction<CartItems[]>>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, dispatch } = useUserContext();
  const { showToast } = useToastContext();
  const { foodItems } = useFoodItemsContext();
  const [cart, setCart] = useState<CartItems[]>([]);

  useEffect(() => {
    const getCartItems = async () => {
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
      catch (error) {
        if (axios.isAxiosError(error)) {
          // Refresh token no longer exists in the database.
          if (error.response?.data.errorCode === ErrorCodes.ER_FORBIDDEN) {
            dispatch({ type: 'LOG_OUT' });

            Cookies.remove('refreshToken');
            Cookies.remove('user');
          }
        }
        showToast("An unexpected error occurred!", "error");
      }
    };

    if (user) {
      getCartItems();
    }
  }, [user, showToast, foodItems, dispatch]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
