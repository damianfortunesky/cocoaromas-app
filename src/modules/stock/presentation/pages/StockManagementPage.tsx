import { useMemo, useState } from 'react';
import { useAuth } from '@/modules/auth/application/useAuth';
import { canEditStock } from '@/modules/stock/domain/stock.rules';
import { useStockList, useUpdateStock } from '@/modules/stock/application/useStockManagement';
import type { StockItem, VariantStock } from '@/modules/stock/domain/stock.types';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import { Loader } from '@/shared/ui/Loader/Loader';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import styles from './StockManagementPage.module.scss';

const badgeByLevel = {
  ok: { label: 'Stock OK', className: styles.badgeOk },
  low: { label: 'Stock bajo', className: styles.badgeLow },
  out: { label: 'Sin stock', className: styles.badgeOut }
} as const;

function ProductStockCard({ item, editable, onSave, isSaving }: {
  item: StockItem;
  editable: boolean;
  onSave: (nextStock: number, nextVariants?: VariantStock[]) => void;
  isSaving: boolean;
}) {
  const [stock, setStock] = useState(item.totalStock);
  const [variantStock, setVariantStock] = useState(item.variantStock);

  const hasChanges = useMemo(() => {
    if (stock !== item.totalStock) return true;
    return variantStock.some((variant, index) => variant.stock !== item.variantStock[index]?.stock);
  }, [item.totalStock, item.variantStock, stock, variantStock]);

  const onVariantChange = (variantId: string, value: number) => {
    const nextValue = Math.max(0, Math.floor(value));
    const nextVariants = variantStock.map((variant) => (variant.id === variantId ? { ...variant, stock: nextValue } : variant));
    setVariantStock(nextVariants);
    setStock(nextVariants.reduce((total, variant) => total + variant.stock, 0));
  };

  const onSimpleStockChange = (value: number) => {
    setStock(Math.max(0, Math.floor(value)));
  };

  const badge = badgeByLevel[item.alertLevel];

  return (
    <article className={styles.card}>
      <div className={styles.titleRow}>
        <strong>{item.productName}</strong>
        <span className={`${styles.badge} ${badge.className}`}>{badge.label}</span>
      </div>

      <p>Stock total actual: {item.totalStock}</p>

      {item.hasVariantStock ? (
        <ul className={styles.variantList}>
          {variantStock.map((variant) => (
            <li key={variant.id} className={styles.variantRow}>
              <span className={styles.variantName}>{variant.name}</span>
              <input
                className={styles.stockInput}
                type="number"
                min={0}
                value={variant.stock}
                disabled={!editable}
                onChange={(event) => onVariantChange(variant.id, Number(event.target.value))}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.controls}>
          <Button type="button" variant="secondary" disabled={!editable || stock <= 0} onClick={() => onSimpleStockChange(stock - 1)}>
            -1
          </Button>
          <input
            className={styles.stockInput}
            type="number"
            min={0}
            value={stock}
            disabled={!editable}
            onChange={(event) => onSimpleStockChange(Number(event.target.value))}
          />
          <Button type="button" variant="secondary" disabled={!editable} onClick={() => onSimpleStockChange(stock + 1)}>
            +1
          </Button>
        </div>
      )}

      <div>
        <Button
          type="button"
          loading={isSaving}
          disabled={!editable || !hasChanges || isSaving}
          onClick={() => onSave(stock, item.hasVariantStock ? variantStock : undefined)}
        >
          Guardar stock
        </Button>
      </div>
    </article>
  );
}

export function StockManagementPage() {
  const { data = [], isPending, isError, error } = useStockList();
  const updateStock = useUpdateStock();
  const { session } = useAuth();
  const canEdit = canEditStock(session?.role);

  const onSave = (item: StockItem, nextStock: number, nextVariants?: VariantStock[]) => {
    if (!session?.role) return;

    updateStock.mutate({
      item,
      nextStock,
      variantStock: nextVariants,
      role: session.role
    });
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1>Gestión de stock</h1>
        <p>Consultá y actualizá stock general o por variante con validaciones de negocio.</p>
      </header>

      {!canEdit && <Alert variant="warning" title="Permisos insuficientes">Tu rol no puede modificar stock.</Alert>}

      {updateStock.isSuccess && <Alert variant="success" title="Stock actualizado">Se guardaron los cambios correctamente.</Alert>}
      {updateStock.isError && <Alert variant="danger" title="No se pudo actualizar">{updateStock.error.message}</Alert>}

      {isPending && <div className={styles.loading}><Loader /> Cargando stock...</div>}
      {isError && <Alert variant="danger" title="No se pudo cargar el stock">{error.message}</Alert>}


      {!isPending && !isError && data.length === 0 && (
        <EmptyState
          title="Sin productos de stock"
          message="No hay registros de stock para mostrar en este momento."
        />
      )}

      {!isPending && !isError && data.length > 0 && (
        <div className={styles.cards}>
          {data.map((item) => (
            <ProductStockCard
              key={item.productId}
              item={item}
              editable={canEdit}
              isSaving={updateStock.isPending}
              onSave={(nextStock, nextVariants) => onSave(item, nextStock, nextVariants)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
