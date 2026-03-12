import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  usePromotions,
  useCreatePromotion,
  useDeletePromotion,
  useTogglePromotion,
  useUpdatePromotion
} from '@/modules/promotions/application/usePromotions';
import type { Promotion, PromotionUpsertInput } from '@/modules/promotions/domain/promotion.types';
import { useAdminProducts } from '@/modules/products/application/useAdminProducts';
import { Alert } from '@/shared/ui/Alert/Alert';
import { DataTable } from '@/shared/ui/DataTable/DataTable';
import { Button } from '@/shared/ui/Button/Button';
import { Loader } from '@/shared/ui/Loader/Loader';
import styles from './PromotionsManagementPage.module.scss';

const dateStringSchema = z
  .string()
  .optional()
  .transform((value) => {
    const normalized = value?.trim() ?? '';
    return normalized.length > 0 ? normalized : undefined;
  });

const promotionSchema = z
  .object({
    name: z.string().min(3, 'Ingresá un nombre con al menos 3 caracteres.'),
    scope: z.enum(['quantity', 'product', 'category']),
    type: z.enum(['percentage', 'fixed']),
    amount: z.coerce.number().positive('El valor debe ser mayor a 0.'),
    minQty: z.coerce.number().int().min(1, 'La cantidad mínima debe ser al menos 1.').optional(),
    productId: z.string().optional(),
    category: z.string().optional(),
    startDate: dateStringSchema,
    endDate: dateStringSchema,
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

type PromotionFormValues = z.input<typeof promotionSchema>;

type FeedbackState = { variant: 'success' | 'danger'; message: string } | null;

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

const scopeLabel: Record<Promotion['scope'], string> = {
  quantity: 'Por cantidad',
  product: 'Por producto',
  category: 'Por categoría'
};

const formatDateRange = (promotion: Promotion): string => {
  if (!promotion.startDate && !promotion.endDate) return 'Sin vigencia';
  return `${promotion.startDate ?? 'Sin inicio'} → ${promotion.endDate ?? 'Sin fin'}`;
};

const toPayload = (values: PromotionFormValues): PromotionUpsertInput => {
  const parsed = promotionSchema.parse(values);

  return {
    name: parsed.name,
    scope: parsed.scope,
    type: parsed.type,
    amount: parsed.amount,
    minQty: parsed.scope === 'quantity' ? parsed.minQty : undefined,
    productId: parsed.scope === 'product' ? parsed.productId : undefined,
    category: parsed.scope === 'category' ? parsed.category : undefined,
    startDate: parsed.startDate,
    endDate: parsed.endDate,
    active: parsed.active
  };
};

const toFormValues = (promotion: Promotion): PromotionFormValues => ({
  name: promotion.name,
  scope: promotion.scope,
  type: promotion.type,
  amount: promotion.amount,
  minQty: promotion.minQty,
  productId: promotion.productId ?? '',
  category: promotion.category ?? '',
  startDate: promotion.startDate ?? '',
  endDate: promotion.endDate ?? '',
  active: promotion.active
});

export function PromotionsManagementPage() {
  const { data: promotions = [], isLoading, isError } = usePromotions();
  const { data: products = [] } = useAdminProducts();

  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const togglePromotion = useTogglePromotion();
  const deletePromotion = useDeletePromotion();

  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

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

  const resetToCreateMode = () => {
    setEditingPromotionId(null);
    reset(defaultValues);
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      setFeedback(null);
      const payload = toPayload(values);

      if (editingPromotionId) {
        await updatePromotion.mutateAsync({ id: editingPromotionId, data: payload });
        setFeedback({ variant: 'success', message: 'Promoción actualizada correctamente.' });
      } else {
        await createPromotion.mutateAsync(payload);
        setFeedback({ variant: 'success', message: 'Promoción creada correctamente.' });
      }

      resetToCreateMode();
    } catch (error) {
      setFeedback({
        variant: 'danger',
        message: error instanceof Error ? error.message : 'No se pudo guardar la promoción.'
      });
    }
  });

  const onEditPromotion = (promotion: Promotion) => {
    setFeedback(null);
    setEditingPromotionId(promotion.id);
    reset(toFormValues(promotion));
  };

  const onTogglePromotion = async (promotion: Promotion) => {
    try {
      setFeedback(null);
      await togglePromotion.mutateAsync({ id: promotion.id, active: !promotion.active });
      setFeedback({
        variant: 'success',
        message: `Promoción ${promotion.active ? 'desactivada' : 'activada'} correctamente.`
      });
    } catch (error) {
      setFeedback({
        variant: 'danger',
        message: error instanceof Error ? error.message : 'No se pudo actualizar el estado de la promoción.'
      });
    }
  };

  const onDeletePromotion = async (promotion: Promotion) => {
    try {
      setFeedback(null);
      await deletePromotion.mutateAsync(promotion.id);
      if (editingPromotionId === promotion.id) {
        resetToCreateMode();
      }
      setFeedback({ variant: 'success', message: 'Promoción eliminada correctamente.' });
    } catch (error) {
      setFeedback({
        variant: 'danger',
        message: error instanceof Error ? error.message : 'No se pudo eliminar la promoción.'
      });
    }
  };

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
      formatDateRange(promotion),
      <span key={`${promotion.id}-status`} className={promotion.active ? styles.active : styles.inactive}>
        {promotion.active ? 'Activo' : 'Inactivo'}
      </span>,
      <div key={`${promotion.id}-actions`} className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => onEditPromotion(promotion)}>
          Editar
        </Button>
        <Button type="button" variant="secondary" onClick={() => void onTogglePromotion(promotion)}>
          {promotion.active ? 'Desactivar' : 'Activar'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => void onDeletePromotion(promotion)}>
          Eliminar
        </Button>
      </div>
    ];
  });

  const isSubmitting = createPromotion.isPending || updatePromotion.isPending;

  return (
    <section className={styles.container}>
      <header>
        <h1>Gestión de promociones</h1>
        <p>Administrá promociones por cantidad, producto o categoría con porcentaje o monto fijo y vigencia opcional.</p>
      </header>

      {isLoading && (
        <div className={styles.loaderWrap}>
          <Loader />
          <span>Cargando promociones...</span>
        </div>
      )}

      {isError && <Alert variant="danger">No se pudieron cargar las promociones.</Alert>}

      {feedback && <Alert variant={feedback.variant}>{feedback.message}</Alert>}

      {!isLoading && !isError && (
        <DataTable
          headers={['Nombre', 'Modalidad', 'Tipo descuento', 'Valor', 'Condición', 'Vigencia', 'Estado', 'Acciones']}
          rows={rows}
        />
      )}

      <article className={styles.formCard}>
        <h2>{editingPromotionId ? 'Editar promoción' : 'Nueva promoción'}</h2>

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
            Fecha inicio (opcional)
            <input type="date" {...register('startDate')} />
            {errors.startDate?.message && <small>{errors.startDate.message}</small>}
          </label>

          <label>
            Fecha fin (opcional)
            <input type="date" {...register('endDate')} />
            {errors.endDate?.message && <small>{errors.endDate.message}</small>}
          </label>

          <label className={styles.checkboxRow}>
            <input type="checkbox" {...register('active')} />
            Activo
          </label>

          <div className={styles.formActions}>
            <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
              {editingPromotionId ? 'Guardar cambios' : 'Crear promoción'}
            </Button>
            {editingPromotionId && (
              <Button type="button" variant="secondary" onClick={resetToCreateMode}>
                Cancelar edición
              </Button>
            )}
          </div>
        </form>
      </article>
    </section>
  );
}
