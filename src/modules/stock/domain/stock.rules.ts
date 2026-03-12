import type { Role } from '@/shared/types/common';
import type { StockAlertLevel, StockItem, StockUpdatePayload, VariantStock } from '@/modules/stock/domain/stock.types';

const LOW_STOCK_THRESHOLD = 3;

export const stockEditors: Role[] = ['admin', 'owner', 'employee'];

export const getAlertLevel = (stock: number): StockAlertLevel => {
  if (stock <= 0) return 'out';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'ok';
};

const normalizeStock = (stock: number): number => Math.max(0, Number.isFinite(stock) ? Math.floor(stock) : 0);

export const normalizeVariantStock = (variants: VariantStock[]): VariantStock[] =>
  variants.map((variant) => ({ ...variant, stock: normalizeStock(variant.stock) }));

export const toStockUpdatePayload = (item: StockItem, nextStock: number, nextVariantStock?: VariantStock[]): StockUpdatePayload => ({
  productId: item.productId,
  stock: normalizeStock(nextStock),
  variantStock: item.hasVariantStock && nextVariantStock ? normalizeVariantStock(nextVariantStock) : undefined
});

export const canEditStock = (role?: Role): boolean => !!role && stockEditors.includes(role);
