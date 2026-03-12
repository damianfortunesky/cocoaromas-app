import { useAuth } from '@/modules/auth/application/useAuth';
import { useMyOrders } from '@/modules/orders/application/useOrders';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState/LoadingState';
import styles from './MyOrdersPage.module.scss';

export function MyOrdersPage() {
  const { session } = useAuth();
  const { data = [], isLoading, isError, error, refetch } = useMyOrders(session?.userId ?? '');

  return (
    <section className={styles.page}>
      <h1>Mis pedidos</h1>

      {isLoading ? <LoadingState message="Cargando tus pedidos..." /> : null}

      {!isLoading && isError ? (
        <ErrorState
          title="No pudimos cargar tus pedidos"
          message={(error as Error | undefined)?.message ?? 'Intentá nuevamente en unos segundos.'}
          onRetry={() => void refetch()}
        />
      ) : null}

      {!isLoading && !isError && data.length === 0 ? (
        <EmptyState
          title="Todavía no tenés pedidos"
          message="Cuando realices una compra, vas a poder seguir el estado de tus pedidos desde acá."
        />
      ) : null}

      {!isLoading && !isError && data.length > 0 ? (
        <div className={styles.orders}>
          {data.map((order) => (
            <article key={order.id} className={styles.order}>
              <p><strong>Pedido:</strong> {order.id}</p>
              <p><strong>Estado:</strong> {order.status}</p>
              <p><strong>Total:</strong> ${order.total.toLocaleString('es-AR')}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
