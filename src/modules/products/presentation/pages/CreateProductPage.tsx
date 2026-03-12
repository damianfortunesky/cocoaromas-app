import { useState } from 'react';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Loader } from '@/shared/ui/Loader/Loader';
import { useAdminProducts, useCreateProduct, useDeleteProduct, useUpdateProduct } from '@/modules/products/application/useAdminProducts';
import type { ProductCreateInput, ProductEntity } from '@/modules/products/domain/productAdmin.types';
import { ProductListTable } from '@/modules/products/presentation/components/ProductListTable';
import { ProductForm } from '@/modules/products/presentation/components/ProductForm';
import styles from './CreateProductPage.module.scss';

export function CreateProductPage() {
  const [editingProduct, setEditingProduct] = useState<ProductEntity | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const isMutating = createProduct.isPending || updateProduct.isPending || deleteProduct.isPending;

  const setSuccess = (message: string) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleSubmitForm = async (payload: ProductCreateInput) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data: payload });
      setEditingProduct(null);
      setSuccess('Producto actualizado correctamente.');
      return;
    }

    await createProduct.mutateAsync(payload);
    setSuccess('Producto creado correctamente.');
  };

  const handleDelete = async (id: string) => {
    await deleteProduct.mutateAsync(id);
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
    setSuccess('Producto eliminado correctamente.');
  };

  const handleToggleStatus = async (product: ProductEntity) => {
    await updateProduct.mutateAsync({ id: product.id, data: { active: !product.active } });
    setSuccess(`Producto ${product.active ? 'desactivado' : 'activado'} correctamente.`);
  };

  return (
    <section className={styles.container}>
      <header>
        <h1>Administración de productos</h1>
        <p>Gestioná el catálogo: creá, editá, activá/desactivá y eliminá productos.</p>
      </header>

      {isLoadingProducts && (
        <div className={styles.feedbackRow}>
          <Loader />
          <span>Cargando productos...</span>
        </div>
      )}

      {isListError && (
        <Alert variant="danger" title="No se pudo cargar productos">
          {(listError as Error)?.message ?? 'Error inesperado al listar productos.'}
        </Alert>
      )}

      {(createProduct.isError || updateProduct.isError || deleteProduct.isError) && (
        <Alert variant="danger" title="Error al guardar cambios">
          {(createProduct.error as Error)?.message ??
            (updateProduct.error as Error)?.message ??
            (deleteProduct.error as Error)?.message ??
            'No se pudo completar la operación.'}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" title="Operación exitosa">
          {successMessage}
        </Alert>
      )}

      {!isLoadingProducts && !isListError && (
        <ProductListTable
          products={products}
          onEdit={setEditingProduct}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          isMutating={isMutating}
        />
      )}

      <ProductForm
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
        onSubmitForm={handleSubmitForm}
        isSubmitting={isMutating}
      />

      {isListError && (
        <button className={styles.retryButton} type="button" onClick={() => refetch()}>
          Reintentar listado
        </button>
      )}
    </section>
  );
}
