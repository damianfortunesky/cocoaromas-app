import type { Role } from '@/shared/types/common';

export type StockAlertLevel = 'ok' | 'low' | 'out';

export type VariantStock = {
  id: string;
  name: string;
  stock: number;
};

export type StockItem = {
  productId: string;
  productName: string;
  totalStock: number;
  hasVariantStock: boolean;
  variantStock: VariantStock[];
  alertLevel: StockAlertLevel;
};

export type StockUpdatePayload = {
  productId: string;
  stock: number;
  variantStock?: VariantStock[];
  reason?: string;
};

export type StockAuditDraft = {
  action: 'stock_updated';
  productId: string;
  previousStock: number;
  nextStock: number;
  actorRole: Role;
  happenedAt: string;
};
