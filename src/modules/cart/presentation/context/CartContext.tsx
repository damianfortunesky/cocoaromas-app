import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { usePromotions } from '@/modules/promotions/application/usePromotions';
import type { AddToCartPayload, CartItem, CartState, CartSummary } from '@/modules/cart/domain/cart.types';
import {
  CART_STORAGE_KEY,
  buildCartItem,
  computeSummary,
  parseStoredCart,
  validateQuantity
} from '@/modules/cart/domain/cart.utils';

interface CartContextValue {
  items: CartItem[];
  summary: CartSummary;
  itemsCount: number;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
}

type CartAction =
  | { type: 'hydrate'; payload: CartItem[] }
  | { type: 'add'; payload: AddToCartPayload }
  | { type: 'remove'; payload: { itemId: string } }
  | { type: 'updateQty'; payload: { itemId: string; quantity: number } }
  | { type: 'clear' };

const CartContext = createContext<CartContextValue | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'hydrate':
      return { items: action.payload };
    case 'add': {
      const newItem = buildCartItem(action.payload);
      if (!newItem) return state;

      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        return { items: [...state.items, newItem] };
      }

      const { normalizedQuantity } = validateQuantity(existingItem.quantity + newItem.quantity, existingItem.product.stock);
      if (normalizedQuantity < 1) return state;

      return {
        items: state.items.map((item) => (item.id === existingItem.id ? { ...item, quantity: normalizedQuantity } : item))
      };
    }
    case 'remove':
      return { items: state.items.filter((item) => item.id !== action.payload.itemId) };
    case 'updateQty': {
      const target = state.items.find((item) => item.id === action.payload.itemId);
      if (!target) return state;

      const validation = validateQuantity(action.payload.quantity, target.product.stock);
      if (!validation.isValid || validation.normalizedQuantity < 1) {
        return state;
      }

      return {
        items: state.items.map((item) =>
          item.id === action.payload.itemId ? { ...item, quantity: validation.normalizedQuantity } : item
        )
      };
    }
    case 'clear':
      return { items: [] };
    default:
      return state;
  }
}

function getInitialState(): CartState {
  if (typeof window === 'undefined') return { items: [] };
  return { items: parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)) };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      dispatch({ type: 'hydrate', payload: parseStoredCart(event.newValue) });
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const { data: promotions = [] } = usePromotions();
  const summary = useMemo(() => computeSummary(state.items, promotions), [state.items, promotions]);
  const itemsCount = useMemo(() => state.items.reduce((acc, item) => acc + item.quantity, 0), [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      summary,
      itemsCount,
      addItem: (payload) => dispatch({ type: 'add', payload }),
      removeItem: (itemId) => dispatch({ type: 'remove', payload: { itemId } }),
      updateQuantity: (itemId, quantity) => dispatch({ type: 'updateQty', payload: { itemId, quantity } }),
      clear: () => dispatch({ type: 'clear' })
    }),
    [itemsCount, state.items, summary]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe utilizarse dentro de CartProvider');
  }

  return context;
}
