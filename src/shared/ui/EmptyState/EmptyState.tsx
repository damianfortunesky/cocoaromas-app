import { Button } from '@/shared/ui/Button/Button';
import styles from './EmptyState.module.scss';

type EmptyStateProps = {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title = 'Sin resultados', message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction ? (
        <Button type="button" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
