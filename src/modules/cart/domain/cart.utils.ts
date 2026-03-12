import type { Promotion, Product } from '@/mocks/db';
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

function isPromotionActive(promotion: Promotion): boolean {
  if (!promotion.active) return false;

  const now = Date.now();
  const start = new Date(promotion.startDate).getTime();
  const end = new Date(promotion.endDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return true;
  return start <= now && now <= end;
}

function computePromotionForItem(item: CartItem, promotion: Promotion): number {
  const baseAmount = item.product.price * item.quantity;

  const appliesByScope =
    (promotion.scope === 'quantity' && (!promotion.minQty || item.quantity >= promotion.minQty)) ||
    (promotion.scope === 'category' && promotion.category === item.product.category) ||
    (promotion.scope === 'product' && promotion.productId === item.product.id);

  if (!appliesByScope) return 0;

  if (promotion.type === 'percentage') {
    return baseAmount * (promotion.amount / 100);
  }

  return Math.min(baseAmount, promotion.amount);
}

export function computeDiscount({ items, promotions }: DiscountComputationInput): number {
  return items.reduce((totalDiscount, item) => {
    const activePromotions = promotions.filter((promotion) => isPromotionActive(promotion));
    const bestDiscountForItem = activePromotions.reduce((best, promotion) => {
      const discount = computePromotionForItem(item, promotion);
      return Math.max(best, discount);
    }, 0);

    return totalDiscount + bestDiscountForItem;
  }, 0);
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
