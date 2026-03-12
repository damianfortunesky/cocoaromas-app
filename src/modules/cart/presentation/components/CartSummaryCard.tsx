import { Link } from 'react-router-dom';
import type { CartSummary } from '@/modules/cart/domain/cart.types';
import { Button } from '@/shared/ui/Button/Button';
import styles from './CartSummaryCard.module.scss';

type CartSummaryCardProps = {
  summary: CartSummary;
};

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

export function CartSummaryCard({ summary }: CartSummaryCardProps) {
  return (
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
  );
}
