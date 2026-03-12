import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProductDetail } from '@/modules/catalog/application/useCatalog';
import { Button } from '@/shared/ui/Button/Button';
import { useCart } from '@/modules/cart/application/useCart';
import { mockProducts } from '@/mocks/db';
import { ProductCard } from '@/modules/catalog/presentation/components/ProductCard';
import styles from './ProductDetailPage.module.scss';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { data } = useProductDetail(id);
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});

  const relatedProducts = useMemo(() => {
    if (!data) return [];
    return mockProducts
      .filter((product) => product.category === data.category && product.id !== data.id)
      .slice(0, 4);
  }, [data]);

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
          <p className={styles.description}>{data.description}</p>

          <dl className={styles.attributesList}>
            {Object.entries(data.attributes).map(([label, value]) => (
              <div key={label} className={styles.attributeRow}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

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

          <Button type="button" onClick={() => addItem(data)} disabled={isOutOfStock}>
            Agregar al carrito
          </Button>
        </div>
      </section>

      <section className={styles.longDescription}>
        <h2>Descripción larga</h2>
        <p>
          {data.name} fue diseñado para transformar tu rutina en una experiencia sensorial elegante. Su composición combina materiales de
          calidad, aromas equilibrados y una estética minimalista para acompañar tanto tus momentos de bienestar como tus espacios favoritos.
        </p>
        <p>
          Ideal para regalar o disfrutar en el día a día, esta pieza de CocoAromas refleja nuestra búsqueda de productos cálidos, modernos y
          cuidadosamente seleccionados.
        </p>
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <h2>Productos relacionados</h2>
          <Link to="/catalogo">Ver todo</Link>
        </div>
        <div className={styles.relatedGrid}>
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addItem} />
          ))}
        </div>
      </section>
    </div>
  );
}
