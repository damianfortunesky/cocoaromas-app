import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: 'primary' | 'secondary' };

export function Button({ loading, variant = 'primary', children, ...rest }: Props) {
  return <button className={`${styles.btn} ${styles[variant]}`} {...rest}>{loading ? 'Cargando...' : children}</button>;
}
