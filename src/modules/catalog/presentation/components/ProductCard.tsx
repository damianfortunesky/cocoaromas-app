import { Link } from 'react-router-dom';
import type { Product } from '@/mocks/db';
import { Card } from '@/shared/ui/Card/Card';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Button } from '@/shared/ui/Button/Button';
import styles from './ProductCard.module.scss';

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
  detailHref?: string;
  className?: string;
};

export function ProductCard({ product, onAddToCart, detailHref = `/catalogo/${product.id}`, className = '' }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <Card className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ''} ${className}`.trim()}>
      <article className={styles.product}>
        <div className={styles.imageWrap}>
          <img src={product.imageUrl} alt={product.name} className={styles.image} />
          <Badge>{product.category}</Badge>
        </div>

        <div className={styles.content}>
          <h3>{product.name}</h3>
          <strong>${product.price.toLocaleString('es-AR')}</strong>
          <small className={isOutOfStock ? styles.stockOff : styles.stockOn}>
            {isOutOfStock ? 'Sin stock' : `Stock disponible: ${product.stock}`}
          </small>
        </div>

        <div className={styles.actions}>
          <Link to={detailHref} className={styles.detailLink}>
            Ver detalle
          </Link>
          <Button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={isOutOfStock || !onAddToCart}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            Agregar al carrito
          </Button>
        </div>
      </article>
    </Card>
  );
}
