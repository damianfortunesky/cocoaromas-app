import styles from './Loader.module.scss';

export function Loader() {
  return <span className={styles.loader} aria-label="Cargando" role="status" />;
}
