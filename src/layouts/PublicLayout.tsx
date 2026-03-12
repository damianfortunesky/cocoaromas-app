import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '@/modules/auth/application/useAuth';
import { Button } from '@/shared/ui/Button/Button';

export function PublicLayout() {
  const { session, logoutMutation } = useAuth();

  return (
    <>
      <header>
        <nav className="top-nav">
          <Link to="/" className="brand">CocoAromas</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/carrito">Carrito</Link>
          {session ? <Link to="/mis-pedidos">Mis pedidos</Link> : <Link to="/login">Login</Link>}
          {session?.role !== 'client' && <Link to="/admin">Admin</Link>}
          {session && (
            <Button variant="secondary" onClick={() => logoutMutation.mutate()}>
              Salir
            </Button>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
