import type { PropsWithChildren } from 'react';
import styles from './Alert.module.scss';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

type AlertProps = PropsWithChildren<{
  variant?: AlertVariant;
  title?: string;
}>;

export function Alert({ variant = 'info', title, children }: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[variant]}`} role="status" aria-live="polite">
      {title && <strong>{title}</strong>}
      <p>{children}</p>
    </div>
  );
}
