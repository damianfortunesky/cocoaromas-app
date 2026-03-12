import { useMutation, useQuery } from '@tanstack/react-query';
import { mockProductsRepository } from '@/modules/products/infrastructure/mockProductsRepository';

export const useAdminProducts = () => useQuery({ queryKey: ['admin-products'], queryFn: () => mockProductsRepository.list() });

export const useCreateProduct = () =>
  useMutation({ mutationFn: (payload: Parameters<typeof mockProductsRepository.create>[0]) => mockProductsRepository.create(payload) });

export const useUpdateProduct = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof mockProductsRepository.update>[1] }) =>
      mockProductsRepository.update(id, data)
  });

export const useDeleteProduct = () =>
  useMutation({ mutationFn: (id: string) => mockProductsRepository.remove(id) });
