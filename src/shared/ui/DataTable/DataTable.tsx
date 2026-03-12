import type { ReactNode } from 'react';
export function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return <table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>;
}
