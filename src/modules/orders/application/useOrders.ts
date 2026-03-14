import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApiRepository, type AdminOrdersFilters } from '@/modules/orders/infrastructure/ordersApiRepository';
import type { CheckoutPayload, OrderStatus } from '@/modules/orders/domain/order.types';

export function useMyOrders(userId: string) {
  return useQuery({
    queryKey: ['my-orders', userId],
    queryFn: () => ordersApiRepository.listByUser(),
    enabled: Boolean(userId)
  });
}

export function useAdminOrders(filters: AdminOrdersFilters) {
  return useQuery({
    queryKey: ['admin-orders', filters.status ?? 'all', filters.search ?? ''],
    queryFn: () => ordersApiRepository.listAdmin(filters)
  });
}

export function useAdminOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: ['admin-order-detail', orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error('No se indicó pedido');
      }

      const order = await ordersApiRepository.getAdminById(orderId);

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
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => ordersApiRepository.updateAdminStatus(id, status),
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
    mutationFn: (payload: CheckoutPayload) => ordersApiRepository.create(payload),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['my-orders', order.userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    }
  });
}
