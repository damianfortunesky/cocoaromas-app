import { useMemo, useState } from 'react';
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory
} from '@/modules/categories/application/useCategories';
import type { Category } from '@/modules/categories/domain/category.types';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import { DataTable } from '@/shared/ui/DataTable/DataTable';
import { Loader } from '@/shared/ui/Loader/Loader';
import styles from './CategoriesManagementPage.module.scss';

const emptyForm = { name: '', displayOrder: 0 };

const generateSlug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

export function CategoriesManagementPage() {
  const { data: categories = [], isLoading, isError } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);

  const isMutating = createCategory.isPending || updateCategory.isPending || deleteCategory.isPending;

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.displayOrder - b.displayOrder),
    [categories]
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    const payload = {
      name: trimmedName,
      slug: generateSlug(trimmedName),
      displayOrder: form.displayOrder
    };

    if (editing) {
      await updateCategory.mutateAsync({ id: editing.id, data: payload });
    } else {
      await createCategory.mutateAsync(payload);
    }

    setEditing(null);
    setForm(emptyForm);
  };

  const startEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      displayOrder: category.displayOrder
    });
  };

  const rows = sortedCategories.map((category) => [
    category.displayOrder,
    category.name,
    category.slug || '-',
    <div key={category.id} className={styles.actions}>
      <Button type="button" variant="secondary" onClick={() => startEdit(category)}>Editar</Button>
      <Button type="button" variant="secondary" onClick={() => void deleteCategory.mutateAsync(category.id)}>Eliminar</Button>
    </div>
  ]);

  return (
    <section className={styles.container}>
      <header>
        <h1>Gestión de categorías</h1>
        <p>Creá y mantené categorías para productos y promociones.</p>
      </header>

      {isLoading && <div className={styles.loader}><Loader /> Cargando categorías...</div>}
      {isError && <Alert variant="danger">No se pudieron cargar categorías.</Alert>}
      {(createCategory.isError || updateCategory.isError || deleteCategory.isError) && (
        <Alert variant="danger">No se pudo completar la operación en categorías.</Alert>
      )}

      {!isLoading && !isError && sortedCategories.length > 0 && (
        <DataTable headers={['Orden', 'Nombre', 'Slug', 'Acciones']} rows={rows} />
      )}

      <article className={styles.formCard}>
        <h2>{editing ? 'Editar categoría' : 'Nueva categoría'}</h2>
        <form className={styles.form} onSubmit={onSubmit}>
          <label>
            Nombre
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </label>
          <label>
            Orden de visualización
            <input
              type="number"
              value={form.displayOrder}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  displayOrder: Number(event.target.value)
                }))
              }
            />
          </label>

          <div className={styles.actions}>
            <Button type="submit" loading={isMutating} disabled={isMutating || !form.name.trim()}>
              {editing ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
            {editing && (
              <Button type="button" variant="secondary" onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </article>
    </section>
  );
}
