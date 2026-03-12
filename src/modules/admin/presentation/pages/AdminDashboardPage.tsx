import { Link } from 'react-router-dom';
export function AdminDashboardPage() {
  return <section><h1>Panel admin</h1><nav><Link to="/admin/productos/crear">Crear producto</Link> | <Link to="/admin/stock">Stock</Link> | <Link to="/admin/pedidos">Pedidos</Link> | <Link to="/admin/promociones">Promociones</Link></nav></section>;
}
