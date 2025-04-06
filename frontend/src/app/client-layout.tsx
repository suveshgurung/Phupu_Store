'use client'

import React from 'react';
import Navbar from '@/app/ui/navbar';
import Footer from '@/app/ui/footer';
import CartButton from '@/app/ui/cart-button';
import useUserContext from '@/app/hooks/use-user-context';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { userLoaded } = useUserContext();

  return (
    <>
      {userLoaded ? (
        <div className='flex flex-col min-h-screen'>
          <Navbar />
            <main className="w-full flex-grow pt-[70px]">
              {children}
            </main>
            <CartButton />
          <Footer />
        </div>
      ) : (
        <>
        </>
      )}
    </>
  );
}
