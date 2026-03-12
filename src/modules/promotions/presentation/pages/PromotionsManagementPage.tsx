import { usePromotions } from '@/modules/promotions/application/usePromotions';

export function PromotionsManagementPage() {
  const { data } = usePromotions();
  return <section><h1>Gestión de promociones</h1>{data?.map((p) => <article key={p.id}><strong>{p.name}</strong><p>{p.type === 'percentage' ? `${p.amount}%` : `$${p.amount}`}</p></article>)}</section>;
}
