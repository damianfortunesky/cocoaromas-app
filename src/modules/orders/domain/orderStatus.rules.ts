import type { Order, OrderStatus } from '@/modules/orders/domain/order.types';
import type { Role } from '@/shared/types/common';

export const ORDER_STATUSES: OrderStatus[] = [
  'pendiente',
  'esperando_pago',
  'pagado',
  'preparando',
  'enviado',
  'entregado',
  'cancelado'
];

const DEFAULT_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pendiente: ['pagado', 'cancelado'],
  esperando_pago: ['pagado', 'cancelado'],
  pagado: ['preparando', 'cancelado'],
  preparando: ['enviado', 'cancelado'],
  enviado: ['entregado'],
  entregado: [],
  cancelado: []
};

const MANUAL_TRANSFER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pendiente: ['esperando_pago', 'pagado', 'cancelado']
};

export function canManageOrderStatus(role: Role | undefined): boolean {
  return role === 'admin' || role === 'employee';
}

export function getAllowedStatusTransitions(order: Order): OrderStatus[] {
  const baseTransitions = DEFAULT_TRANSITIONS[order.status] ?? [];

  if (order.paymentMethod !== 'transfer') {
    return baseTransitions;
  }

  if (order.status === 'pendiente') {
    return MANUAL_TRANSFER_TRANSITIONS.pendiente ?? baseTransitions;
  }

  return baseTransitions;
}

export function canUpdateOrderStatus(order: Order, nextStatus: OrderStatus): boolean {
  return getAllowedStatusTransitions(order).includes(nextStatus);
}
