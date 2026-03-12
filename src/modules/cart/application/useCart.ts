import { useMemo, useState } from 'react';
import type { Product } from '@/mocks/db';
import type { CartItem } from '@/modules/cart/domain/cart.types';
import { mockPromotions } from '@/mocks/db';

let globalCart: CartItem[] = [];

export function useCart() {
  const [, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);

  const addItem = (product: Product) => {
    const found = globalCart.find((i) => i.product.id === product.id);
    if (found) found.quantity += 1; else globalCart.push({ product, quantity: 1 });
    refresh();
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    const item = globalCart.find((i) => i.product.id === productId);
    if (item) item.quantity = qty;
    refresh();
  };

  const removeItem = (productId: string) => { globalCart = globalCart.filter((i) => i.product.id !== productId); refresh(); };

  const summary = useMemo(() => {
    const subtotal = globalCart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const discount = globalCart.reduce((acc, i) => {
      const promo = mockPromotions.find((p) => p.active && p.category === i.product.category && p.minQty && i.quantity >= p.minQty);
      if (!promo) return acc;
      return acc + (promo.type === 'percentage' ? i.product.price * i.quantity * (promo.amount / 100) : promo.amount);
    }, 0);
    return { subtotal, discount, total: subtotal - discount };
  }, [globalCart.length]);

  return { items: globalCart, addItem, updateQuantity, removeItem, summary };
}
