import type { Product } from '@/mocks/db';
export interface CatalogFilters { search?: string; category?: string; sort?: 'name' | 'price'; page?: number; pageSize?: number; }
export interface CatalogRepository { list(filters: CatalogFilters): Promise<{ items: Product[]; total: number }>; getById(id: string): Promise<Product | undefined>; }
