import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { Promotion, PromotionUpsertInput } from '@/modules/promotions/domain/promotion.types';

type PromotionApiDto = {
  id?: string | number;
  name?: string;
  scope?: Promotion['scope'];
  type?: Promotion['type'];
  amount?: number | string;
  minQty?: number | string;
  min_qty?: number | string;
  category?: string;
  productId?: string | number;
  product_id?: string | number;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  active?: boolean;
  isActive?: boolean;
};

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const toPromotionEntity = (dto: PromotionApiDto): Promotion => ({
  id: String(dto.id ?? ''),
  name: dto.name ?? 'Promoción sin nombre',
  scope: dto.scope ?? 'quantity',
  type: dto.type ?? 'percentage',
  amount: toNumber(dto.amount) ?? 0,
  minQty: toNumber(dto.minQty ?? dto.min_qty),
  category: dto.category,
  productId: dto.productId ? String(dto.productId) : dto.product_id ? String(dto.product_id) : undefined,
  startDate: dto.startDate ?? dto.start_date,
  endDate: dto.endDate ?? dto.end_date,
  active: dto.active ?? dto.isActive ?? true
});

export const promotionsApiRepository = {
  async list(): Promise<Promotion[]> {
    const { data } = await httpClient.get<PromotionApiDto[] | { items?: PromotionApiDto[]; data?: PromotionApiDto[] }>(API_ENDPOINTS.promotions);
    const items = Array.isArray(data) ? data : data.items ?? data.data ?? [];
    return items.map(toPromotionEntity);
  },
  async create(payload: PromotionUpsertInput): Promise<Promotion> {
    const { data } = await httpClient.post<PromotionApiDto>(API_ENDPOINTS.promotions, payload);
    return toPromotionEntity(data);
  },
  async update(id: string, payload: PromotionUpsertInput): Promise<Promotion> {
    const { data } = await httpClient.put<PromotionApiDto>(API_ENDPOINTS.promotionById(id), payload);
    return toPromotionEntity(data);
  },
  async toggle(id: string, active: boolean): Promise<Promotion> {
    const { data } = await httpClient.patch<PromotionApiDto>(API_ENDPOINTS.promotionStatusById(id), { active });
    return toPromotionEntity(data);
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.promotionById(id));
  }
};
