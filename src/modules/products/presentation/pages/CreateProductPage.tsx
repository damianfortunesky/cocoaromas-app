import { useState } from 'react';
import { LoadingState } from '@/shared/ui/LoadingState/LoadingState';
import { useAdminProducts, useCreateProduct, useDeleteProduct, useUpdateProduct } from '@/modules/products/application/useAdminProducts';
import type { ProductCreateInput, ProductEntity } from '@/modules/products/domain/productAdmin.types';
import { ProductListTable } from '@/modules/products/presentation/components/ProductListTable';
import { ProductForm } from '@/modules/products/presentation/components/ProductForm';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { useToast } from '@/shared/ui/Toast/ToastProvider';
import styles from './CreateProductPage.module.scss';

export function CreateProductPage() {
  const [editingProduct, setEditingProduct] = useState<ProductEntity | null>(null);

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isListError,
    error: listError,
    refetch
  } = useAdminProducts();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { notify } = useToast();

  const isMutating = createProduct.isPending || updateProduct.isPending || deleteProduct.isPending;

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
    await updateProduct.mutateAsync({ id: product.id, data: { active: !product.active } });
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

      {isLoadingProducts ? <LoadingState message="Cargando productos..." /> : null}

      {!isLoadingProducts && isListError ? (
        <ErrorState
          title="No se pudo cargar productos"
          message={(listError as Error)?.message ?? 'Error inesperado al listar productos.'}
          onRetry={() => void refetch()}
        />
      ) : null}

      {(createProduct.isError || updateProduct.isError || deleteProduct.isError) && (
        <ErrorState
          title="Error al guardar cambios"
          message={
            (createProduct.error as Error)?.message ??
            (updateProduct.error as Error)?.message ??
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
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isMutating}
      />
    </section>
  );
}
