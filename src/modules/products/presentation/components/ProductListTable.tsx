import { useMemo } from 'react';
import { DataTable } from '@/shared/ui/DataTable/DataTable';
import { Button } from '@/shared/ui/Button/Button';
import type { ProductEntity } from '@/modules/products/domain/productAdmin.types';
import styles from '@/modules/products/presentation/pages/CreateProductPage.module.scss';

type ProductListTableProps = {
  products: ProductEntity[];
  onEdit: (product: ProductEntity) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (product: ProductEntity) => void;
  isMutating: boolean;
};

export function ProductListTable({ products, onEdit, onDelete, onToggleStatus, isMutating }: ProductListTableProps) {
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
          <Button type="button" onClick={() => onToggleStatus(product)} disabled={isMutating}>
            {product.active ? 'Desactivar' : 'Activar'}
          </Button>
        </div>,
        <div key={`${product.id}-actions`} className={styles.actions}>
          <Button type="button" onClick={() => onEdit(product)} disabled={isMutating}>
            Editar
          </Button>
          <Button type="button" onClick={() => onDelete(product.id)} disabled={isMutating}>
            Eliminar
          </Button>
        </div>
      ]),
    [isMutating, onDelete, onEdit, onToggleStatus, products]
  );

  return <DataTable headers={['Imagen', 'Nombre', 'Precio', 'Stock', 'Categoría', 'Estado', 'Acciones']} rows={rows} />;
}
