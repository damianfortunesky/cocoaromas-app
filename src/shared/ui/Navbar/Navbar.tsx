import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/modules/auth/application/useAuth';
import { useCart } from '@/modules/cart/application/useCart';
import styles from './Navbar.module.scss';

type NavbarProps = {
  onLogout?: () => void;
};

export function Navbar({ onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, logoutMutation } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const accountLabel = session ? 'Cuenta' : 'Login';

  const handleLogout = () => {
    if (onLogout) onLogout();
    else logoutMutation.mutate();
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Navegación principal">
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          CocoAromas
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        <ul id="main-navigation" className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
          <li><NavLink to="/" onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/catalogo" onClick={closeMenu}>Catálogo</NavLink></li>
          <li><NavLink to="/carrito" onClick={closeMenu}>Carrito</NavLink></li>
          <li><NavLink to={session ? '/mis-pedidos' : '/login'} onClick={closeMenu}>{accountLabel}</NavLink></li>
        </ul>

        <div className={styles.actions}>
          <Link to="/carrito" className={styles.iconButton} aria-label="Ir al carrito" onClick={closeMenu}>
            <span className={styles.icon} aria-hidden="true">🛒</span>
            <span className={styles.badge} aria-label={`${cartCount} productos en carrito`}>{cartCount}</span>
          </Link>

          {session ? (
            <>
              <Link to="/mis-pedidos" className={styles.accountButton} onClick={closeMenu}>
                👤 Cuenta
              </Link>
              <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className={styles.accountButton} onClick={closeMenu}>
              👤 Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
