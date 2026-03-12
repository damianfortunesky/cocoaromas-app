import { z } from 'zod';
import type { ProductEntity } from '@/modules/products/domain/productAdmin.types';

const dynamicFieldSchema = z.object({
  key: z.string().min(1, 'Clave requerida.'),
  value: z.string().min(1, 'Valor requerido.')
});

const variantOptionSchema = z.object({
  value: z.string().min(1, 'Opción requerida.')
});

const variantSchema = z.object({
  name: z.string().min(1, 'Nombre de variante requerido.'),
  options: z.array(variantOptionSchema).min(1, 'Agregá al menos una opción.')
});

export const productFormSchema = z.object({
  name: z.string().min(3, 'Ingresá al menos 3 caracteres.'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  category: z.string().min(2, 'Seleccioná una categoría.'),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo.'),
  images: z.array(z.object({ url: z.string().url('Ingresá una URL válida.') })).min(1, 'Agregá al menos una imagen.'),
  attributes: z.array(dynamicFieldSchema),
  variants: z.array(variantSchema)
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const getDefaultProductFormValues = (product?: ProductEntity): ProductFormValues => ({
  name: product?.name ?? '',
  price: product?.price ?? 0,
  description: product?.description ?? '',
  category: product?.category ?? '',
  stock: product?.stock ?? 0,
  images: product?.images?.length ? product.images.map((url) => ({ url })) : [{ url: product?.imageUrl ?? '' }],
  attributes: Object.entries(product?.attributes ?? {}).map(([key, value]) => ({ key, value })),
  variants: (product?.variants ?? []).map((variant) => ({
    name: variant.name,
    options: variant.options.map((value) => ({ value }))
  }))
});

const toAttributesRecord = (attributes: ProductFormValues['attributes']) =>
  attributes.reduce<Record<string, string>>((acc, item) => {
    if (!item.key) return acc;
    acc[item.key] = item.value;
    return acc;
  }, {});

const toVariants = (variants: ProductFormValues['variants']) =>
  variants
    .map((variant) => ({
      name: variant.name,
      options: variant.options.map((option) => option.value).filter(Boolean)
    }))
    .filter((variant) => variant.name && variant.options.length > 0);

export const mapFormValuesToProductInput = (values: ProductFormValues, fallbackActive = true) => ({
  name: values.name,
  price: values.price,
  description: values.description,
  category: values.category,
  stock: values.stock,
  imageUrl: values.images[0]?.url ?? '',
  images: values.images.map((image) => image.url),
  attributes: toAttributesRecord(values.attributes),
  variants: toVariants(values.variants),
  active: fallbackActive
});
