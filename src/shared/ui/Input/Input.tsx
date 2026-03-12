import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Input.module.scss';

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, ...rest }, ref) => (
  <label className={styles.field}>
    <span>{label}</span>
    <input ref={ref} {...rest} />
    {error && <small>{error}</small>}
  </label>
));
Input.displayName = 'Input';
