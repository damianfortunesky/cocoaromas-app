import { useAdminProducts, useUpdateProduct } from '@/modules/products/application/useAdminProducts';
import { Button } from '@/shared/ui/Button/Button';

export function StockManagementPage() {
  const { data } = useAdminProducts();
  const update = useUpdateProduct();

  return <section><h1>Gestión de stock</h1>{data?.map((p) => <div key={p.id}><p>{p.name} | Stock {p.stock} {p.stock <= 3 ? '⚠️ bajo' : ''}</p><Button onClick={() => p.stock > 0 && update.mutate({ id: p.id, data: { stock: p.stock - 1 } })}>-1</Button><Button onClick={() => update.mutate({ id: p.id, data: { stock: p.stock + 1 } })}>+1</Button></div>)}</section>;
}
