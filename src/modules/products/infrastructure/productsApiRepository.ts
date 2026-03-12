import { httpClient } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';

export type ProductDto = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  images: string[];
  attributes: Record<string, string>;
  active: boolean;
};

export type CreateProductPayload = Omit<ProductDto, 'id'>;

export const productsApiRepository = {
  async list(): Promise<ProductDto[]> {
    const { data } = await httpClient.get<ProductDto[]>(API_ENDPOINTS.products);
    return data;
  },
  async create(payload: CreateProductPayload): Promise<ProductDto> {
    const { data } = await httpClient.post<ProductDto>(API_ENDPOINTS.products, payload);
    return data;
  }
};
