import type { ReactNode } from 'react';
import styles from './DataTable.module.scss';

type DataTableProps = {
  headers: string[];
  rows: ReactNode[][];
  caption?: string;
};

export function DataTable({ headers, rows, caption = 'Tabla de datos' }: DataTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
