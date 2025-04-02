import { ToastContext } from '@/app/context/toast-context';
import { useContext } from 'react';

const useToastContext = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }

  return context;
};

export default useToastContext;
