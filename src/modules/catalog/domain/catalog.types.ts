export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  images?: string[];
  active: boolean;
  stock: number;
  attributes: Record<string, string>;
  variants?: Array<{ name: string; options: string[] }>;
}

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
  getByIdOrSlug(identifier: string): Promise<Product | undefined>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
}
