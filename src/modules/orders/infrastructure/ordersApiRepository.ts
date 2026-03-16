import { httpClient } from '@/shared/api/httpClient';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import type { PaginatedResult } from '@/shared/types/common';
import type { CheckoutPayload, Order, OrderStatus } from '@/modules/orders/domain/order.types';

export interface AdminOrdersFilters {
  status?: OrderStatus;
  search?: string;
}

type OrderItemApiDto = {
  productId?: string | number;
  product_id?: string | number;
  productName?: string;
  product_name?: string;
  quantity?: number;
  unitPrice?: number;
  unit_price?: number;
  lineSubtotal?: number;
  subtotal?: number;
  lineDiscount?: number;
  discount_amount?: number;
  lineTotal?: number;
  totalAmount?: number;
  total_amount?: number;
};

type OrderApiDto = {
  id?: string | number;
  userId?: string | number;
  user_id?: string | number;
  status?: string;
  statusOrder?: string;
  status_order?: string;
  total?: number;
  subtotal?: number;
  discount?: number;
  discountTotal?: number;
  discount_total?: number;
  paymentMethod?: string;
  payment_method?: string;
  shippingAddress?: string;
  deliveryMethod?: string;
  delivery_method?: string;
  contactPhone?: string;
  buyerName?: string;
  notes?: string;
  paymentGateway?: 'manual_transfer' | 'mercado_pago';
  paymentReference?: string;
  createdAt?: string;
  created_at?: string;
  items?: OrderItemApiDto[];
};

const normalizeStatus = (value?: string): OrderStatus => {
  const normalized = (value ?? 'pendiente').trim().toLowerCase();
  return normalized as OrderStatus;
};

const toOrderItem = (item: OrderItemApiDto) => {
  const unitPrice = Number(item.unitPrice ?? item.unit_price ?? 0);
  const quantity = Number(item.quantity ?? 0);
  const lineSubtotal = Number(item.lineSubtotal ?? item.subtotal ?? unitPrice * quantity);
  const lineDiscount = Number(item.lineDiscount ?? item.discount_amount ?? 0);

  return {
    productId: String(item.productId ?? item.product_id ?? ''),
    productName: item.productName ?? item.product_name ?? 'Producto',
    unitPrice,
    quantity,
    lineSubtotal,
    lineDiscount,
    lineTotal: Number(item.lineTotal ?? item.totalAmount ?? item.total_amount ?? lineSubtotal - lineDiscount)
  };
};

const toOrder = (dto: OrderApiDto): Order => ({
  id: String(dto.id ?? ''),
  userId: String(dto.userId ?? dto.user_id ?? ''),
  status: normalizeStatus(dto.status ?? dto.statusOrder ?? dto.status_order),
  total: Number(dto.total ?? 0),
  subtotal: Number(dto.subtotal ?? 0),
  discount: Number(dto.discount ?? dto.discountTotal ?? dto.discount_total ?? 0),
  paymentMethod: (dto.paymentMethod ?? dto.payment_method ?? 'transfer') as Order['paymentMethod'],
  shippingAddress: dto.shippingAddress ?? dto.deliveryMethod ?? dto.delivery_method ?? '',
  contactPhone: dto.contactPhone ?? '',
  buyerName: dto.buyerName ?? '',
  notes: dto.notes,
  paymentGateway: dto.paymentGateway ?? 'manual_transfer',
  paymentReference: dto.paymentReference,
  createdAt: dto.createdAt ?? dto.created_at ?? new Date().toISOString(),
  items: (dto.items ?? []).map(toOrderItem)
});

function extractOrders(payload: OrderApiDto[] | PaginatedResult<OrderApiDto>): Order[] {
  const items = Array.isArray(payload) ? payload : payload.items;
  return items.map(toOrder);
}

const toCheckoutPayload = (payload: CheckoutPayload) => ({
  ...payload,
  discountTotal: payload.discount,
  deliveryMethod: payload.shippingAddress
});

export const ordersApiRepository = {
  async create(payload: CheckoutPayload): Promise<Order> {
    const { data } = await httpClient.post<OrderApiDto>(API_ENDPOINTS.orders.create, toCheckoutPayload(payload));
    return toOrder(data);
  },
  async listByUser(): Promise<Order[]> {
    const { data } = await httpClient.get<OrderApiDto[]>(API_ENDPOINTS.orders.myOrders);
    return data.map(toOrder);
  },
  async listAdmin(filters: AdminOrdersFilters = {}): Promise<Order[]> {
    const params: Record<string, string> = {};

    if (filters.status) {
      params.status = filters.status;
    }

    if (filters.search) {
      params.search = filters.search;
    }

    const { data } = await httpClient.get<OrderApiDto[] | PaginatedResult<OrderApiDto>>(API_ENDPOINTS.orders.adminList, {
      params
    });

    return extractOrders(data);
  },
  async getAdminById(id: string): Promise<Order> {
    const { data } = await httpClient.get<OrderApiDto>(API_ENDPOINTS.orders.adminById(id));
    return toOrder(data);
  },
  async updateAdminStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await httpClient.patch<OrderApiDto>(API_ENDPOINTS.orders.adminUpdateStatus(id), { status, statusOrder: status });
    return toOrder(data);
  }
};
