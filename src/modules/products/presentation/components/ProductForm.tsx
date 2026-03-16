import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/Button/Button';
import type { ProductEntity } from '@/modules/products/domain/productAdmin.types';
import type { Category } from '@/modules/categories/domain/category.types';
import {
  getDefaultProductFormValues,
  mapFormValuesToProductInput,
  productFormSchema,
  type ProductFormValues
} from '@/modules/products/presentation/forms/productForm.schema';
import styles from '@/modules/products/presentation/pages/CreateProductPage.module.scss';

type ProductFormProps = {
  editingProduct: ProductEntity | null;
  categories: Category[];
  onCancelEdit: () => void;
  onSubmitForm: (values: ReturnType<typeof mapFormValuesToProductInput>) => Promise<void>;
  isSubmitting: boolean;
};

export function ProductForm({ editingProduct, categories, onCancelEdit, onSubmitForm, isSubmitting }: ProductFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultProductFormValues(editingProduct ?? undefined)
  });

  useEffect(() => {
    reset(getDefaultProductFormValues(editingProduct ?? undefined));
  }, [editingProduct, reset]);

  const onSubmit = handleSubmit(async (values) => {
    await onSubmitForm(mapFormValuesToProductInput(values, editingProduct?.active ?? true));
    reset(getDefaultProductFormValues());
  });

  return (
    <article className={styles.formCard}>
      <h2>{editingProduct ? 'Editar producto' : 'Crear producto'}</h2>
      <form onSubmit={onSubmit} className={styles.form} aria-busy={isSubmitting}>
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
          <select {...register('categoryId')}>
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId?.message && <small>{errors.categoryId.message}</small>}
        </label>
        <label>
          Stock
          <input type="number" {...register('stock')} />
          {errors.stock?.message && <small>{errors.stock.message}</small>}
        </label>
        <label>
          URL de imagen
          <input placeholder="https://..." {...register('imageUrl')} />
          {errors.imageUrl?.message && <small>{errors.imageUrl.message}</small>}
        </label>

        <div className={styles.actions}>
          <Button type="submit" loading={isSubmitting}>
            {editingProduct ? 'Guardar cambios' : 'Crear producto'}
          </Button>
          {editingProduct && (
            <Button
              type="button"
              onClick={() => {
                onCancelEdit();
                reset(getDefaultProductFormValues());
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </article>
  );
}
