import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '@/modules/cart/application/useCart';
import { useAuth } from '@/modules/auth/application/useAuth';
import { useCreateOrder } from '@/modules/orders/application/useOrders';
import type { CheckoutItemPayload, PaymentMethod } from '@/modules/orders/domain/order.types';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import styles from './CheckoutPage.module.scss';

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

export function CheckoutPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { items, summary, clear } = useCart();
  const [method, setMethod] = useState<PaymentMethod>('transfer');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [notes, setNotes] = useState('');
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const createOrder = useCreateOrder();

  const itemRows = useMemo<CheckoutItemPayload[]>(() => {
    const subtotal = summary.subtotal > 0 ? summary.subtotal : 1;

    return items.map((item) => {
      const lineSubtotal = item.product.price * item.quantity;
      const discountRatio = summary.discount / subtotal;
      const lineDiscount = Math.round(lineSubtotal * discountRatio);
      const lineTotal = Math.max(0, lineSubtotal - lineDiscount);

      return {
        productId: item.product.id,
        productName: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        lineSubtotal,
        lineDiscount,
        lineTotal
      };
    });
  }, [items, summary.discount, summary.subtotal]);

  if (!session) return <Navigate to="/login" replace />;

  if (items.length === 0 && !successOrderId) {
    return (
      <section className={styles.page}>
        <h1>Checkout</h1>
        <Alert variant="warning" title="Tu carrito está vacío">
          Agregá productos para poder confirmar un pedido.
        </Alert>
        <Button onClick={() => navigate('/catalogo')}>Ir al catálogo</Button>
      </section>
    );
  }

  const validate = () => {
    if (!buyerName.trim()) return 'Ingresá el nombre de quien recibe el pedido.';
    if (!shippingAddress.trim()) return 'Ingresá una dirección de entrega o retiro.';
    if (!contactPhone.trim()) return 'Ingresá un teléfono de contacto.';
    return null;
  };

  const submit = async () => {
    const validationError = validate();
    setFormError(validationError);
    if (validationError || !session) return;

    try {
      const order = await createOrder.mutateAsync({
        userId: session.userId,
        paymentMethod: method,
        items: itemRows,
        subtotal: summary.subtotal,
        discount: summary.discount,
        total: summary.total,
        shippingAddress: shippingAddress.trim(),
        contactPhone: contactPhone.trim(),
        buyerName: buyerName.trim(),
        notes: notes.trim() || undefined
      });

      setSuccessOrderId(order.id);
      clear();
      navigate('/mis-pedidos', { replace: true, state: { orderId: order.id } });
    } catch {
      // Error handled by mutation state.
    }
  };

  return (
    <section className={styles.page}>
      <header>
        <h1>Checkout</h1>
        <p>Revisá tu pedido, completá los datos de contacto y confirmá la compra.</p>
      </header>

      <div className={styles.layout}>
        <article className={styles.card}>
          <h2>Datos del pedido</h2>
          <label>
            Nombre y apellido
            <input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} placeholder="Ej: Ana Pérez" />
          </label>
          <label>
            Dirección de entrega / retiro
            <input
              value={shippingAddress}
              onChange={(event) => setShippingAddress(event.target.value)}
              placeholder="Ej: Av. Corrientes 1234, CABA"
            />
          </label>
          <label>
            Teléfono de contacto
            <input value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} placeholder="Ej: +54 11 5555 5555" />
          </label>
          <label>
            Método de pago
            <select value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)}>
              <option value="transfer">Transferencia bancaria</option>
              <option value="mercado_pago">Mercado Pago (próximamente)</option>
            </select>
          </label>
          <label>
            Observaciones (opcional)
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              placeholder="Notas para armado o entrega del pedido"
            />
          </label>

          {formError && (
            <Alert variant="warning" title="Revisá los datos">
              {formError}
            </Alert>
          )}

          {createOrder.isError && (
            <Alert variant="danger" title="No pudimos crear tu pedido">
              Intentá nuevamente en unos segundos.
            </Alert>
          )}

          {successOrderId && (
            <Alert variant="success" title="Pedido creado">
              Tu pedido {successOrderId} fue generado correctamente.
            </Alert>
          )}

          <Button onClick={submit} loading={createOrder.isPending}>
            Confirmar pedido
          </Button>
        </article>

        <aside className={styles.card}>
          <h2>Resumen final</h2>
          <ul className={styles.itemsList}>
            {itemRows.map((item) => (
              <li key={item.productId}>
                <div>
                  <strong>{item.productName}</strong>
                  <p>{item.quantity} × {currencyFormatter.format(item.unitPrice)}</p>
                </div>
                <div>
                  {item.lineDiscount > 0 && <small>-{currencyFormatter.format(item.lineDiscount)}</small>}
                  <p>{currencyFormatter.format(item.lineTotal)}</p>
                </div>
              </li>
            ))}
          </ul>

          <dl className={styles.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{currencyFormatter.format(summary.subtotal)}</dd>
            </div>
            <div>
              <dt>Descuento</dt>
              <dd>-{currencyFormatter.format(summary.discount)}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{currencyFormatter.format(summary.total)}</dd>
            </div>
          </dl>

          <p className={styles.footnote}>
            El stock se descuenta al confirmar el pago. Tu pedido se crea con estado inicial pendiente/esperando pago.
          </p>
        </aside>
      </div>
    </section>
  );
}
