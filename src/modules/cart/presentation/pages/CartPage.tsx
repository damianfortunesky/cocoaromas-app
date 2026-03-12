import { Link } from 'react-router-dom';
import { useCart } from '@/modules/cart/application/useCart';
import { CartItemCard } from '@/modules/cart/presentation/components/CartItemCard';
import { CartSummaryCard } from '@/modules/cart/presentation/components/CartSummaryCard';
import { Button } from '@/shared/ui/Button/Button';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import styles from './CartPage.module.scss';

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
          <EmptyState message="Tu carrito está vacío" />
          <p>Agregá productos desde el catálogo para comenzar tu pedido.</p>
          <Link to="/catalogo">
            <Button>Explorar catálogo</Button>
          </Link>
        </article>
      ) : (
        <div className={styles.content}>
          <div className={styles.products}>
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
            ))}
          </div>

          <CartSummaryCard summary={summary} />
        </div>
      )}
    </section>
  );
}
