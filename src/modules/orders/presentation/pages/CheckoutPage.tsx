import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/modules/cart/application/useCart';
import { useAuth } from '@/modules/auth/application/useAuth';
import { useCreateOrder } from '@/modules/orders/application/useOrders';
import { Button } from '@/shared/ui/Button/Button';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { summary } = useCart();
  const [method, setMethod] = useState<'transfer' | 'mercado_pago'>('transfer');
  const createOrder = useCreateOrder();

  const submit = async () => {
    if (!session) return navigate('/login');
    await createOrder.mutateAsync({ userId: session.userId, total: summary.total, paymentMethod: method });
    navigate('/mis-pedidos');
  };

  return <section><h1>Checkout</h1><p>Total: ${summary.total}</p><select value={method} onChange={(e)=>setMethod(e.target.value as 'transfer' | 'mercado_pago')}><option value="transfer">Transferencia bancaria</option><option value="mercado_pago">Mercado Pago (próximamente)</option></select><Button onClick={submit}>Confirmar pedido</Button></section>;
}
