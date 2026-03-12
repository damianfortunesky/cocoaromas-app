import type { Product } from '@/mocks/db';
import { promotionsEngine } from '@/modules/promotions/domain/promotionEngine';
import type { Promotion } from '@/modules/promotions/domain/promotion.types';
import type {
  AddToCartPayload,
  CartItem,
  CartItemSelection,
  CartSummary,
  DiscountComputationInput,
  QuantityValidationResult
} from '@/modules/cart/domain/cart.types';

export const CART_STORAGE_KEY = 'cocoaromas:cart:v1';

export function normalizeSelection(product: Product, selectedOptions?: CartItemSelection): CartItemSelection {
  if (!product.variants?.length) return {};

  return product.variants.reduce<CartItemSelection>((acc, variant) => {
    const selected = selectedOptions?.[variant.name];
    acc[variant.name] = selected && variant.options.includes(selected) ? selected : variant.options[0];
    return acc;
  }, {});
}

export function createCartItemId(productId: string, selectedOptions: CartItemSelection): string {
  const normalizedEntries = Object.entries(selectedOptions).sort(([left], [right]) => left.localeCompare(right));
  const serializedOptions = normalizedEntries.map(([key, value]) => `${key}:${value}`).join('|');
  return serializedOptions ? `${productId}::${serializedOptions}` : productId;
}

export function validateQuantity(quantity: number, stock?: number): QuantityValidationResult {
  if (!Number.isFinite(quantity) || Number.isNaN(quantity)) {
    return { isValid: false, normalizedQuantity: 1 };
  }

  const normalizedQuantity = Math.floor(quantity);

  if (normalizedQuantity < 1) {
    return { isValid: false, normalizedQuantity: 1 };
  }

  if (typeof stock === 'number' && stock >= 0 && normalizedQuantity > stock) {
    return { isValid: false, normalizedQuantity: stock };
  }

  return { isValid: true, normalizedQuantity };
}

export function buildCartItem(payload: AddToCartPayload): CartItem | null {
  const selectedOptions = normalizeSelection(payload.product, payload.selectedOptions);
  const { normalizedQuantity } = validateQuantity(payload.quantity ?? 1, payload.product.stock);

  if (payload.product.stock <= 0 || normalizedQuantity < 1) {
    return null;
  }

  return {
    id: createCartItemId(payload.product.id, selectedOptions),
    product: payload.product,
    quantity: normalizedQuantity,
    selectedOptions
  };
}

export function computeDiscount({ items, promotions }: DiscountComputationInput): number {
  return promotionsEngine.computeDiscount({ items, promotions });
}

export function computeSummary(items: CartItem[], promotions: Promotion[]): CartSummary {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = computeDiscount({ items, promotions });
  const total = Math.max(0, subtotal - discount);

  return { subtotal, discount, total };
}

export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => {
      if (!item || typeof item !== 'object') return false;
      if (typeof item.id !== 'string') return false;
      if (typeof item.quantity !== 'number' || item.quantity < 1) return false;
      if (!item.product || typeof item.product !== 'object') return false;
      if (typeof item.product.id !== 'string') return false;
      return true;
    });
  } catch {
    return [];
  }
}
