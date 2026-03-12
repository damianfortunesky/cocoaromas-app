import { mockOrders } from '@/mocks/db';
import type { OrderStatus } from '@/modules/orders/domain/order.types';

export const mockOrdersRepository = {
  async create(userId: string, total: number, paymentMethod: 'transfer' | 'mercado_pago') {
    const status: OrderStatus = paymentMethod === 'transfer' ? 'esperando_pago' : 'pendiente';
    const order = { id: `o${Date.now()}`, userId, total, paymentMethod, status, createdAt: new Date().toISOString() };
    mockOrders.push(order);
    return order;
  },
  async listByUser(userId: string) { return mockOrders.filter((o) => o.userId === userId); },
  async listAll() { return mockOrders; },
  async updateStatus(id: string, status: OrderStatus) { const order = mockOrders.find((o) => o.id === id); if (order) order.status = status; return order; }
};
