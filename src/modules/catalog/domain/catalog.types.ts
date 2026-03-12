import type { Product } from '@/mocks/db';

export interface CatalogFilters {
  search?: string;
  category?: string;
  sort?: 'name' | 'price';
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface CatalogListResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CatalogRepository {
  list(filters: CatalogFilters): Promise<CatalogListResult>;
  getById(id: string): Promise<Product | undefined>;
}
