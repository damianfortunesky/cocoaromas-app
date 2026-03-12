import { mockProducts } from '@/mocks/db';
import type { CatalogRepository } from '@/modules/catalog/domain/catalog.types';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const mockCatalogRepository: CatalogRepository = {
  async list(filters) {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 8;
    let items = [...mockProducts].filter((p) => p.active);
    if (filters.search) items = items.filter((p) => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
    if (filters.category) items = items.filter((p) => p.category === filters.category);
    const minPrice = typeof filters.minPrice === 'number' ? filters.minPrice : null;
    const maxPrice = typeof filters.maxPrice === 'number' ? filters.maxPrice : null;

    if (minPrice !== null) items = items.filter((p) => p.price >= minPrice);
    if (maxPrice !== null) items = items.filter((p) => p.price <= maxPrice);
    if (typeof filters.inStock === 'boolean') items = items.filter((p) => (filters.inStock ? p.stock > 0 : p.stock <= 0));
    if (filters.sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sort === 'price') items.sort((a, b) => a.price - b.price);
    return {
      items: items.slice((page - 1) * pageSize, page * pageSize),
      total: items.length,
      page,
      pageSize
    };
  },
  async getByIdOrSlug(identifier) {
    const normalizedIdentifier = normalize(identifier);
    return mockProducts.find((p) => normalize(p.id) === normalizedIdentifier || normalize(p.name).replace(/\s+/g, '-') === normalizedIdentifier);
  },
  async getRelatedProducts(product, limit = 4) {
    return mockProducts
      .filter((candidate) => candidate.active && candidate.category === product.category && candidate.id !== product.id)
      .slice(0, limit);
  }
};
