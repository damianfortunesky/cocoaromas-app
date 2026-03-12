import { useQuery } from '@tanstack/react-query';
import { env } from '@/shared/config/env';
import { mockCatalogRepository } from '@/modules/catalog/infrastructure/mockCatalogRepository';
import { catalogApiRepository } from '@/modules/catalog/infrastructure/catalogApiRepository';
import type { CatalogFilters } from '@/modules/catalog/domain/catalog.types';

const catalogRepository = env.useMockApi ? mockCatalogRepository : catalogApiRepository;

export function useCatalog(filters: CatalogFilters) {
  return useQuery({ queryKey: ['catalog', filters], queryFn: () => catalogRepository.list(filters) });
}

export function useProductDetail(id: string) {
  return useQuery({ queryKey: ['product', id], queryFn: () => catalogRepository.getById(id), enabled: Boolean(id) });
}
