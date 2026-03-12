import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProductDetail, useRelatedProducts } from '@/modules/catalog/application/useCatalog';
import { Button } from '@/shared/ui/Button/Button';
import { useCart } from '@/modules/cart/application/useCart';
import { ProductCard } from '@/modules/catalog/presentation/components/ProductCard';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Alert } from '@/shared/ui/Alert/Alert';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import type { HttpError } from '@/shared/api/httpErrors';
import styles from './ProductDetailPage.module.scss';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { data, isLoading, isError, error } = useProductDetail(id);
  const {
    data: relatedProducts = [],
    isLoading: isRelatedLoading,
    isError: isRelatedError
  } = useRelatedProducts(data, 4);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});

  const normalizedAttributes = useMemo(() => {
    if (!data?.attributes) return [];

    return Object.entries(data.attributes).filter(([, value]) => String(value).trim().length > 0);
  }, [data?.attributes]);

  if (isLoading) {
    return (
      <section className={styles.feedbackState}>
        <Loader />
        <p>Cargando detalle del producto...</p>
      </section>
    );
  }

  if (isError) {
    const requestError = error as HttpError | null;

    return (
      <section className={styles.feedbackState}>
        <Alert variant="danger" title="No pudimos cargar el producto">
          {requestError?.message ?? 'Intentalo de nuevo en unos minutos.'}
        </Alert>
        <Link to="/catalogo">Volver al catálogo</Link>
      </section>
    );
  }

  if (!data) {
    return (
      <section className={styles.notFoundState}>
        <h1>Producto no encontrado</h1>
        <p>Puede que el producto ya no esté disponible o que el enlace sea incorrecto.</p>
        <Link to="/catalogo">Volver al catálogo</Link>
      </section>
    );
  }

  const isOutOfStock = data.stock <= 0;

  return (
    <div className={styles.page}>
      <section className={styles.productLayout}>
        <div className={styles.imagePanel}>
          <img src={data.imageUrl} alt={data.name} />
        </div>

        <div className={styles.infoPanel}>
          <small className={styles.category}>{data.category}</small>
          <h1>{data.name}</h1>
          <strong className={styles.price}>${data.price.toLocaleString('es-AR')}</strong>
          <p className={styles.description}>{data.description || 'Sin descripción disponible para este producto.'}</p>

          {normalizedAttributes.length ? (
            <dl className={styles.attributesList}>
              {normalizedAttributes.map(([label, value]) => (
                <div key={label} className={styles.attributeRow}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <EmptyState message="Este producto no tiene atributos adicionales." />
          )}

          {data.variants?.length ? (
            <div className={styles.variants}>
              <h2>Variantes</h2>
              {data.variants.map((variant) => (
                <label key={variant.name}>
                  {variant.name}
                  <select
                    value={selectedVariant[variant.name] ?? variant.options[0]}
                    onChange={(event) => {
                      setSelectedVariant((current) => ({ ...current, [variant.name]: event.target.value }));
                    }}
                  >
                    {variant.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          ) : null}

          <p className={isOutOfStock ? styles.outOfStock : styles.inStock}>
            {isOutOfStock ? 'Sin stock disponible' : `Stock disponible: ${data.stock} unidades`}
          </p>

          <Button type="button" onClick={() => addItem({ product: data, selectedOptions: selectedVariant })} disabled={isOutOfStock}>
            Agregar al carrito
          </Button>
        </div>
      </section>

      <section className={styles.longDescription}>
        <h2>Descripción</h2>
        <p>{data.description || 'Sin descripción detallada disponible.'}</p>
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <h2>Productos relacionados</h2>
          <Link to="/catalogo">Ver todo</Link>
        </div>

        {isRelatedLoading ? (
          <div className={styles.relatedFeedback}>
            <Loader />
            <p>Cargando productos relacionados...</p>
          </div>
        ) : null}

        {isRelatedError ? (
          <Alert variant="warning" title="No pudimos cargar relacionados">
            Mostramos esta sección de forma temporalmente limitada.
          </Alert>
        ) : null}

        {!isRelatedLoading && !relatedProducts.length ? (
          <EmptyState message="No hay productos relacionados para mostrar por ahora." />
        ) : (
          <div className={styles.relatedGrid}>
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={(product) => addItem({ product })} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
