import { useState } from 'react';
import { useCatalog } from '@/modules/catalog/application/useCatalog';
import { ProductCard } from '@/modules/catalog/presentation/components/ProductCard';
import { Loader } from '@/shared/ui/Loader/Loader';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import styles from './CatalogPage.module.scss';

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<'name' | 'price'>('name');
  const { data, isLoading } = useCatalog({ search, category, sort });

  return (
    <section>
      <h1>Catálogo</h1>
      <div className={styles.filters}>
        <input placeholder="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Todas</option><option value="sahumerios">Sahumerios</option><option value="perfumes">Perfumes</option><option value="remeras">Remeras</option></select>
        <select value={sort} onChange={(e) => setSort(e.target.value as 'name' | 'price')}><option value="name">Nombre</option><option value="price">Precio</option></select>
      </div>
      {isLoading && <Loader />}
      {!isLoading && !data?.items.length && <EmptyState message="No encontramos productos" />}
      <div className={styles.grid}>{data?.items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  );
}
