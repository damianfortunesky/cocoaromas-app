import { useMutation, useQuery } from '@tanstack/react-query';
import { mockOrdersRepository } from '@/modules/orders/infrastructure/mockOrdersRepository';

export function useMyOrders(userId: string) {
  return useQuery({ queryKey: ['my-orders', userId], queryFn: () => mockOrdersRepository.listByUser(userId) });
}

export function useCreateOrder() {
  return useMutation({ mutationFn: ({ userId, total, paymentMethod }: { userId: string; total: number; paymentMethod: 'transfer' | 'mercado_pago' }) => mockOrdersRepository.create(userId, total, paymentMethod) });
}
