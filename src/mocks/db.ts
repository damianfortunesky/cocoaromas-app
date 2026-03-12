import type { Role } from '@/shared/types/common';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  active: boolean;
  stock: number;
  attributes: Record<string, string>;
}

export interface Promotion {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  amount: number;
  minQty?: number;
  category?: string;
  productId?: string;
  active: boolean;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pendiente' | 'esperando_pago' | 'pagado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
  total: number;
  paymentMethod: 'transfer' | 'mercado_pago';
  createdAt: string;
}

export const mockUsers: Array<{ id: string; email: string; password: string; role: Role }> = [
  { id: 'u1', email: 'admin@cocoaromas.com', password: 'Admin123!', role: 'admin' },
  { id: 'u2', email: 'staff@cocoaromas.com', password: 'Staff123!', role: 'employee' },
  { id: 'u3', email: 'client@cocoaromas.com', password: 'Client123!', role: 'client' }
];

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Sahumerio Lavanda', price: 6000, category: 'sahumerios', description: 'Relajación premium.', imageUrl: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae', active: true, stock: 15, attributes: { marca: 'Aromática', aroma: 'Lavanda', presentacion: 'x8' } },
  { id: 'p2', name: 'Perfume Flor de Noche', price: 28500, category: 'perfumes', description: 'Fragancia femenina sofisticada.', imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f', active: true, stock: 0, attributes: { marca: 'Coco', fragancia: 'Floral', contenido: '100ml' } },
  { id: 'p3', name: 'Remera Essential', price: 18900, category: 'remeras', description: 'Algodón premium.', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', active: true, stock: 8, attributes: { talle: 'M', color: 'Rosa' } }
];

export const mockPromotions: Promotion[] = [
  { id: 'promo1', name: 'Llevando 3, 10%', type: 'percentage', amount: 10, minQty: 3, category: 'sahumerios', active: true }
];

export const mockOrders: Order[] = [];
