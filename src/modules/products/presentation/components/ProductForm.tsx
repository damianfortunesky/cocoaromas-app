import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/Button/Button';
import type { ProductEntity } from '@/modules/products/domain/productAdmin.types';
import {
  getDefaultProductFormValues,
  mapFormValuesToProductInput,
  productFormSchema,
  type ProductFormValues
} from '@/modules/products/presentation/forms/productForm.schema';
import styles from '@/modules/products/presentation/pages/CreateProductPage.module.scss';

type ProductFormProps = {
  editingProduct: ProductEntity | null;
  onCancelEdit: () => void;
  onSubmitForm: (values: ReturnType<typeof mapFormValuesToProductInput>) => Promise<void>;
  isSubmitting: boolean;
};

type VariantOptionsFieldsProps = {
  variantIndex: number;
  control: ReturnType<typeof useForm<ProductFormValues>>['control'];
  register: ReturnType<typeof useForm<ProductFormValues>>['register'];
  isSubmitting: boolean;
};

function VariantOptionsFields({ variantIndex, control, register, isSubmitting }: VariantOptionsFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.options`
  });

  return (
    <div className={styles.variantOptions}>
      {fields.map((field, optionIndex) => (
        <div key={field.id} className={styles.row}>
          <input placeholder="Opción" {...register(`variants.${variantIndex}.options.${optionIndex}.value`)} />
          <Button type="button" onClick={() => remove(optionIndex)} disabled={isSubmitting}>
            Quitar opción
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => append({ value: '' })} disabled={isSubmitting}>
        Agregar opción
      </Button>
    </div>
  );
}

export function ProductForm({ editingProduct, onCancelEdit, onSubmitForm, isSubmitting }: ProductFormProps) {
  const {
    control,
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

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control, name: 'images' });
  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute
  } = useFieldArray({ control, name: 'attributes' });
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants'
  });

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
              <Button type="button" onClick={() => removeImage(index)} disabled={isSubmitting}>
                Quitar
              </Button>
            </div>
          ))}
          {errors.images?.message && <small>{errors.images.message}</small>}
          <Button type="button" onClick={() => appendImage({ url: '' })} disabled={isSubmitting}>
            Agregar imagen
          </Button>
        </div>

        <div className={styles.dynamicSection}>
          <h3>Atributos dinámicos</h3>
          {attributeFields.map((field, index) => (
            <div key={field.id} className={styles.row}>
              <input placeholder="Clave" {...register(`attributes.${index}.key`)} />
              <input placeholder="Valor" {...register(`attributes.${index}.value`)} />
              <Button type="button" onClick={() => removeAttribute(index)} disabled={isSubmitting}>
                Quitar
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => appendAttribute({ key: '', value: '' })} disabled={isSubmitting}>
            Agregar atributo
          </Button>
        </div>

        <div className={styles.dynamicSection}>
          <h3>Variantes (opcional)</h3>
          {variantFields.map((field, index) => (
            <div key={field.id} className={styles.variantCard}>
              <div className={styles.row}>
                <input placeholder="Nombre de variante" {...register(`variants.${index}.name`)} />
                <Button type="button" onClick={() => removeVariant(index)} disabled={isSubmitting}>
                  Quitar variante
                </Button>
              </div>
              <VariantOptionsFields variantIndex={index} control={control} register={register} isSubmitting={isSubmitting} />
            </div>
          ))}
          <Button type="button" onClick={() => appendVariant({ name: '', options: [{ value: '' }] })} disabled={isSubmitting}>
            Agregar variante
          </Button>
        </div>

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
