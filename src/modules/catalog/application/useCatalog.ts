import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/mocks/db';
import { env } from '@/shared/config/env';
import { mockCatalogRepository } from '@/modules/catalog/infrastructure/mockCatalogRepository';
import { catalogApiRepository } from '@/modules/catalog/infrastructure/catalogApiRepository';
import type { CatalogFilters } from '@/modules/catalog/domain/catalog.types';

const catalogRepository = env.useMockApi ? mockCatalogRepository : catalogApiRepository;

export function useCatalog(filters: CatalogFilters) {
  return useQuery({ queryKey: ['catalog', filters], queryFn: () => catalogRepository.list(filters) });
}

export function useProductDetail(identifier: string) {
  return useQuery({
    queryKey: ['product', identifier],
    queryFn: () => catalogRepository.getByIdOrSlug(identifier),
    enabled: Boolean(identifier)
  });
}

export function useRelatedProducts(product: Product | undefined, limit = 4) {
  return useQuery({
    queryKey: ['product-related', product?.id, product?.category, limit],
    queryFn: () => {
      if (!product) return Promise.resolve([]);
      return catalogRepository.getRelatedProducts(product, limit);
    },
    enabled: Boolean(product)
  });
}
