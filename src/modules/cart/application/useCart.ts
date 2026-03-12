import { useCartContext } from '@/modules/cart/presentation/context/CartContext';

export function useCart() {
  return useCartContext();
}
