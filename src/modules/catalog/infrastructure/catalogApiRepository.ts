import type { CatalogListResult, CatalogRepository, Product } from '@/modules/catalog/domain/catalog.types';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { HttpError } from '@/shared/api/httpErrors';

type CatalogVariantOption = {
  label?: string;
  value?: string;
  name?: string;
  productName?: string;
  product_name?: string;
};

type CatalogVariantDto = {
  name?: string;
  productName?: string;
  product_name?: string;
  label?: string;
  options?: Array<string | CatalogVariantOption>;
  values?: Array<string | CatalogVariantOption>;
};

type CatalogProductDto = {
  id?: string | number;
  slug?: string;
  name?: string;
  productName?: string;
  product_name?: string;
  title?: string;
  description?: string;
  productDescription?: string;
  product_description?: string;
  shortDescription?: string;
  longDescription?: string;
  category?: string;
  categoryId?: string | number;
  category_id?: string | number;
  categoryName?: string;
  category_name?: string;
  price?: number | string;
  stock?: number | string;
  stockQuantity?: number | string;
  stock_quantity?: number | string;
  availableStock?: number | string;
  imageUrl?: string;
  image_url?: string;
  mainImage?: string;
  main_image?: string;
  images?: string[];
  gallery?: string[];
  active?: boolean;
  is_active?: boolean;
  isActive?: boolean;
  attributes?: Record<string, unknown>;
  specs?: Record<string, unknown>;
  details?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  variants?: CatalogVariantDto[];
};

type CatalogListApiResponse =
  | CatalogProductDto[]
  | {
      items?: CatalogProductDto[];
      data?: CatalogProductDto[];
      content?: CatalogProductDto[];
      results?: CatalogProductDto[];
      total?: number;
      totalItems?: number;
      totalElements?: number;
      count?: number;
      page?: number;
      currentPage?: number;
      number?: number;
      pageSize?: number;
      size?: number;
      limit?: number;
    };

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const toStringMap = (...sources: Array<Record<string, unknown> | undefined>): Record<string, string> => {
  const merged = sources.reduce<Record<string, unknown>>((acc, source) => ({ ...acc, ...(source ?? {}) }), {});

  return Object.entries(merged).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      acc[key] = String(value);
    }
    return acc;
  }, {});
};

const toVariantOptions = (options: Array<string | CatalogVariantOption> = []): string[] =>
  options
    .map((option) => {
      if (typeof option === 'string') return option;
      return option.value ?? option.label ?? option.name;
    })
    .filter((option): option is string => Boolean(option));

const toVariants = (variants: CatalogVariantDto[] = []): Array<{ name: string; options: string[] }> =>
  variants
    .map((variant) => {
      const variantName = variant.name ?? variant.label ?? 'Variante';
      const options = toVariantOptions(variant.options ?? variant.values ?? []);
      return {
        name: variantName,
        options
      };
    })
    .filter((variant) => variant.options.length > 0);

const toImageList = (product: CatalogProductDto): string[] => {
  const images = [
    ...(Array.isArray(product.images) ? product.images : []),
    ...(Array.isArray(product.gallery) ? product.gallery : [])
  ].filter((image): image is string => Boolean(image));

  return Array.from(new Set(images));
};

const toProduct = (product: CatalogProductDto): Product => {
  const images = toImageList(product);
  const mainImage =
    product.mainImage ??
    product.main_image ??
    product.imageUrl ??
    product.image_url ??
    images[0] ??
    'https://placehold.co/640x640?text=Producto';

  return {
    id: String(product.id ?? product.slug ?? ''),
    name: product.name ?? product.productName ?? product.product_name ?? product.title ?? 'Producto sin nombre',
    description: product.description ?? product.productDescription ?? product.product_description ?? product.shortDescription ?? product.longDescription ?? '',
    category: product.category ?? product.categoryName ?? product.category_name ?? String(product.categoryId ?? product.category_id ?? 'sin-categoria'),
    price: toNumber(product.price),
    stock: toNumber(product.stock ?? product.stockQuantity ?? product.stock_quantity ?? product.availableStock),
    imageUrl: mainImage,
    images,
    attributes: toStringMap(product.attributes, product.specs, product.details, product.metadata),
    active: product.active ?? product.isActive ?? product.is_active ?? true,
    variants: toVariants(product.variants)
  };
};

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

  const rawItems = response.items ?? response.data ?? response.content ?? response.results ?? [];

  return {
    items: rawItems.map(toProduct),
    total: response.total ?? response.totalItems ?? response.totalElements ?? response.count ?? rawItems.length,
    page: response.page ?? response.currentPage ?? response.number ?? fallbackPage,
    pageSize: response.pageSize ?? response.size ?? response.limit ?? fallbackPageSize
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
  async getByIdOrSlug(identifier) {
    try {
      const { data } = await httpClient.get<CatalogProductDto>(API_ENDPOINTS.catalog.productByIdentifier(identifier));

      if (!data || (data.id === undefined && data.slug === undefined && !data.name && !data.title)) {
        return undefined;
      }

      return toProduct(data);
    } catch (error) {
      const requestError = error as HttpError;
      if (requestError.status !== 404) {
        throw error;
      }

      const { data } = await httpClient.get<CatalogProductDto>(API_ENDPOINTS.catalog.productBySlug(identifier));
      if (!data || (data.id === undefined && data.slug === undefined && !data.name && !data.title)) {
        return undefined;
      }

      return toProduct(data);
    }
  },
  async getRelatedProducts(product, limit = 4) {
    const { data } = await httpClient.get<CatalogListApiResponse>(API_ENDPOINTS.catalog.relatedProducts(product.id), {
      params: {
        category: product.category,
        exclude: product.id,
        limit
      }
    });

    const parsed = parseListResponse(data, 1, limit);
    return parsed.items.filter((item) => item.id !== product.id).slice(0, limit);
  }
};
