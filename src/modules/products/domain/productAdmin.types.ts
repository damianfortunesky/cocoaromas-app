export type ProductVariant = {
  name: string;
  options: string[];
};

export type ProductEntity = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  images: string[];
  attributes: Record<string, string>;
  variants?: ProductVariant[];
  active: boolean;
};

export type ProductCreateInput = Omit<ProductEntity, 'id' | 'category'> & {
  category: string;
};

export type ProductUpdateInput = Partial<ProductCreateInput>;

export type ProductListFilters = {
  search?: string;
  category?: string;
};
