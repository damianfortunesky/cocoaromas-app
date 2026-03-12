import { httpClient } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import type { PaginatedResult } from '@/shared/types/common';
import type { CheckoutPayload, Order, OrderStatus } from '@/modules/orders/domain/order.types';

export interface AdminOrdersFilters {
  status?: OrderStatus;
  search?: string;
}

function extractOrders(payload: Order[] | PaginatedResult<Order>): Order[] {
  return Array.isArray(payload) ? payload : payload.items;
}

export const ordersApiRepository = {
  async create(payload: CheckoutPayload): Promise<Order> {
    const { data } = await httpClient.post<Order>(API_ENDPOINTS.orders.create, payload);
    return data;
  },
  async listByUser(): Promise<Order[]> {
    const { data } = await httpClient.get<Order[]>(API_ENDPOINTS.orders.myOrders);
    return data;
  },
  async listAdmin(filters: AdminOrdersFilters = {}): Promise<Order[]> {
    const params: Record<string, string> = {};

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    const { data } = await httpClient.get<Order[] | PaginatedResult<Order>>(API_ENDPOINTS.orders.adminList, {
      params
    });

    return extractOrders(data);
  },
  async getAdminById(id: string): Promise<Order> {
    const { data } = await httpClient.get<Order>(API_ENDPOINTS.orders.adminById(id));
    return data;
  },
  async updateAdminStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await httpClient.patch<Order>(API_ENDPOINTS.orders.adminUpdateStatus(id), { status });
    return data;
  }
};
