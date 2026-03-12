import { Link } from 'react-router-dom';
import { useCart } from '@/modules/cart/application/useCart';
import { Button } from '@/shared/ui/Button/Button';
import styles from './CartPage.module.scss';

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

export function CartPage() {
  const { items, updateQuantity, removeItem, summary } = useCart();

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Tu carrito</h1>
        <p>Revisá tus productos, ajustá cantidades y continuá con tu compra.</p>
      </header>

      {items.length === 0 ? (
        <article className={styles.emptyState}>
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos desde el catálogo para comenzar tu pedido.</p>
          <Link to="/catalogo">
            <Button>Explorar catálogo</Button>
          </Link>
        </article>
      ) : (
        <div className={styles.content}>
          <div className={styles.products}>
            {items.map((item) => {
              const subtotal = item.product.price * item.quantity;

              return (
                <article key={item.product.id} className={styles.productCard}>
                  <img src={item.product.imageUrl} alt={item.product.name} className={styles.productImage} />

                  <div className={styles.productInfo}>
                    <h2>{item.product.name}</h2>
                    <p className={styles.unitPrice}>Precio unitario: {currencyFormatter.format(item.product.price)}</p>

                    <div className={styles.actionsRow}>
                      <label htmlFor={`qty-${item.product.id}`} className={styles.quantityLabel}>
                        Cantidad
                      </label>
                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          aria-label={`Reducir cantidad de ${item.product.name}`}
                        >
                          −
                        </button>
                        <input
                          id={`qty-${item.product.id}`}
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label={`Aumentar cantidad de ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button type="button" className={styles.removeButton} onClick={() => removeItem(item.product.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <strong className={styles.subtotal}>Subtotal: {currencyFormatter.format(subtotal)}</strong>
                </article>
              );
            })}
          </div>

          <aside className={styles.summary}>
            <h2>Resumen</h2>
            <dl>
              <div>
                <dt>Subtotal</dt>
                <dd>{currencyFormatter.format(summary.subtotal)}</dd>
              </div>
              <div>
                <dt>Descuentos</dt>
                <dd>-{currencyFormatter.format(summary.discount)}</dd>
              </div>
              <div className={styles.totalRow}>
                <dt>Total</dt>
                <dd>{currencyFormatter.format(summary.total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className={styles.checkoutLink}>
              <Button>Continuar compra</Button>
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
