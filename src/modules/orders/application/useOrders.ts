import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/shared/config/env';
import { mockOrdersRepository } from '@/modules/orders/infrastructure/mockOrdersRepository';
import { ordersApiRepository, type AdminOrdersFilters } from '@/modules/orders/infrastructure/ordersApiRepository';
import type { CheckoutPayload, OrderStatus } from '@/modules/orders/domain/order.types';

const ordersRepository = env.useMockApi ? mockOrdersRepository : ordersApiRepository;

export function useMyOrders(userId: string) {
  return useQuery({
    queryKey: ['my-orders', userId],
    queryFn: () => (env.useMockApi ? mockOrdersRepository.listByUser(userId) : ordersApiRepository.listByUser()),
    enabled: Boolean(userId)
  });
}

export function useAdminOrders(filters: AdminOrdersFilters) {
  return useQuery({
    queryKey: ['admin-orders', filters.status ?? 'all', filters.search ?? ''],
    queryFn: () => ordersRepository.listAdmin(filters)
  });
}

export function useAdminOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: ['admin-order-detail', orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error('No se indicó pedido');
      }

      const order = await ordersRepository.getAdminById(orderId);

      if (!order) {
        throw new Error('No se encontró el pedido');
      }

      return order;
    },
    enabled: Boolean(orderId)
  });
}

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => ordersRepository.updateAdminStatus(id, status),
    onSuccess: (order) => {
      if (!order) return;

      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order-detail', order.id] });
      queryClient.invalidateQueries({ queryKey: ['my-orders', order.userId] });
    }
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
