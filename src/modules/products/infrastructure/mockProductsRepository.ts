import { mockProducts } from '@/mocks/db';

export const mockProductsRepository = {
  async list() { return mockProducts; },
  async create(input: Omit<(typeof mockProducts)[number], 'id'>) {
    const item = { ...input, id: `p${Date.now()}` };
    mockProducts.push(item);
    return item;
  },
  async update(id: string, data: Partial<(typeof mockProducts)[number]>) {
    const p = mockProducts.find((x) => x.id === id);
    if (p) Object.assign(p, data);
    return p;
  },
  async remove(id: string) { const idx = mockProducts.findIndex((p) => p.id === id); if (idx >= 0) mockProducts.splice(idx, 1); }
};
