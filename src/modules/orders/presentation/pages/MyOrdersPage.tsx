import { useAuth } from '@/modules/auth/application/useAuth';
import { useMyOrders } from '@/modules/orders/application/useOrders';

export function MyOrdersPage() {
  const { session } = useAuth();
  const { data } = useMyOrders(session?.userId ?? '');
  return <section><h1>Mis pedidos</h1>{data?.map((o) => <article key={o.id}><p>{o.id}</p><p>{o.status}</p><p>${o.total}</p></article>)}</section>;
}
