import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';
import type { Product } from '@/modules/catalog/domain/catalog.types';
import styles from './HomePage.module.scss';

const categories = [
  { name: 'Sahumerios', icon: '🕯️', description: 'Aromas cálidos para cada ritual.' },
  { name: 'Perfumes', icon: '🌸', description: 'Fragancias elegantes y persistentes.' },
  { name: 'Remeras', icon: '👚', description: 'Moda cómoda con estilo femenino.' },
  { name: 'Jabones', icon: '🧼', description: 'Cuidado personal artesanal diario.' },
  { name: 'Adornos', icon: '✨', description: 'Detalles deco para tu espacio.' }
];

const featuredProducts: Product[] = [];

const benefits = [
  {
    title: 'Productos artesanales',
    text: 'Colecciones seleccionadas en pequeños lotes para conservar calidad y detalle.'
  },
  { title: 'Envíos a todo el país', text: 'Despachamos tu pedido con seguimiento para que llegue rápido y seguro.' },
  { title: 'Promociones semanales', text: 'Aprovechá combos especiales y descuentos exclusivos en productos destacados.' }
];

export function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.kicker}>Nuevo lanzamiento de temporada</span>
          <h1>CocoAromas</h1>
          <p>Tienda premium de aromas, moda y bienestar</p>
          <Link to="/catalogo">
            <Button>Explorar catálogo</Button>
          </Link>
        </div>
        <div className={styles.heroMedia}>
          <img
            src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6"
            alt="Selección de productos CocoAromas"
          />
        </div>
      </section>

      <section>
        <header className={styles.sectionHeader}>
          <div>
            <h2>Categorías destacadas</h2>
            <p>Encontrá líneas creadas para acompañar tu estilo y tu bienestar.</p>
          </div>
        </header>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <article key={category.name} className={styles.categoryCard}>
              <div className={styles.categoryIcon} aria-hidden>
                {category.icon}
              </div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <header className={styles.sectionHeader}>
          <div>
            <h2>Productos destacados</h2>
            <p>Este espacio se completa automáticamente cuando cargues destacados desde el panel.</p>
          </div>
        </header>
        {featuredProducts.length > 0 ? (
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <img src={product.imageUrl} alt={product.name} />
                <small>{product.category}</small>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>${product.price.toLocaleString('es-AR')}</strong>
              </article>
            ))}
          </div>
        ) : (
          <p>Aún no hay productos destacados cargados.</p>
        )}
      </section>

      <section>
        <header className={styles.sectionHeader}>
          <div>
            <h2>Beneficios</h2>
          </div>
        </header>
        <div className={styles.benefits}>
          {benefits.map((benefit) => (
            <article key={benefit.title} className={styles.benefitItem}>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <h3>CocoAromas</h3>
          <p>Diseñado para transformar tus espacios y tu estilo con experiencias sensoriales premium.</p>
        </div>
        <Link to="/catalogo">
          <Button variant="secondary">Ver colección completa</Button>
        </Link>
      </footer>
    </div>
  );
}
