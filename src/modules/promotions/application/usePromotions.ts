import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/shared/config/env';
import type { PromotionUpsertInput } from '@/modules/promotions/domain/promotion.types';
import { mockPromotionsRepository } from '@/modules/promotions/infrastructure/mockPromotionsRepository';
import { promotionsApiRepository } from '@/modules/promotions/infrastructure/promotionsApiRepository';

const repository = env.useMockApi ? mockPromotionsRepository : promotionsApiRepository;

export const usePromotions = () =>
  useQuery({
    queryKey: ['promotions'],
    queryFn: () => repository.list()
  });

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromotionUpsertInput) => repository.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PromotionUpsertInput }) => repository.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};

export const useTogglePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => repository.toggle(id, active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['promotions'] });
    }
  });
};
