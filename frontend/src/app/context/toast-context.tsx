'use client'

import { createContext, ReactNode, useState } from 'react';
import Toast from '@/app/ui/toaster';
import ToastNotification from '@/app/types/toast-notification';

interface ToastContextType {
  showToast: (message: string, type: ToastNotification['type']) => void
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: ToastNotification['type']) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { message, type, id }]);

    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
