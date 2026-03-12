import type { CartItem } from '@/modules/cart/domain/cart.types';
import type { Promotion } from '@/modules/promotions/domain/promotion.types';

export interface PromotionCalculationInput {
  items: CartItem[];
  promotions: Promotion[];
  now?: Date;
}

const isWithinDateRange = (promotion: Promotion, nowTs: number): boolean => {
  const hasStartDate = Boolean(promotion.startDate);
  const hasEndDate = Boolean(promotion.endDate);

  if (!hasStartDate && !hasEndDate) return true;

  const startTs = promotion.startDate ? new Date(promotion.startDate).getTime() : Number.NEGATIVE_INFINITY;
  const endTs = promotion.endDate ? new Date(promotion.endDate).getTime() : Number.POSITIVE_INFINITY;

  if (Number.isNaN(startTs) || Number.isNaN(endTs)) return true;

  return startTs <= nowTs && nowTs <= endTs;
};

const computeItemDiscount = (item: CartItem, promotion: Promotion): number => {
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
};

export const promotionsEngine = {
  computeDiscount({ items, promotions, now }: PromotionCalculationInput): number {
    const nowTs = (now ?? new Date()).getTime();
    const activePromotions = promotions.filter((promotion) => promotion.active && isWithinDateRange(promotion, nowTs));

    return items.reduce((totalDiscount, item) => {
      const bestDiscountForItem = activePromotions.reduce((best, promotion) => {
        const discount = computeItemDiscount(item, promotion);
        return Math.max(best, discount);
      }, 0);

      return totalDiscount + bestDiscountForItem;
    }, 0);
  }
};
