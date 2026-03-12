import type { PropsWithChildren } from 'react';
import styles from './Card.module.scss';
export function Card({ children }: PropsWithChildren) { return <article className={styles.card}>{children}</article>; }
