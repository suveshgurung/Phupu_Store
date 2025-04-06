import { ShoppingCart } from 'lucide-react';
import useUserContext from '@/app/hooks/use-user-context';
import useCartContext from '@/app/hooks/use-cart-context';

export default function CartButton() {
  const { user } = useUserContext();
  const { cart } = useCartContext();

  return (
    <>
      {user && (
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 hover:cursor-pointer transition-colors"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs text-white w-6 h-6 rounded-full flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
};
