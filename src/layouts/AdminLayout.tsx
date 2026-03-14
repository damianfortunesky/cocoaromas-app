import { NavLink, Outlet } from 'react-router-dom';
import styles from './AdminLayout.module.scss';

const adminNavigation = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Productos', to: '/admin/productos' },
  { label: 'Stock', to: '/admin/stock' },
  { label: 'Pedidos', to: '/admin/pedidos' },
  { label: 'Promociones', to: '/admin/promociones' }
];

export function AdminLayout() {
  return (
    <main className={styles.layout}>
      <aside className={styles.sidebar}>
        <p className={styles.eyebrow}>Panel administrativo</p>
        <h2>CocoAromas</h2>
        <p className={styles.subtitle}>Operación comercial interna</p>

        <nav aria-label="Navegación administración" className={styles.nav}>
          {adminNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ''}`.trim()}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className={styles.content}>
        <Outlet />
      </section>
    </main>
  );
}
