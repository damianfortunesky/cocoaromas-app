import { httpClient } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import type {
  ProductCreateInput,
  ProductEntity,
  ProductListFilters,
  ProductUpdateInput,
  ProductVariant
} from '@/modules/products/domain/productAdmin.types';

type ProductApiDto = {
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  category?: string;
  categoryId?: string | number;
  categoryName?: string;
  price?: number | string;
  stock?: number | string;
  imageUrl?: string;
  image_url?: string;
  images?: string[];
  attributes?: Record<string, unknown>;
  variants?: Array<{
    name?: string;
    options?: Array<string | { value?: string; label?: string }>;
  }>;
  active?: boolean;
  isActive?: boolean;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toStringRecord = (attributes?: Record<string, unknown>): Record<string, string> =>
  Object.entries(attributes ?? {}).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      acc[key] = String(value);
    }
    return acc;
  }, {});

const toVariants = (variants?: ProductApiDto['variants']): ProductVariant[] | undefined => {
  const mapped =
    variants?.map((variant) => ({
      name: variant.name ?? 'Variante',
      options:
        variant.options
          ?.map((option) => (typeof option === 'string' ? option : option.value ?? option.label ?? ''))
          .filter(Boolean) ?? []
    })) ?? [];

  return mapped.length > 0 ? mapped : undefined;
};

const toProductEntity = (dto: ProductApiDto): ProductEntity => {
  const images = dto.images ?? [];
  const imageUrl = dto.imageUrl ?? dto.image_url ?? images[0] ?? 'https://placehold.co/100x100?text=Producto';

  return {
    id: String(dto.id ?? ''),
    name: dto.name ?? dto.title ?? 'Producto sin nombre',
    description: dto.description ?? '',
    category: dto.categoryName ?? dto.category ?? String(dto.categoryId ?? ''),
    price: toNumber(dto.price),
    stock: toNumber(dto.stock),
    imageUrl,
    images: images.length > 0 ? images : [imageUrl],
    attributes: toStringRecord(dto.attributes),
    variants: toVariants(dto.variants),
    active: dto.active ?? dto.isActive ?? true
  };
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
    const { data } = await httpClient.post<ProductApiDto>(API_ENDPOINTS.products, payload);
    return toProductEntity(data);
  },
  async update(id: string, payload: ProductUpdateInput): Promise<ProductEntity> {
    const { data } = await httpClient.put<ProductApiDto>(API_ENDPOINTS.productById(id), payload);
    return toProductEntity(data);
  },
  async updateStatus(id: string, active: boolean): Promise<ProductEntity> {
    const { data } = await httpClient.patch<ProductApiDto>(API_ENDPOINTS.productStatusById(id), { active });
    return toProductEntity(data);
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.productById(id));
  }
};
