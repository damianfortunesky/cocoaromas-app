import { httpClient } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import type { CheckoutPayload, Order } from '@/modules/orders/domain/order.types';

export const ordersApiRepository = {
  async create(payload: CheckoutPayload): Promise<Order> {
    const { data } = await httpClient.post<Order>(API_ENDPOINTS.orders.create, payload);
    return data;
  },
  async listByUser(): Promise<Order[]> {
    const { data } = await httpClient.get<Order[]>(API_ENDPOINTS.orders.myOrders);
    return data;
  }
};
