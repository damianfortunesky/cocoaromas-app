import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PromotionUpsertInput } from '@/modules/promotions/domain/promotion.types';
import { promotionsApiRepository } from '@/modules/promotions/infrastructure/promotionsApiRepository';

export const usePromotions = () =>
  useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionsApiRepository.list()
  });

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromotionUpsertInput) => promotionsApiRepository.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PromotionUpsertInput }) => promotionsApiRepository.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};

export const useTogglePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => promotionsApiRepository.toggle(id, active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promotionsApiRepository.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};
