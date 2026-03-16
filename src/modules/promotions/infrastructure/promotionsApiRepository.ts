import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { Promotion, PromotionUpsertInput } from '@/modules/promotions/domain/promotion.types';

type PromotionApiDto = {
  id?: string | number;
  name?: string;
  promotionName?: string;
  promotion_name?: string;
  scope?: Promotion['scope'];
  promotionType?: Promotion['scope'];
  promotion_type?: Promotion['scope'];
  type?: Promotion['type'];
  discountType?: Promotion['type'];
  discount_type?: Promotion['type'];
  amount?: number | string;
  discountValue?: number | string;
  discount_value?: number | string;
  minQty?: number | string;
  minimumQuantity?: number | string;
  minimum_quantity?: number | string;
  category?: string;
  categoryId?: string | number;
  category_id?: string | number;
  productId?: string | number;
  product_id?: string | number;
  startDate?: string;
  startsAt?: string;
  starts_at?: string;
  endDate?: string;
  endsAt?: string;
  ends_at?: string;
  active?: boolean;
  isActive?: boolean;
  is_active?: boolean;
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
  name: dto.name ?? dto.promotionName ?? dto.promotion_name ?? 'Promoción sin nombre',
  scope: dto.scope ?? dto.promotionType ?? dto.promotion_type ?? 'quantity',
  type: dto.type ?? dto.discountType ?? dto.discount_type ?? 'percentage',
  amount: toNumber(dto.amount ?? dto.discountValue ?? dto.discount_value) ?? 0,
  minQty: toNumber(dto.minQty ?? dto.minimumQuantity ?? dto.minimum_quantity),
  category: dto.category,
  productId: dto.productId ? String(dto.productId) : dto.product_id ? String(dto.product_id) : undefined,
  startDate: dto.startDate ?? dto.startsAt ?? dto.starts_at,
  endDate: dto.endDate ?? dto.endsAt ?? dto.ends_at,
  active: dto.active ?? dto.isActive ?? dto.is_active ?? true
});

const toPromotionPayload = (payload: PromotionUpsertInput) => ({
  name: payload.name,
  promotionName: payload.name,
  scope: payload.scope,
  promotionType: payload.scope,
  type: payload.type,
  discountType: payload.type,
  amount: payload.amount,
  discountValue: payload.amount,
  minQty: payload.minQty,
  minimumQuantity: payload.minQty,
  category: payload.category,
  productId: payload.productId,
  startDate: payload.startDate,
  startsAt: payload.startDate,
  endDate: payload.endDate,
  endsAt: payload.endDate,
  active: payload.active,
  isActive: payload.active
});

export const promotionsApiRepository = {
  async list(): Promise<Promotion[]> {
    const { data } = await httpClient.get<PromotionApiDto[] | { items?: PromotionApiDto[]; data?: PromotionApiDto[] }>(API_ENDPOINTS.promotions);
    const items = Array.isArray(data) ? data : data.items ?? data.data ?? [];
    return items.map(toPromotionEntity);
  },
  async create(payload: PromotionUpsertInput): Promise<Promotion> {
    const { data } = await httpClient.post<PromotionApiDto>(API_ENDPOINTS.promotions, toPromotionPayload(payload));
    return toPromotionEntity(data);
  },
  async update(id: string, payload: PromotionUpsertInput): Promise<Promotion> {
    const { data } = await httpClient.put<PromotionApiDto>(API_ENDPOINTS.promotionById(id), toPromotionPayload(payload));
    return toPromotionEntity(data);
  },
  async toggle(id: string, active: boolean): Promise<Promotion> {
    const { data } = await httpClient.patch<PromotionApiDto>(API_ENDPOINTS.promotionStatusById(id), { active, isActive: active });
    return toPromotionEntity(data);
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.promotionById(id));
  }
};
