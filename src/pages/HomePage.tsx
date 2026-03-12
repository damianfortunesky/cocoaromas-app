import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';

export function HomePage() {
  return (
    <section>
      <h1>CocoAromas</h1>
      <p>Tienda premium de aromas, moda y bienestar con una curaduría delicada para tu día a día.</p>
      <Link to="/catalogo">
        <Button>Explorar catálogo</Button>
      </Link>
    </section>
  );
}
