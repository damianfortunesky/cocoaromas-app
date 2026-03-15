import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApiRepository } from '@/modules/categories/infrastructure/categoriesApiRepository';
import type { CategoryUpsertInput } from '@/modules/categories/domain/category.types';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApiRepository.list()
  });

export const useAdminCategories = () =>
  useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoriesApiRepository.listAdmin()
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CategoryUpsertInput) => categoriesApiRepository.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpsertInput }) => categoriesApiRepository.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApiRepository.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });
};
