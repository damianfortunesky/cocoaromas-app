import { mockOrders } from '@/mocks/db';
import type { CheckoutPayload, Order, OrderStatus } from '@/modules/orders/domain/order.types';
import type { AdminOrdersFilters } from '@/modules/orders/infrastructure/ordersApiRepository';

export const mockOrdersRepository = {
  async create(payload: CheckoutPayload): Promise<Order> {
    const status: OrderStatus = payload.paymentMethod === 'transfer' ? 'esperando_pago' : 'pendiente';
    const order: Order = {
      id: `o${Date.now()}`,
      userId: payload.userId,
      subtotal: payload.subtotal,
      discount: payload.discount,
      total: payload.total,
      paymentMethod: payload.paymentMethod,
      status,
      shippingAddress: payload.shippingAddress,
      contactPhone: payload.contactPhone,
      buyerName: payload.buyerName,
      notes: payload.notes,
      paymentGateway: payload.paymentMethod === 'mercado_pago' ? 'mercado_pago' : 'manual_transfer',
      paymentReference: undefined,
      createdAt: new Date().toISOString(),
      items: payload.items
    };

    mockOrders.push(order);
    return order;
  },
  async listByUser(userId: string) {
    return mockOrders.filter((o) => o.userId === userId);
  },
  async listAdmin(filters: AdminOrdersFilters = {}) {
    const normalizedSearch = filters.search?.trim().toLowerCase();

    return mockOrders.filter((order) => {
      const statusMatches = filters.status ? order.status === filters.status : true;
      const searchMatches = normalizedSearch
        ? order.id.toLowerCase().includes(normalizedSearch)
          || order.buyerName.toLowerCase().includes(normalizedSearch)
        : true;

      return statusMatches && searchMatches;
    });
  },
  async getAdminById(id: string) {
    return mockOrders.find((o) => o.id === id);
  },
  async updateAdminStatus(id: string, status: OrderStatus) {
    const order = mockOrders.find((o) => o.id === id);
    if (order) order.status = status;
    return order;
  }
};
