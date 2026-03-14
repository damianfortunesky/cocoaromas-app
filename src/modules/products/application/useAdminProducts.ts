import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApiRepository } from '@/modules/products/infrastructure/productsApiRepository';
import type { ProductCreateInput, ProductListFilters, ProductUpdateInput } from '@/modules/products/domain/productAdmin.types';

export const useAdminProducts = (filters: ProductListFilters = {}) =>
  useQuery({
    queryKey: ['admin-products', filters.search ?? '', filters.category ?? 'all'],
    queryFn: () => productsApiRepository.list(filters)
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductCreateInput) => productsApiRepository.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductUpdateInput }) => productsApiRepository.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => productsApiRepository.updateStatus(id, active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApiRepository.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });
};
