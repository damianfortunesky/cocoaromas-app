import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { Category } from '@/modules/categories/domain/category.types';

type CategoryApiDto = {
  id?: string | number;
  name?: string;
  title?: string;
  slug?: string;
};

const toCategory = (dto: CategoryApiDto, index: number): Category => ({
  id: String(dto.id ?? dto.slug ?? dto.name ?? `category-${index + 1}`),
  name: dto.name ?? dto.title ?? 'Sin nombre',
  slug: dto.slug
});

export const categoriesApiRepository = {
  async list(): Promise<Category[]> {
    const { data } = await httpClient.get<CategoryApiDto[] | { items?: CategoryApiDto[]; data?: CategoryApiDto[] }>(API_ENDPOINTS.categories);
    const items = Array.isArray(data) ? data : data.items ?? data.data ?? [];
    return items.map(toCategory);
  }
};
