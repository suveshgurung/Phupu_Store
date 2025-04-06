'use client'

import { createContext, ReactNode, useState } from 'react';
import CartItems from '@/app/types/cart-info';

interface CartContextType {
  cart: CartItems[];
  setCart: React.Dispatch<React.SetStateAction<CartItems[]>>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItems[]>([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
