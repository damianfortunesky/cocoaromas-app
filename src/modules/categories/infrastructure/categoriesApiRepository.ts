import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { Category, CategoryUpsertInput } from '@/modules/categories/domain/category.types';

type CategoryApiDto = {
  id?: string | number;
  name?: string;
  title?: string;
  slug?: string;
  displayOrder?: number | string;
};

const toCategory = (dto: CategoryApiDto, index: number): Category => ({
  id: String(dto.id ?? dto.slug ?? dto.name ?? `category-${index + 1}`),
  name: dto.name ?? dto.title ?? 'Sin nombre',
  slug: dto.slug ?? '',
  displayOrder: Number(dto.displayOrder ?? 0)
});

const normalizeList = (data: CategoryApiDto[] | { items?: CategoryApiDto[]; data?: CategoryApiDto[] }): CategoryApiDto[] =>
  Array.isArray(data) ? data : data.items ?? data.data ?? [];

export const categoriesApiRepository = {
  async list(): Promise<Category[]> {
    const { data } = await httpClient.get<CategoryApiDto[] | { items?: CategoryApiDto[]; data?: CategoryApiDto[] }>(API_ENDPOINTS.categories);
    return normalizeList(data).map(toCategory);
  },
  async listAdmin(): Promise<Category[]> {
    const { data } = await httpClient.get<CategoryApiDto[] | { items?: CategoryApiDto[]; data?: CategoryApiDto[] }>(API_ENDPOINTS.adminCategories);
    return normalizeList(data).map(toCategory);
  },
  async create(payload: CategoryUpsertInput): Promise<Category> {
    const { data } = await httpClient.post<CategoryApiDto>(API_ENDPOINTS.adminCategories, payload);
    return toCategory(data, 0);
  },
  async update(id: string, payload: CategoryUpsertInput): Promise<Category> {
    const { data } = await httpClient.put<CategoryApiDto>(API_ENDPOINTS.adminCategoryById(id), payload);
    return toCategory(data, 0);
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.adminCategoryById(id));
  }
};
