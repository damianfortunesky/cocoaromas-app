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

const featuredProducts: Product[] = [
  {
    id: 'home-1',
    name: 'Sahumerio Lavanda',
    price: 6000,
    category: 'sahumerios',
    description: 'Relajación premium con notas florales suaves.',
    imageUrl: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae',
    active: true,
    stock: 12,
    attributes: { aroma: 'Lavanda' }
  },
  {
    id: 'home-2',
    name: 'Perfume Flor de Noche',
    price: 28500,
    category: 'perfumes',
    description: 'Fragancia femenina sofisticada para uso diario.',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f',
    active: true,
    stock: 7,
    attributes: { fragancia: 'Floral' }
  },
  {
    id: 'home-3',
    name: 'Remera Essential',
    price: 18900,
    category: 'remeras',
    description: 'Algodón premium y corte cómodo.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    active: true,
    stock: 9,
    attributes: { talle: 'M' }
  },
  {
    id: 'home-4',
    name: 'Jabón de Rosas',
    price: 4500,
    category: 'jabones',
    description: 'Espuma suave con aceites esenciales.',
    imageUrl: 'https://images.unsplash.com/photo-1607006344380-b6775a0824d2',
    active: true,
    stock: 15,
    attributes: { aroma: 'Rosas' }
  },
  {
    id: 'home-5',
    name: 'Adorno Aura Dorada',
    price: 9800,
    category: 'adornos',
    description: 'Pieza decorativa para armonizar ambientes.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
    active: true,
    stock: 4,
    attributes: { color: 'Dorado' }
  }
];

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
            <p>Una selección curada con favoritos de la comunidad CocoAromas.</p>
          </div>
        </header>
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
