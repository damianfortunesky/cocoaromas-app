import { Link, Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <main className="admin-layout">
      <aside>
        <h2>Administración</h2>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/productos/crear">Productos</Link>
          <Link to="/admin/stock">Stock</Link>
          <Link to="/admin/pedidos">Pedidos</Link>
          <Link to="/admin/promociones">Promociones</Link>
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </main>
  );
}
