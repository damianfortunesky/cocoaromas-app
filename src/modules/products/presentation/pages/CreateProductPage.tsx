import { useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAdminProducts, useCreateProduct, useDeleteProduct, useUpdateProduct } from '@/modules/products/application/useAdminProducts';
import { DataTable } from '@/shared/ui/DataTable/DataTable';
import { Button } from '@/shared/ui/Button/Button';
import type { Product } from '@/mocks/db';
import styles from './CreateProductPage.module.scss';

const productSchema = z.object({
  name: z.string().min(3, 'Ingresá al menos 3 caracteres.'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  category: z.string().min(2, 'Seleccioná una categoría.'),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo.'),
  images: z.array(z.object({ url: z.string().url('Ingresá una URL válida.') })).min(1, 'Agregá al menos una imagen.'),
  attributes: z.array(z.object({ key: z.string().min(1, 'Clave requerida.'), value: z.string().min(1, 'Valor requerido.') }))
});

type ProductFormValues = z.infer<typeof productSchema>;

const getDefaultValues = (product?: Product): ProductFormValues => ({
  name: product?.name ?? '',
  price: product?.price ?? 0,
  description: product?.description ?? '',
  category: product?.category ?? '',
  stock: product?.stock ?? 0,
  images: product?.images?.length ? product.images.map((url) => ({ url })) : [{ url: product?.imageUrl ?? '' }],
  attributes: Object.entries(product?.attributes ?? {}).map(([key, value]) => ({ key, value }))
});

const toAttributesRecord = (attributes: ProductFormValues['attributes']) =>
  attributes.reduce<Record<string, string>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

export function CreateProductPage() {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { data: products = [] } = useAdminProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: getDefaultValues()
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: 'images' });
  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute
  } = useFieldArray({ control, name: 'attributes' });

  const refreshProducts = () => queryClient.invalidateQueries({ queryKey: ['admin-products'] });

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      price: values.price,
      description: values.description,
      category: values.category,
      stock: values.stock,
      imageUrl: values.images[0].url,
      images: values.images.map((image) => image.url),
      attributes: toAttributesRecord(values.attributes),
      active: editingProduct?.active ?? true
    };

    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data: payload });
      setEditingProduct(null);
    } else {
      await createProduct.mutateAsync(payload);
    }

    reset(getDefaultValues());
    await refreshProducts();
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    reset(getDefaultValues(product));
  };

  const handleDelete = async (id: string) => {
    await deleteProduct.mutateAsync(id);
    await refreshProducts();
    if (editingProduct?.id === id) {
      setEditingProduct(null);
      reset(getDefaultValues());
    }
  };

  const handleToggleStatus = async (product: Product) => {
    await updateProduct.mutateAsync({ id: product.id, data: { active: !product.active } });
    await refreshProducts();
  };

  const rows = useMemo(
    () =>
      products.map((product) => [
        <img key={`${product.id}-image`} src={product.imageUrl} alt={product.name} className={styles.image} />,
        product.name,
        `$${product.price.toLocaleString('es-AR')}`,
        product.stock,
        product.category,
        <div key={`${product.id}-status`} className={styles.statusCell}>
          <span className={product.active ? styles.active : styles.inactive}>{product.active ? 'Activo' : 'Inactivo'}</span>
          <Button type="button" onClick={() => handleToggleStatus(product)}>
            {product.active ? 'Desactivar' : 'Activar'}
          </Button>
        </div>,
        <div key={`${product.id}-actions`} className={styles.actions}>
          <Button type="button" onClick={() => handleEdit(product)}>
            Editar
          </Button>
          <Button type="button" onClick={() => handleDelete(product.id)}>
            Eliminar
          </Button>
        </div>
      ]),
    [products]
  );

  return (
    <section className={styles.container}>
      <header>
        <h1>Administración de productos</h1>
        <p>Gestioná el catálogo: creá, editá, activá/desactivá y eliminá productos.</p>
      </header>

      <DataTable headers={['Imagen', 'Nombre', 'Precio', 'Stock', 'Categoría', 'Estado', 'Acciones']} rows={rows} />

      <article className={styles.formCard}>
        <h2>{editingProduct ? 'Editar producto' : 'Crear producto'}</h2>
        <form onSubmit={onSubmit} className={styles.form}>
          <label>
            Nombre
            <input {...register('name')} />
            {errors.name?.message && <small>{errors.name.message}</small>}
          </label>
          <label>
            Precio
            <input type="number" step="0.01" {...register('price')} />
            {errors.price?.message && <small>{errors.price.message}</small>}
          </label>
          <label>
            Descripción
            <textarea rows={4} {...register('description')} />
            {errors.description?.message && <small>{errors.description.message}</small>}
          </label>
          <label>
            Categoría
            <input {...register('category')} />
            {errors.category?.message && <small>{errors.category.message}</small>}
          </label>
          <label>
            Stock
            <input type="number" {...register('stock')} />
            {errors.stock?.message && <small>{errors.stock.message}</small>}
          </label>

          <div className={styles.dynamicSection}>
            <h3>Imágenes</h3>
            {imageFields.map((field, index) => (
              <div key={field.id} className={styles.row}>
                <input placeholder="https://..." {...register(`images.${index}.url`)} />
                <Button type="button" onClick={() => removeImage(index)}>
                  Quitar
                </Button>
              </div>
            ))}
            {errors.images?.message && <small>{errors.images.message}</small>}
            <Button type="button" onClick={() => appendImage({ url: '' })}>
              Agregar imagen
            </Button>
          </div>

          <div className={styles.dynamicSection}>
            <h3>Atributos dinámicos</h3>
            {attributeFields.map((field, index) => (
              <div key={field.id} className={styles.row}>
                <input placeholder="Clave" {...register(`attributes.${index}.key`)} />
                <input placeholder="Valor" {...register(`attributes.${index}.value`)} />
                <Button type="button" onClick={() => removeAttribute(index)}>
                  Quitar
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => appendAttribute({ key: '', value: '' })}>
              Agregar atributo
            </Button>
          </div>

          <div className={styles.actions}>
            <Button type="submit">{editingProduct ? 'Guardar cambios' : 'Crear producto'}</Button>
            {editingProduct && (
              <Button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  reset(getDefaultValues());
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </article>
    </section>
  );
}
