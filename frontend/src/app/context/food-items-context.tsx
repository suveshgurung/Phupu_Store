'use client'

import { createContext, ReactNode, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import FoodItem from '@/app/types/food-item';
import ServerResponseData from '@/app/types/server-response';
import useToastContext from '@/app/hooks/use-toast-context';
import ErrorCodes from '@/app/types/error-codes';
import api from '@/app/utilities/api';

interface FoodItemsContextType {
  foodItems: FoodItem[];
};

export const FoodItemsContext = createContext<FoodItemsContextType | undefined>(undefined);

export const FoodItemsProvider = ({ children }: { children: ReactNode }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const { showToast } = useToastContext();

  useEffect(() => {
    const getFoodItems = async () => {
      try {
        const response: AxiosResponse = await api.get("/api/product");
        const responseData: ServerResponseData<FoodItem[]> = response.data;

        if (responseData.success === true) {
          if (responseData.data) {
            setFoodItems(responseData.data);
          }
        }
      }
      catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.errorCode === ErrorCodes.ER_PRODUCT_NOT_FETCHED) {
            return showToast("Error in fetching food items!", "error");
          }
        }
      }
    };

    getFoodItems();
  }, [showToast]);

  return (
    <FoodItemsContext.Provider value={{ foodItems }}>
      {children}
    </FoodItemsContext.Provider>
  );
}
