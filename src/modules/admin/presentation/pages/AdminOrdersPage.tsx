import { useQuery, useMutation } from '@tanstack/react-query';
import { mockOrdersRepository } from '@/modules/orders/infrastructure/mockOrdersRepository';
import { Button } from '@/shared/ui/Button/Button';

export function AdminOrdersPage() {
  const { data } = useQuery({ queryKey: ['admin-orders'], queryFn: () => mockOrdersRepository.listAll() });
  const update = useMutation({ mutationFn: ({ id, status }: { id: string; status: Parameters<typeof mockOrdersRepository.updateStatus>[1] }) => mockOrdersRepository.updateStatus(id, status) });
  return <section><h1>Gestión de pedidos</h1>{data?.map((o) => <div key={o.id}><p>{o.id} - {o.status}</p><Button onClick={() => update.mutate({ id: o.id, status: 'pagado' })}>Marcar pagado</Button><Button onClick={() => update.mutate({ id: o.id, status: 'entregado' })}>Marcar entregado</Button></div>)}</section>;
}
