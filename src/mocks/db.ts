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
  variants?: Array<{ name: string; options: string[] }>;
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
  { id: 'p2', name: 'Perfume Flor de Noche', price: 28500, category: 'perfumes', description: 'Fragancia femenina sofisticada.', imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f', active: true, stock: 0, attributes: { marca: 'Coco', fragancia: 'Floral', contenido: '100ml' }, variants: [{ name: 'Contenido', options: ['50ml', '100ml'] }] },
  { id: 'p3', name: 'Remera Essential', price: 18900, category: 'remeras', description: 'Algodón premium.', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', active: true, stock: 8, attributes: { talle: 'M', color: 'Rosa' }, variants: [{ name: 'Talle', options: ['S', 'M', 'L'] }, { name: 'Color', options: ['Rosa', 'Crudo', 'Negro'] }] },
  { id: 'p4', name: 'Sahumerio Sándalo', price: 6400, category: 'sahumerios', description: 'Aroma intenso para rituales.', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108', active: true, stock: 24, attributes: { marca: 'Aromática', aroma: 'Sándalo', presentacion: 'x8' } },
  { id: 'p5', name: 'Body Splash Vainilla', price: 12900, category: 'perfumes', description: 'Dulce y liviano para uso diario.', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601', active: true, stock: 12, attributes: { marca: 'Coco', fragancia: 'Vainilla', contenido: '200ml' }, variants: [{ name: 'Contenido', options: ['100ml', '200ml'] }] },
  { id: 'p6', name: 'Remera Aura Natural', price: 17200, category: 'remeras', description: 'Fit relajado con estampado minimalista.', imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050', active: true, stock: 5, attributes: { talle: 'L', color: 'Crudo' } },
  { id: 'p7', name: 'Perfume Ambar Silvestre', price: 31900, category: 'perfumes', description: 'Notas cálidas con fondo amaderado.', imageUrl: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de', active: true, stock: 4, attributes: { marca: 'Coco', fragancia: 'Ámbar', contenido: '100ml' } },
  { id: 'p8', name: 'Sahumerio Jazmín', price: 5900, category: 'sahumerios', description: 'Fragancia floral para armonizar.', imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15', active: true, stock: 18, attributes: { marca: 'Aromática', aroma: 'Jazmín', presentacion: 'x8' } },
  { id: 'p9', name: 'Remera Cocoa Club', price: 21000, category: 'remeras', description: 'Diseño urbano de edición limitada.', imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b', active: true, stock: 0, attributes: { talle: 'S', color: 'Negra' } },
  { id: 'p10', name: 'Mist Citrus Bloom', price: 9800, category: 'perfumes', description: 'Explosión fresca de cítricos.', imageUrl: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d', active: true, stock: 30, attributes: { marca: 'Coco', fragancia: 'Cítrica', contenido: '150ml' } }
];

export const mockPromotions: Promotion[] = [
  { id: 'promo1', name: 'Llevando 3, 10%', type: 'percentage', amount: 10, minQty: 3, category: 'sahumerios', active: true }
];

export const mockOrders: Order[] = [];
