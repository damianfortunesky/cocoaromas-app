import { useState } from 'react';
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

const emptyForm = { name: '', slug: '', description: '' };

export function CategoriesManagementPage() {
  const { data: categories = [], isLoading, isError } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);

  const isMutating = createCategory.isPending || updateCategory.isPending || deleteCategory.isPending;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim() || undefined,
      active: true
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
      slug: category.slug ?? '',
      description: category.description ?? ''
    });
  };

  const rows = categories.map((category) => [
    category.name,
    category.slug ?? '-',
    category.description ?? '-',
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

      {!isLoading && !isError && categories.length > 0 && (
        <DataTable headers={['Nombre', 'Slug', 'Descripción', 'Acciones']} rows={rows} />
      )}

      <article className={styles.formCard}>
        <h2>{editing ? 'Editar categoría' : 'Nueva categoría'}</h2>
        <form className={styles.form} onSubmit={onSubmit}>
          <label>
            Nombre
            <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </label>
          <label>
            Slug
            <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} />
          </label>
          <label>
            Descripción
            <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
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
