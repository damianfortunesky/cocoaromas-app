import type { HTMLAttributes, PropsWithChildren } from 'react';
import styles from './Card.module.scss';

type CardProps = PropsWithChildren<HTMLAttributes<HTMLElement>>;

export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <article className={`${styles.card} ${className}`.trim()} {...rest}>
      {children}
    </article>
  );
}
