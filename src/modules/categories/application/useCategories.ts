import { useQuery } from '@tanstack/react-query';
import { categoriesApiRepository } from '@/modules/categories/infrastructure/categoriesApiRepository';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApiRepository.list()
  });
