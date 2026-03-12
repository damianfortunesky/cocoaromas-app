import { useMemo, useState } from 'react';
import { Alert } from '@/shared/ui/Alert/Alert';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Button } from '@/shared/ui/Button/Button';
import { DataTable } from '@/shared/ui/DataTable/DataTable';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import { Input } from '@/shared/ui/Input/Input';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Modal } from '@/shared/ui/Modal/Modal';
import { useAuth } from '@/modules/auth/application/useAuth';
import { useAdminOrderDetail, useAdminOrders, useUpdateAdminOrderStatus } from '@/modules/orders/application/useOrders';
import {
  canManageOrderStatus,
  canUpdateOrderStatus,
  getAllowedStatusTransitions,
  ORDER_STATUSES
} from '@/modules/orders/domain/orderStatus.rules';
import type { Order, OrderStatus } from '@/modules/orders/domain/order.types';
import styles from './AdminOrdersPage.module.scss';

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = ORDER_STATUSES.map((status) => ({
  value: status,
  label: status.replace('_', ' ')
}));

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function StatusEditor({
  order,
  canManage,
  isSaving,
  onUpdate
}: {
  order: Order;
  canManage: boolean;
  isSaving: boolean;
  onUpdate: (orderId: string, status: OrderStatus) => void;
}) {
  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('');
  const allowedStatuses = useMemo(() => getAllowedStatusTransitions(order), [order]);

  return (
    <div className={styles.statusEditor}>
      <select
        className={styles.select}
        value={nextStatus}
        disabled={!canManage || isSaving || allowedStatuses.length === 0}
        onChange={(event) => setNextStatus(event.target.value as OrderStatus | '')}
      >
        <option value="">Cambiar estado...</option>
        {allowedStatuses.map((status) => (
          <option key={`${order.id}-${status}`} value={status}>
            {status.replace('_', ' ')}
          </option>
        ))}
      </select>
      <Button
        type="button"
        loading={isSaving}
        disabled={!canManage || !nextStatus || !canUpdateOrderStatus(order, nextStatus)}
        onClick={() => {
          if (!nextStatus) return;
          onUpdate(order.id, nextStatus);
          setNextStatus('');
        }}
      >
        Guardar
      </Button>
    </div>
  );
}

export function AdminOrdersPage() {
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { session } = useAuth();
  const canManage = canManageOrderStatus(session?.role);

  const { data = [], isPending, isError, error } = useAdminOrders({
    status: status || undefined,
    search: search.trim() || undefined
  });

  const detailQuery = useAdminOrderDetail(selectedOrderId);
  const updateStatus = useUpdateAdminOrderStatus();

  const rows = data.map((order) => {
    const statusLabel = order.status.replace('_', ' ');

    return [
      order.id,
      order.buyerName,
      formatDate(order.createdAt),
      formatCurrency(order.total),
      <Badge key={`status-${order.id}`}><span className={styles.statusBadge}>{statusLabel}</span></Badge>,
      <StatusEditor
        key={`editor-${order.id}-${order.status}`}
        order={order}
        canManage={canManage}
        isSaving={updateStatus.isPending}
        onUpdate={(orderId, nextStatus) => updateStatus.mutate({ id: orderId, status: nextStatus })}
      />,
      <div key={`actions-${order.id}`} className={styles.actions}>
        <Button type="button" variant="secondary" onClick={() => setSelectedOrderId(order.id)}>Ver detalle</Button>
      </div>
    ];
  });

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1>Gestión de pedidos</h1>
        <p>Visualizá pedidos reales, filtrá por estado y actualizá su progreso logístico y de pago.</p>
      </header>

      {!canManage && <Alert variant="warning" title="Permisos insuficientes">Solo admin y employee pueden cambiar estado.</Alert>}
      {updateStatus.isSuccess && <Alert variant="success" title="Estado actualizado">El pedido fue actualizado correctamente.</Alert>}
      {updateStatus.isError && <Alert variant="danger" title="No se pudo actualizar estado">{updateStatus.error.message}</Alert>}

      <div className={styles.filters}>
        <label className={styles.field}>
          <span>Estado</span>
          <select className={styles.select} value={status} onChange={(event) => setStatus(event.target.value as OrderStatus | '')}>
            <option value="">Todos</option>
            {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>

        <Input
          label="Buscar"
          placeholder="Cliente o número de pedido"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isPending && <div className={styles.loading}><Loader /> Cargando pedidos...</div>}
      {isError && <Alert variant="danger" title="No se pudieron cargar pedidos">{error.message}</Alert>}
      {!isPending && !isError && data.length === 0 && <EmptyState message="No hay pedidos para los filtros seleccionados." />}

      {!isPending && !isError && data.length > 0 && (
        <DataTable
          headers={['Pedido', 'Cliente', 'Fecha', 'Total', 'Estado actual', 'Actualizar estado', 'Acciones']}
          rows={rows}
        />
      )}

      {selectedOrderId && (
        <Modal onClose={() => setSelectedOrderId(null)}>
          <h2>Detalle de pedido</h2>
          {detailQuery.isPending && <div className={styles.loading}><Loader /> Cargando detalle...</div>}
          {detailQuery.isError && <Alert variant="danger" title="No se pudo cargar el detalle">{detailQuery.error.message}</Alert>}
          {detailQuery.data && (
            <>
              <div className={styles.detailGrid}>
                <p><strong>Número:</strong> {detailQuery.data.id}</p>
                <p><strong>Cliente:</strong> {detailQuery.data.buyerName}</p>
                <p><strong>Estado:</strong> {detailQuery.data.status.replace('_', ' ')}</p>
                <p><strong>Método de pago:</strong> {detailQuery.data.paymentMethod}</p>
                <p><strong>Dirección:</strong> {detailQuery.data.shippingAddress}</p>
                <p><strong>Teléfono:</strong> {detailQuery.data.contactPhone}</p>
              </div>

              <h3>Items</h3>
              <ul className={styles.items}>
                {detailQuery.data.items.map((item) => (
                  <li key={`${detailQuery.data?.id}-${item.productId}`}>
                    {item.productName} x{item.quantity} - {formatCurrency(item.lineTotal)}
                  </li>
                ))}
              </ul>

              {detailQuery.data.paymentMethod === 'transfer' && detailQuery.data.status === 'esperando_pago' && (
                <Alert variant="info" title="Flujo transferencia manual">
                  Verificá comprobante de transferencia para avanzar a pagado y continuar el despacho.
                </Alert>
              )}

              <p className={styles.small}><strong>Total:</strong> {formatCurrency(detailQuery.data.total)}</p>
              <p className={styles.small}><strong>Creado:</strong> {formatDate(detailQuery.data.createdAt)}</p>
            </>
          )}
        </Modal>
      )}
    </section>
  );
}
