import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePromotions, useCreatePromotion } from '@/modules/promotions/application/usePromotions';
import { useAdminProducts } from '@/modules/products/application/useAdminProducts';
import { DataTable } from '@/shared/ui/DataTable/DataTable';
import { Button } from '@/shared/ui/Button/Button';
import styles from './PromotionsManagementPage.module.scss';

const promotionSchema = z
  .object({
    name: z.string().min(3, 'Ingresá un nombre con al menos 3 caracteres.'),
    scope: z.enum(['quantity', 'product', 'category']),
    type: z.enum(['percentage', 'fixed']),
    amount: z.coerce.number().positive('El valor debe ser mayor a 0.'),
    minQty: z.coerce.number().int().min(1, 'La cantidad mínima debe ser al menos 1.').optional(),
    productId: z.string().optional(),
    category: z.string().optional(),
    startDate: z.string().min(1, 'Seleccioná la fecha de inicio.'),
    endDate: z.string().min(1, 'Seleccioná la fecha de fin.'),
    active: z.boolean()
  })
  .superRefine((values, ctx) => {
    if (values.scope === 'quantity' && !values.minQty) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['minQty'], message: 'Ingresá la cantidad mínima.' });
    }

    if (values.scope === 'product' && !values.productId) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['productId'], message: 'Seleccioná un producto.' });
    }

    if (values.scope === 'category' && !values.category) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['category'], message: 'Seleccioná una categoría.' });
    }

    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endDate'], message: 'La fecha de fin debe ser posterior al inicio.' });
    }
  });

type PromotionFormValues = z.infer<typeof promotionSchema>;

const defaultValues: PromotionFormValues = {
  name: '',
  scope: 'quantity',
  type: 'percentage',
  amount: 0,
  minQty: 1,
  productId: '',
  category: '',
  startDate: '',
  endDate: '',
  active: true
};

const scopeLabel: Record<PromotionFormValues['scope'], string> = {
  quantity: 'Por cantidad',
  product: 'Por producto',
  category: 'Por categoría'
};

export function PromotionsManagementPage() {
  const { data: promotions = [] } = usePromotions();
  const { data: products = [] } = useAdminProducts();
  const createPromotion = useCreatePromotion();

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues
  });

  const scope = watch('scope');

  const onSubmit = handleSubmit(async (values) => {
    await createPromotion.mutateAsync({
      name: values.name,
      scope: values.scope,
      type: values.type,
      amount: values.amount,
      minQty: values.scope === 'quantity' ? values.minQty : undefined,
      productId: values.scope === 'product' ? values.productId : undefined,
      category: values.scope === 'category' ? values.category : undefined,
      startDate: values.startDate,
      endDate: values.endDate,
      active: values.active
    });

    reset(defaultValues);
  });

  const rows = promotions.map((promotion) => {
    const scopeValue =
      promotion.scope === 'quantity'
        ? `Mínimo ${promotion.minQty ?? '-'} unidades`
        : promotion.scope === 'product'
          ? products.find((product) => product.id === promotion.productId)?.name ?? promotion.productId ?? '-'
          : promotion.category ?? '-';

    return [
      promotion.name,
      scopeLabel[promotion.scope],
      promotion.type === 'percentage' ? 'Porcentaje' : 'Monto fijo',
      promotion.type === 'percentage' ? `${promotion.amount}%` : `$${promotion.amount.toLocaleString('es-AR')}`,
      scopeValue,
      `${promotion.startDate} → ${promotion.endDate}`,
      <span key={`${promotion.id}-status`} className={promotion.active ? styles.active : styles.inactive}>
        {promotion.active ? 'Activo' : 'Inactivo'}
      </span>
    ];
  });

  return (
    <section className={styles.container}>
      <header>
        <h1>Gestión de promociones</h1>
        <p>Creá promociones por cantidad, producto o categoría y controlá su vigencia.</p>
      </header>

      <DataTable
        headers={['Nombre', 'Modalidad', 'Tipo descuento', 'Valor', 'Condición', 'Vigencia', 'Estado']}
        rows={rows}
      />

      <article className={styles.formCard}>
        <h2>Nueva promoción</h2>

        <form onSubmit={onSubmit} className={styles.form}>
          <label>
            Nombre
            <input {...register('name')} />
            {errors.name?.message && <small>{errors.name.message}</small>}
          </label>

          <label>
            Promoción
            <select {...register('scope')}>
              <option value="quantity">Por cantidad</option>
              <option value="product">Por producto</option>
              <option value="category">Por categoría</option>
            </select>
            {errors.scope?.message && <small>{errors.scope.message}</small>}
          </label>

          <label>
            Tipo de descuento
            <select {...register('type')}>
              <option value="percentage">Porcentaje</option>
              <option value="fixed">Monto fijo</option>
            </select>
            {errors.type?.message && <small>{errors.type.message}</small>}
          </label>

          <label>
            Porcentaje o monto
            <input type="number" step="0.01" min="0" {...register('amount')} />
            {errors.amount?.message && <small>{errors.amount.message}</small>}
          </label>

          {scope === 'quantity' && (
            <label>
              Cantidad mínima
              <input type="number" min="1" {...register('minQty')} />
              {errors.minQty?.message && <small>{errors.minQty.message}</small>}
            </label>
          )}

          {scope === 'product' && (
            <label>
              Producto
              <select {...register('productId')}>
                <option value="">Seleccionar producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.productId?.message && <small>{errors.productId.message}</small>}
            </label>
          )}

          {scope === 'category' && (
            <label>
              Categoría
              <select {...register('category')}>
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category?.message && <small>{errors.category.message}</small>}
            </label>
          )}

          <label>
            Fecha inicio
            <input type="date" {...register('startDate')} />
            {errors.startDate?.message && <small>{errors.startDate.message}</small>}
          </label>

          <label>
            Fecha fin
            <input type="date" {...register('endDate')} />
            {errors.endDate?.message && <small>{errors.endDate.message}</small>}
          </label>

          <label className={styles.checkboxRow}>
            <input type="checkbox" {...register('active')} />
            Activo
          </label>

          <Button type="submit" disabled={createPromotion.isPending}>
            {createPromotion.isPending ? 'Guardando...' : 'Crear promoción'}
          </Button>
        </form>
      </article>
    </section>
  );
}
