import { mockOrders } from '@/mocks/db';
import type { CheckoutPayload, Order, OrderStatus } from '@/modules/orders/domain/order.types';

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
  async listAll() {
    return mockOrders;
  },
  async updateStatus(id: string, status: OrderStatus) {
    const order = mockOrders.find((o) => o.id === id);
    if (order) order.status = status;
    return order;
  }
};
