import { useMutation, useQuery } from '@tanstack/react-query';
import { mockPromotionsRepository } from '@/modules/promotions/infrastructure/mockPromotionsRepository';

export const usePromotions = () => useQuery({ queryKey: ['promotions'], queryFn: () => mockPromotionsRepository.list() });
export const useCreatePromotion = () => useMutation({ mutationFn: (payload: Parameters<typeof mockPromotionsRepository.create>[0]) => mockPromotionsRepository.create(payload) });
