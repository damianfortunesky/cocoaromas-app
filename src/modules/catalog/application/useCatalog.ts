import { useQuery } from '@tanstack/react-query';
import { mockCatalogRepository } from '@/modules/catalog/infrastructure/mockCatalogRepository';
import type { CatalogFilters } from '@/modules/catalog/domain/catalog.types';

export function useCatalog(filters: CatalogFilters) {
  return useQuery({ queryKey: ['catalog', filters], queryFn: () => mockCatalogRepository.list(filters) });
}

export function useProductDetail(id: string) {
  return useQuery({ queryKey: ['product', id], queryFn: () => mockCatalogRepository.getById(id) });
}
