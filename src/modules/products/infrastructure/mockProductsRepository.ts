import { mockProducts } from '@/mocks/db';
import type { ProductCreateInput, ProductEntity, ProductUpdateInput } from '@/modules/products/domain/productAdmin.types';

const normalizeProduct = (product: (typeof mockProducts)[number]): ProductEntity => ({
  ...product,
  images: product.images?.length ? product.images : [product.imageUrl]
});

export const mockProductsRepository = {
  async list(): Promise<ProductEntity[]> {
    return mockProducts.map(normalizeProduct);
  },
  async create(input: ProductCreateInput): Promise<ProductEntity> {
    const item = { ...input, id: `p${Date.now()}` };
    mockProducts.push(item);
    return normalizeProduct(item);
  },
  async update(id: string, data: ProductUpdateInput): Promise<ProductEntity | undefined> {
    const product = mockProducts.find((current) => current.id === id);
    if (product) {
      Object.assign(product, data);
      return normalizeProduct(product);
    }
    return undefined;
  },
  async remove(id: string): Promise<void> {
    const index = mockProducts.findIndex((product) => product.id === id);
    if (index >= 0) mockProducts.splice(index, 1);
  }
};
