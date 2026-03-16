export type ProductVariant = {
  name: string;
  options: string[];
};

export type ProductEntity = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  stock: number;
  imageUrl: string;
  active: boolean;
};

export type ProductCreateInput = Omit<ProductEntity, 'id' | 'categoryName'>;

export type ProductUpdateInput = Partial<ProductCreateInput>;

export type ProductListFilters = {
  search?: string;
  category?: string;
};
