import { Link } from 'react-router-dom';
import type { Product } from '@/mocks/db';
import { Card } from '@/shared/ui/Card/Card';
import { Badge } from '@/shared/ui/Badge/Badge';
import styles from './ProductCard.module.scss';

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  return (
    <Card>
      <article className={`${styles.product} ${outOfStock ? styles.out : ''}`}>
        <img src={product.imageUrl} alt={product.name} />
        <Badge>{product.category}</Badge>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <strong>${product.price.toLocaleString('es-AR')}</strong>
        <small>Stock: {product.stock}</small>
        <Link to={`/catalogo/${product.id}`}>Ver detalle</Link>
      </article>
    </Card>
  );
}
