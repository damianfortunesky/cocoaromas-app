import type { Product } from '@/modules/catalog/domain/catalog.types';
import type { Promotion } from '@/modules/promotions/domain/promotion.types';

export type CartItemSelection = Record<string, string>;

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: CartItemSelection;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
}

export interface AddToCartPayload {
  product: Product;
  quantity?: number;
  selectedOptions?: CartItemSelection;
}

export interface CartState {
  items: CartItem[];
}

export interface QuantityValidationResult {
  isValid: boolean;
  normalizedQuantity: number;
}

export interface DiscountComputationInput {
  items: CartItem[];
  promotions: Promotion[];
}
