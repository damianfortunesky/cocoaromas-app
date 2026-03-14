import { useQuery } from '@tanstack/react-query';
import { catalogApiRepository } from '@/modules/catalog/infrastructure/catalogApiRepository';
import type { CatalogFilters, Product } from '@/modules/catalog/domain/catalog.types';

export function useCatalog(filters: CatalogFilters) {
  return useQuery({ queryKey: ['catalog', filters], queryFn: () => catalogApiRepository.list(filters) });
}

export function useProductDetail(identifier: string) {
  return useQuery({
    queryKey: ['product', identifier],
    queryFn: () => catalogApiRepository.getByIdOrSlug(identifier),
    enabled: Boolean(identifier)
  });
}

export function useRelatedProducts(product: Product | undefined, limit = 4) {
  return useQuery({
    queryKey: ['product-related', product?.id, product?.category, limit],
    queryFn: () => {
      if (!product) return Promise.resolve([]);
      return catalogApiRepository.getRelatedProducts(product, limit);
    },
    enabled: Boolean(product)
  });
}
