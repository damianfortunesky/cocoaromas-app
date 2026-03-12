import type { CartItem } from '@/modules/cart/domain/cart.types';
import styles from './CartItemCard.module.scss';

type CartItemCardProps = {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
};

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

export function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  const subtotal = item.product.price * item.quantity;

  return (
    <article className={styles.productCard}>
      <img src={item.product.imageUrl} alt={item.product.name} className={styles.productImage} />

      <div className={styles.productInfo}>
        <h2>{item.product.name}</h2>
        <p className={styles.unitPrice}>Precio unitario: {currencyFormatter.format(item.product.price)}</p>

        {Object.keys(item.selectedOptions).length > 0 ? (
          <ul className={styles.variantList}>
            {Object.entries(item.selectedOptions).map(([name, value]) => (
              <li key={name}>
                <strong>{name}:</strong> {value}
              </li>
            ))}
          </ul>
        ) : null}

        <div className={styles.actionsRow}>
          <label htmlFor={`qty-${item.id}`} className={styles.quantityLabel}>
            Cantidad
          </label>
          <div className={styles.quantityControl}>
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
              aria-label={`Reducir cantidad de ${item.product.name}`}
            >
              −
            </button>
            <input
              id={`qty-${item.id}`}
              type="number"
              min={1}
              max={item.product.stock > 0 ? item.product.stock : undefined}
              value={item.quantity}
              onChange={(event) => onQuantityChange(item.id, Number(event.target.value))}
            />
            <button
              type="button"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              aria-label={`Aumentar cantidad de ${item.product.name}`}
              disabled={item.product.stock > 0 && item.quantity >= item.product.stock}
            >
              +
            </button>
          </div>
          <button type="button" className={styles.removeButton} onClick={() => onRemove(item.id)}>
            Eliminar
          </button>
        </div>
      </div>

      <strong className={styles.subtotal}>Subtotal: {currencyFormatter.format(subtotal)}</strong>
    </article>
  );
}
