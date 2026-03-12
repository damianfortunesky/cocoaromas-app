import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/ui/Navbar/Navbar';

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
