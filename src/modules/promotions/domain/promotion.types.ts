export type PromotionScope = 'quantity' | 'product' | 'category';
export type PromotionDiscountType = 'percentage' | 'fixed';

export interface Promotion {
  id: string;
  name: string;
  scope: PromotionScope;
  type: PromotionDiscountType;
  amount: number;
  minQty?: number;
  category?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export interface PromotionUpsertInput {
  name: string;
  scope: PromotionScope;
  type: PromotionDiscountType;
  amount: number;
  minQty?: number;
  category?: string;
  productId?: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export interface PromotionRepository {
  list: () => Promise<Promotion[]>;
  create: (payload: PromotionUpsertInput) => Promise<Promotion>;
  update: (id: string, payload: PromotionUpsertInput) => Promise<Promotion>;
  toggle: (id: string, active: boolean) => Promise<Promotion>;
  remove: (id: string) => Promise<void>;
}
