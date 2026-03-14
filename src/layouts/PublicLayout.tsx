import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/ui/Navbar/Navbar';
import { Footer } from '@/shared/ui/Footer/Footer';
import styles from './PublicLayout.module.scss';

export function PublicLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
