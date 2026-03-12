export type OrderStatus = 'pendiente' | 'esperando_pago' | 'pagado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';

export type PaymentMethod = 'transfer' | 'mercado_pago';

export interface CheckoutItemPayload {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineSubtotal: number;
  lineDiscount: number;
  lineTotal: number;
}

export interface CheckoutPayload {
  userId: string;
  paymentMethod: PaymentMethod;
  items: CheckoutItemPayload[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: string;
  contactPhone: string;
  buyerName: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  discount: number;
  paymentMethod: PaymentMethod;
  shippingAddress: string;
  contactPhone: string;
  buyerName: string;
  notes?: string;
  paymentGateway: 'manual_transfer' | 'mercado_pago';
  paymentReference?: string;
  createdAt: string;
  items: CheckoutItemPayload[];
}
