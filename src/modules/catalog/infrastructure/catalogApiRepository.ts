import type { Product } from '@/mocks/db';
import type { CatalogListResult, CatalogRepository } from '@/modules/catalog/domain/catalog.types';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';

type CatalogProductDto = {
  id?: string | number;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  image_url?: string;
  images?: string[];
  attributes?: Record<string, string>;
  active?: boolean;
  variants?: Array<{ name: string; options: string[] }>;
};

type CatalogListApiResponse =
  | CatalogProductDto[]
  | {
      items?: CatalogProductDto[];
      data?: CatalogProductDto[];
      content?: CatalogProductDto[];
      total?: number;
      totalItems?: number;
      totalElements?: number;
      page?: number;
      currentPage?: number;
      number?: number;
      pageSize?: number;
      size?: number;
    };

const toProduct = (product: CatalogProductDto): Product => ({
  id: String(product.id ?? ''),
  name: product.name ?? 'Producto sin nombre',
  description: product.description ?? '',
  category: product.category ?? 'sin-categoria',
  price: typeof product.price === 'number' ? product.price : 0,
  stock: typeof product.stock === 'number' ? product.stock : 0,
  imageUrl: product.imageUrl ?? product.image_url ?? 'https://placehold.co/640x640?text=Producto',
  images: product.images ?? [],
  attributes: product.attributes ?? {},
  active: product.active ?? true,
  variants: product.variants ?? []
});

const parseListResponse = (
  response: CatalogListApiResponse,
  fallbackPage: number,
  fallbackPageSize: number
): CatalogListResult => {
  if (Array.isArray(response)) {
    return {
      items: response.map(toProduct),
      total: response.length,
      page: fallbackPage,
      pageSize: fallbackPageSize
    };
  }

  const rawItems = response.items ?? response.data ?? response.content ?? [];

  return {
    items: rawItems.map(toProduct),
    total: response.total ?? response.totalItems ?? response.totalElements ?? rawItems.length,
    page: response.page ?? response.currentPage ?? response.number ?? fallbackPage,
    pageSize: response.pageSize ?? response.size ?? fallbackPageSize
  };
};

export const catalogApiRepository: CatalogRepository = {
  async list(filters) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 8;

    const { data } = await httpClient.get<CatalogListApiResponse>(API_ENDPOINTS.catalog.products, {
      params: {
        search: filters.search || undefined,
        category: filters.category || undefined,
        sort: filters.sort || undefined,
        page,
        pageSize,
        minPrice: typeof filters.minPrice === 'number' ? filters.minPrice : undefined,
        maxPrice: typeof filters.maxPrice === 'number' ? filters.maxPrice : undefined,
        inStock: typeof filters.inStock === 'boolean' ? filters.inStock : undefined
      }
    });

    return parseListResponse(data, page, pageSize);
  },
  async getById(id) {
    const { data } = await httpClient.get<CatalogProductDto>(API_ENDPOINTS.catalog.productById(id));

    if (!data || (data.id === undefined && !data.name)) {
      return undefined;
    }

    return toProduct(data);
  }
};
