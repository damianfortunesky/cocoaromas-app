import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/shared/config/env';
import { mockOrdersRepository } from '@/modules/orders/infrastructure/mockOrdersRepository';
import { ordersApiRepository } from '@/modules/orders/infrastructure/ordersApiRepository';
import type { CheckoutPayload } from '@/modules/orders/domain/order.types';

const ordersRepository = env.useMockApi ? mockOrdersRepository : ordersApiRepository;

export function useMyOrders(userId: string) {
  return useQuery({
    queryKey: ['my-orders', userId],
    queryFn: () => (env.useMockApi ? mockOrdersRepository.listByUser(userId) : ordersApiRepository.listByUser()),
    enabled: Boolean(userId)
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => ordersRepository.create(payload),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders', order.userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    }
  });
}
