import { useContext } from 'react';
import { FoodItemsContext } from '@/app/context/food-items-context';

const useFoodItemsContext = () => {
  const context = useContext(FoodItemsContext);

  if (!context) {
    throw new Error("useFoodItemsContext must be within a FoodItemsProvider");
  }

  return context;
};

export default useFoodItemsContext;
