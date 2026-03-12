import { Alert } from '@/shared/ui/Alert/Alert';
import { Button } from '@/shared/ui/Button/Button';
import styles from './ErrorState.module.scss';

type ErrorStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Ocurrió un error',
  message = 'No se pudo completar la acción. Intentá nuevamente.',
  actionLabel = 'Reintentar',
  onRetry
}: ErrorStateProps) {
  return (
    <div className={styles.errorState} role="alert">
      <Alert variant="danger" title={title}>
        {message}
      </Alert>
      {onRetry ? (
        <Button type="button" variant="secondary" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
