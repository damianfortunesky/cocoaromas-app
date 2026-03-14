import styles from './Footer.module.scss';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brandBlock}>
          <p className={styles.brand}>CocoAromas</p>
          <p className={styles.description}>Café de especialidad y aromas que acompañan tus mejores momentos.</p>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <h2>Contacto</h2>
            <a href="tel:+5491122334455">+54 9 11 2233-4455</a>
            <a href="mailto:hola@cocoaromas.com">hola@cocoaromas.com</a>
          </div>

          <div className={styles.infoItem}>
            <h2>Dirección</h2>
            <p>Av. Aroma 1234, Palermo, Buenos Aires</p>
            <p>Lun a Sáb · 08:00 a 20:00</p>
          </div>
        </div>
      </div>

      <p className={styles.legal}>© {currentYear} CocoAromas. Todos los derechos reservados.</p>
    </footer>
  );
}
