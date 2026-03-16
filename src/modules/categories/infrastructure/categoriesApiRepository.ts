import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { Category, CategoryUpsertInput } from '@/modules/categories/domain/category.types';

type CategoryApiDto = {
  id?: string | number;
  name?: string;
  categoryName?: string;
  category_name?: string;
  title?: string;
  slug?: string;
  displayOrder?: number | string;
  display_order?: number | string;
};

const toCategory = (dto: CategoryApiDto, index: number): Category => ({
  id: String(dto.id ?? dto.slug ?? dto.name ?? dto.categoryName ?? `category-${index + 1}`),
  name: dto.name ?? dto.categoryName ?? dto.category_name ?? dto.title ?? 'Sin nombre',
  slug: dto.slug ?? '',
  displayOrder: Number(dto.displayOrder ?? dto.display_order ?? 0)
});

const normalizeList = (data: CategoryApiDto[] | { items?: CategoryApiDto[]; data?: CategoryApiDto[] }): CategoryApiDto[] =>
  Array.isArray(data) ? data : data.items ?? data.data ?? [];

const toCategoryPayload = (payload: CategoryUpsertInput) => ({
  name: payload.name,
  categoryName: payload.name,
  slug: payload.slug,
  displayOrder: payload.displayOrder,
  display_order: payload.displayOrder
});

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
    const { data } = await httpClient.post<CategoryApiDto>(API_ENDPOINTS.adminCategories, toCategoryPayload(payload));
    return toCategory(data, 0);
  },
  async update(id: string, payload: CategoryUpsertInput): Promise<Category> {
    const { data } = await httpClient.put<CategoryApiDto>(API_ENDPOINTS.adminCategoryById(id), toCategoryPayload(payload));
    return toCategory(data, 0);
  },
  async remove(id: string): Promise<void> {
    await httpClient.delete(API_ENDPOINTS.adminCategoryById(id));
  }
};
