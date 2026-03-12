import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/shared/config/env';
import { mockProductsRepository } from '@/modules/products/infrastructure/mockProductsRepository';
import { productsApiRepository } from '@/modules/products/infrastructure/productsApiRepository';
import type { ProductCreateInput, ProductUpdateInput } from '@/modules/products/domain/productAdmin.types';

const repository = env.useMockApi ? mockProductsRepository : productsApiRepository;

export const useAdminProducts = () =>
  useQuery({
    queryKey: ['admin-products'],
    queryFn: () => repository.list()
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductCreateInput) => repository.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductUpdateInput }) => repository.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    }
  });
};
