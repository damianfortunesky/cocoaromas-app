import { httpClient } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { getAlertLevel } from '@/modules/stock/domain/stock.rules';
import type { StockItem, StockUpdatePayload, VariantStock } from '@/modules/stock/domain/stock.types';

type VariantStockApiDto = {
  id?: string | number;
  sku?: string;
  name?: string;
  label?: string;
  stock?: number | string;
  quantity?: number | string;
};

type ProductStockApiDto = {
  id?: string | number;
  name?: string;
  title?: string;
  stock?: number | string;
  quantity?: number | string;
  variantStock?: VariantStockApiDto[];
  variant_stock?: VariantStockApiDto[];
  variants?: VariantStockApiDto[];
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const normalizeVariant = (variant: VariantStockApiDto, index: number): VariantStock => ({
  id: String(variant.id ?? variant.sku ?? `variant-${index + 1}`),
  name: variant.name ?? variant.label ?? `Variante ${index + 1}`,
  stock: Math.max(0, Math.floor(toNumber(variant.stock ?? variant.quantity)))
});

const toStockItem = (dto: ProductStockApiDto): StockItem => {
  const variantStockRaw = dto.variantStock ?? dto.variant_stock ?? dto.variants ?? [];
  const variantStock = variantStockRaw.map(normalizeVariant);
  const fallbackStock = Math.max(0, Math.floor(toNumber(dto.stock ?? dto.quantity)));
  const totalStock = variantStock.length > 0 ? variantStock.reduce((total, variant) => total + variant.stock, 0) : fallbackStock;

  return {
    productId: String(dto.id ?? ''),
    productName: dto.name ?? dto.title ?? 'Producto sin nombre',
    totalStock,
    hasVariantStock: variantStock.length > 0,
    variantStock,
    alertLevel: getAlertLevel(totalStock)
  };
};

export const stockApiRepository = {
  async list(): Promise<StockItem[]> {
    const { data } = await httpClient.get<ProductStockApiDto[] | { items?: ProductStockApiDto[]; data?: ProductStockApiDto[] }>(
      API_ENDPOINTS.stock.list
    );

    const items = Array.isArray(data) ? data : data.items ?? data.data ?? [];
    return items.map(toStockItem);
  },
  async update(payload: StockUpdatePayload): Promise<StockItem> {
    const body = payload.variantStock?.length
      ? {
          stock: payload.stock,
          variantStock: payload.variantStock.map((variant) => ({
            id: variant.id,
            name: variant.name,
            stock: Math.max(0, Math.floor(variant.stock))
          })),
          reason: payload.reason
        }
      : { stock: payload.stock, reason: payload.reason };

    const { data } = await httpClient.patch<ProductStockApiDto>(API_ENDPOINTS.stock.byProductId(payload.productId), body);
    return toStockItem(data);
  }
};
