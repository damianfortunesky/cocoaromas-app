import { httpClient } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import type {
  ProductCreateInput,
  ProductEntity,
  ProductListFilters,
  ProductUpdateInput
} from '@/modules/products/domain/productAdmin.types';

type ProductApiDto = {
  id?: string | number;
  name?: string;
  productName?: string;
  product_name?: string;
  title?: string;
  description?: string;
  productDescription?: string;
  product_description?: string;
  category?: string;
  categoryLabel?: string;
  categoryId?: string | number;
  category_id?: string | number;
  categoryName?: string;
  category_name?: string;
  price?: number | string;
  stock?: number | string;
  stockQuantity?: number | string;
  stock_quantity?: number | string;
  imageUrl?: string;
  image_url?: string;
  active?: boolean;
  isActive?: boolean;
  is_active?: boolean;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toProductEntity = (dto: ProductApiDto): ProductEntity => {
  const imageUrl = dto.imageUrl ?? dto.image_url ?? 'https://placehold.co/100x100?text=Producto';
  const categoryId = String(dto.categoryId ?? dto.category_id ?? '');
  const categoryName = dto.categoryName ?? dto.category_name ?? dto.categoryLabel ?? dto.category ?? '';

  return {
    id: String(dto.id ?? ''),
    name: dto.name ?? dto.productName ?? dto.product_name ?? dto.title ?? 'Producto sin nombre',
    description: dto.description ?? dto.productDescription ?? dto.product_description ?? '',
    categoryId,
    categoryName,
    price: toNumber(dto.price),
    stock: toNumber(dto.stock ?? dto.stockQuantity ?? dto.stock_quantity),
    imageUrl,
    active: dto.active ?? dto.isActive ?? dto.is_active ?? true
  };
};

const toProductPayload = (payload: ProductCreateInput | ProductUpdateInput): ProductApiDto => {
  const data: ProductApiDto = {};

  if (payload.name !== undefined) data.name = payload.name;
  if (payload.description !== undefined) data.description = payload.description;
  if (payload.categoryId !== undefined) data.categoryId = payload.categoryId;
  if (payload.price !== undefined) data.price = payload.price;
  if (payload.stock !== undefined) data.stockQuantity = payload.stock;
  if (payload.imageUrl !== undefined) data.imageUrl = payload.imageUrl;
  if (payload.active !== undefined) data.isActive = payload.active;

  return data;
};

export const productsApiRepository = {
  async list(filters: ProductListFilters = {}): Promise<ProductEntity[]> {
    const { data } = await httpClient.get<ProductApiDto[] | { items?: ProductApiDto[]; data?: ProductApiDto[] }>(API_ENDPOINTS.products, {
      params: {
        search: filters.search,
        category: filters.category
      }
    });
    const items = Array.isArray(data) ? data : data.items ?? data.data ?? [];
    return items.map(toProductEntity);
  },
  async create(payload: ProductCreateInput): Promise<ProductEntity> {
    const { data } = await httpClient.post<ProductApiDto>(API_ENDPOINTS.products, toProductPayload(payload));
    return toProductEntity(data);
  },
  async update(id: string, payload: ProductUpdateInput): Promise<ProductEntity> {
    const { data } = await httpClient.put<ProductApiDto>(API_ENDPOINTS.productById(id), toProductPayload(payload));
    return toProductEntity(data);
  },
  async updateStatus(id: string, active: boolean): Promise<ProductEntity> {
    const { data } = await httpClient.patch<ProductApiDto>(API_ENDPOINTS.productStatusById(id), { active, isActive: active });
    return toProductEntity(data);
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.productById(id));
  }
};
