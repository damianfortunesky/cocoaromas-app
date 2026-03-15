import { Link } from 'react-router-dom';
import { useAdminProducts } from '@/modules/products/application/useAdminProducts';
import { useStockList } from '@/modules/stock/application/useStockManagement';
import { useAdminOrders } from '@/modules/orders/application/useOrders';
import { usePromotions } from '@/modules/promotions/application/usePromotions';
import { useAdminCategories } from '@/modules/categories/application/useCategories';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Alert } from '@/shared/ui/Alert/Alert';
import styles from './AdminDashboardPage.module.scss';

const quickActions = [
  {
    title: 'Gestionar productos',
    description: 'Creá, editá y organizá el catálogo disponible para los clientes.',
    to: '/admin/productos',
    cta: 'Ir a productos'
  },
  {
    title: 'Gestionar stock',
    description: 'Actualizá disponibilidad de productos y variantes para evitar quiebres.',
    to: '/admin/stock',
    cta: 'Ir a stock'
  },
  {
    title: 'Gestionar pedidos',
    description: 'Revisá el flujo operativo y cambiá estados de pedidos en curso.',
    to: '/admin/pedidos',
    cta: 'Ir a pedidos'
  },
  {
    title: 'Gestionar promociones',
    description: 'Configurá campañas por producto, categoría o volumen de compra.',
    to: '/admin/promociones',
    cta: 'Ir a promociones'
  },
  {
    title: 'Gestionar categorías',
    description: 'Administrá categorías para clasificar productos y promociones.',
    to: '/admin/categorias',
    cta: 'Ir a categorías'
  }
];

export function AdminDashboardPage() {
  const productsQuery = useAdminProducts();
  const stockQuery = useStockList();
  const ordersQuery = useAdminOrders({});
  const promotionsQuery = usePromotions();
  const categoriesQuery = useAdminCategories();

  const hasError = productsQuery.isError || stockQuery.isError || ordersQuery.isError || promotionsQuery.isError || categoriesQuery.isError;
  const isLoading = productsQuery.isPending || stockQuery.isPending || ordersQuery.isPending || promotionsQuery.isPending || categoriesQuery.isPending;

  const totalProducts = productsQuery.data?.length ?? 0;
  const activeProducts = productsQuery.data?.filter((product) => product.active).length ?? 0;
  const lowStockItems = stockQuery.data?.filter((item) => item.alertLevel !== 'ok').length ?? 0;
  const totalOrders = ordersQuery.data?.length ?? 0;
  const activePromotions = promotionsQuery.data?.filter((promotion) => promotion.active).length ?? 0;
  const totalCategories = categoriesQuery.data?.length ?? 0;

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Panel administrativo</p>
        <h1>Dashboard de operaciones</h1>
        <p>
          Centralizá la operación comercial de CocoAromas desde una única vista con accesos directos a productos, stock,
          pedidos y promociones.
        </p>
      </header>

      {isLoading && (
        <div className={styles.loading}>
          <Loader />
          <span>Cargando resumen administrativo...</span>
        </div>
      )}

      {hasError && !isLoading && (
        <Alert variant="warning" title="Resumen parcialmente disponible">
          Algunos indicadores no pudieron cargarse en este momento. Podés continuar operando desde los módulos.
        </Alert>
      )}

      <section className={styles.metrics} aria-label="Indicadores del panel">
        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Productos activos</p>
          <strong>{activeProducts}</strong>
          <small>{totalProducts} productos en catálogo</small>
        </article>

        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Alertas de stock</p>
          <strong>{lowStockItems}</strong>
          <small>productos con stock bajo o agotado</small>
        </article>

        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Pedidos registrados</p>
          <strong>{totalOrders}</strong>
          <small>pedidos totales en el módulo administrativo</small>
        </article>

        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Promociones activas</p>
          <strong>{activePromotions}</strong>
          <small>campañas vigentes para venta</small>
        </article>

        <article className={styles.metricCard}>
          <p className={styles.metricLabel}>Categorías</p>
          <strong>{totalCategories}</strong>
          <small>categorías disponibles para catálogo</small>
        </article>
      </section>

      <section className={styles.quickAccess} aria-label="Accesos rápidos">
        {quickActions.map((action) => (
          <article className={styles.actionCard} key={action.to}>
            <h2>{action.title}</h2>
            <p>{action.description}</p>
            <Link to={action.to} className={styles.actionLink}>
              {action.cta}
            </Link>
          </article>
        ))}
      </section>
    </section>
  );
}
