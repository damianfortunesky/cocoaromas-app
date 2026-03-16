import { z } from 'zod';
import type { ProductEntity } from '@/modules/products/domain/productAdmin.types';

export const productFormSchema = z.object({
  name: z.string().min(3, 'Ingresá al menos 3 caracteres.'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  categoryId: z.string().min(1, 'Seleccioná una categoría.'),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo.'),
  imageUrl: z.string().url('Ingresá una URL válida.')
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const getDefaultProductFormValues = (product?: ProductEntity): ProductFormValues => ({
  name: product?.name ?? '',
  price: product?.price ?? 0,
  description: product?.description ?? '',
  categoryId: product?.categoryId ?? '',
  stock: product?.stock ?? 0,
  imageUrl: product?.imageUrl ?? ''
});

export const mapFormValuesToProductInput = (values: ProductFormValues, fallbackActive = true) => ({
  name: values.name,
  price: values.price,
  description: values.description,
  categoryId: values.categoryId,
  stock: values.stock,
  imageUrl: values.imageUrl,
  active: fallbackActive
});
