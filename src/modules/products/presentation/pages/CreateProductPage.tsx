import { useMemo, useState } from 'react';
import { LoadingState } from '@/shared/ui/LoadingState/LoadingState';
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useToggleProductStatus,
  useUpdateProduct
} from '@/modules/products/application/useAdminProducts';
import type { ProductCreateInput, ProductEntity } from '@/modules/products/domain/productAdmin.types';
import { ProductListTable } from '@/modules/products/presentation/components/ProductListTable';
import { ProductForm } from '@/modules/products/presentation/components/ProductForm';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { useToast } from '@/shared/ui/Toast/ToastProvider';
import { Input } from '@/shared/ui/Input/Input';
import { useCategories } from '@/modules/categories/application/useCategories';
import styles from './CreateProductPage.module.scss';

export function CreateProductPage() {
  const [editingProduct, setEditingProduct] = useState<ProductEntity | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isListError,
    error: listError,
    refetch
  } = useAdminProducts({ search: search.trim() || undefined, category: categoryFilter || undefined });

  const { data: categories = [] } = useCategories();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const toggleProductStatus = useToggleProductStatus();
  const deleteProduct = useDeleteProduct();
  const { notify } = useToast();

  const isMutating =
    createProduct.isPending || updateProduct.isPending || toggleProductStatus.isPending || deleteProduct.isPending;

  const productCategories = useMemo(
    () => categories,
    [categories]
  );

  const handleSubmitForm = async (payload: ProductCreateInput) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data: payload });
      setEditingProduct(null);
      notify({ variant: 'success', title: 'Producto actualizado', message: 'Los cambios se guardaron correctamente.' });
      return;
    }

    await createProduct.mutateAsync(payload);
    notify({ variant: 'success', title: 'Producto creado', message: 'El producto se creó correctamente.' });
  };

  const handleDelete = async (id: string) => {
    await deleteProduct.mutateAsync(id);
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
    notify({ variant: 'success', title: 'Producto eliminado', message: 'El producto se eliminó correctamente.' });
  };

  const handleToggleStatus = async (product: ProductEntity) => {
    await toggleProductStatus.mutateAsync({ id: product.id, active: !product.active });
    notify({
      variant: 'success',
      title: `Producto ${product.active ? 'desactivado' : 'activado'}`,
      message: 'El estado se actualizó correctamente.'
    });
  };

  return (
    <section className={styles.container}>
      <header>
        <h1>Administración de productos</h1>
        <p>Gestioná el catálogo: creá, editá, activá/desactivá y eliminá productos.</p>
      </header>

      <div className={styles.filters}>
        <Input
          label="Buscar"
          placeholder="Nombre o descripción"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <label>
          Categoría
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">Todas</option>
            {productCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoadingProducts ? <LoadingState message="Cargando productos..." /> : null}

      {!isLoadingProducts && isListError ? (
        <ErrorState
          title="No se pudo cargar productos"
          message={(listError as Error)?.message ?? 'Error inesperado al listar productos.'}
          onRetry={() => void refetch()}
        />
      ) : null}

      {(createProduct.isError || updateProduct.isError || toggleProductStatus.isError || deleteProduct.isError) && (
        <ErrorState
          title="Error al guardar cambios"
          message={
            (createProduct.error as Error)?.message ??
            (updateProduct.error as Error)?.message ??
            (toggleProductStatus.error as Error)?.message ??
            (deleteProduct.error as Error)?.message ??
            'No se pudo completar la operación.'
          }
        />
      )}

      {!isLoadingProducts && !isListError && products.length === 0 ? (
        <EmptyState
          title="No hay productos cargados"
          message="Creá tu primer producto usando el formulario para comenzar a gestionar el catálogo."
        />
      ) : null}

      {!isLoadingProducts && !isListError && products.length > 0 ? (
        <ProductListTable
          products={products}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          isMutating={isMutating}
        />
      ) : null}

      <ProductForm
        categories={productCategories}
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isMutating}
      />
    </section>
  );
}
