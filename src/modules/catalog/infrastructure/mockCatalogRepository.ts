import { mockProducts } from '@/mocks/db';
import type { CatalogRepository } from '@/modules/catalog/domain/catalog.types';

export const mockCatalogRepository: CatalogRepository = {
  async list(filters) {
    const page = filters.page ?? 1; const pageSize = filters.pageSize ?? 8;
    let items = [...mockProducts].filter((p) => p.active);
    if (filters.search) items = items.filter((p) => p.name.toLowerCase().includes(filters.search!.toLowerCase()));
    if (filters.category) items = items.filter((p) => p.category === filters.category);
    if (filters.sort === 'name') items.sort((a,b)=>a.name.localeCompare(b.name));
    if (filters.sort === 'price') items.sort((a,b)=>a.price-b.price);
    return { items: items.slice((page-1)*pageSize, page*pageSize), total: items.length };
  },
  async getById(id) { return mockProducts.find((p) => p.id === id); }
};
