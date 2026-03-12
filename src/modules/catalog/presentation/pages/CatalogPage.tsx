import { useEffect, useMemo, useState } from 'react';
import { useCatalog } from '@/modules/catalog/application/useCatalog';
import { ProductCard } from '@/modules/catalog/presentation/components/ProductCard';
import { useCart } from '@/modules/cart/application/useCart';
import { Loader } from '@/shared/ui/Loader/Loader';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Alert } from '@/shared/ui/Alert/Alert';
import styles from './CatalogPage.module.scss';

type PriceFilter = 'all' | 'low' | 'mid' | 'high';
type AvailabilityFilter = 'all' | 'inStock' | 'outOfStock';

const PAGE_SIZE = 8;

export function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [sort, setSort] = useState<'name' | 'price'>('name');
  const [page, setPage] = useState(1);

  const backendFilters = useMemo(() => {
    const priceRange =
      priceFilter === 'all'
        ? {}
        : priceFilter === 'low'
          ? { maxPrice: 10000 }
          : priceFilter === 'mid'
            ? { minPrice: 10000, maxPrice: 20000 }
            : { minPrice: 20001 };

    const stockFilter =
      availability === 'all'
        ? {}
        : {
            inStock: availability === 'inStock'
          };

    return {
      search,
      category,
      sort,
      page,
      pageSize: PAGE_SIZE,
      ...priceRange,
      ...stockFilter
    };
  }, [availability, category, page, priceFilter, search, sort]);

  const { data, isLoading, isError, error } = useCatalog(backendFilters);
  const { addItem } = useCart();

  const products = data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.pageSize ?? PAGE_SIZE)));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleFilterChange = (updater: () => void) => {
    updater();
    setPage(1);
  };

  return (
    <section className={styles.catalogPage}>
      <h1>Catálogo</h1>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2>Filtros</h2>

          <div className={styles.filterGroup}>
            <label htmlFor="category-filter">Categoría</label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => handleFilterChange(() => setCategory(e.target.value))}
            >
              <option value="">Todas</option>
              <option value="sahumerios">Sahumerios</option>
              <option value="perfumes">Perfumes</option>
              <option value="remeras">Remeras</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="price-filter">Precio</label>
            <select
              id="price-filter"
              value={priceFilter}
              onChange={(e) => handleFilterChange(() => setPriceFilter(e.target.value as PriceFilter))}
            >
              <option value="all">Todos</option>
              <option value="low">Hasta $10.000</option>
              <option value="mid">$10.000 - $20.000</option>
              <option value="high">Más de $20.000</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="availability-filter">Disponibilidad</label>
            <select
              id="availability-filter"
              value={availability}
              onChange={(e) => handleFilterChange(() => setAvailability(e.target.value as AvailabilityFilter))}
            >
              <option value="all">Todos</option>
              <option value="inStock">Con stock</option>
              <option value="outOfStock">Sin stock</option>
            </select>
          </div>
        </aside>

        <div className={styles.mainContent}>
          <div className={styles.topBar}>
            <input
              placeholder="Buscar productos"
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
              aria-label="Buscar productos"
            />
            <select
              value={sort}
              onChange={(e) => handleFilterChange(() => setSort(e.target.value as 'name' | 'price'))}
              aria-label="Ordenar productos"
            >
              <option value="name">Ordenar por nombre</option>
              <option value="price">Ordenar por precio</option>
            </select>
          </div>

          {isLoading && <Loader />}

          {!isLoading && isError && (
            <Alert variant="danger" title="No pudimos cargar el catálogo">
              {(error as Error | undefined)?.message ?? 'Intentá nuevamente en unos segundos.'}
            </Alert>
          )}

          {!isLoading && !isError && !products.length && <EmptyState message="No encontramos productos" />}

          {!isLoading && !isError && (
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={(product) => addItem({ product })} />
              ))}
            </div>
          )}

          {!isLoading && !isError && products.length > 0 && (
            <div className={styles.pagination}>
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                Anterior
              </button>
              <span>
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
