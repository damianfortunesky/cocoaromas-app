import { Loader } from '@/shared/ui/Loader/Loader';
import styles from './LoadingState.module.scss';

type LoadingStateProps = {
  message?: string;
  fullWidth?: boolean;
};

export function LoadingState({ message = 'Cargando información…', fullWidth = true }: LoadingStateProps) {
  return (
    <div className={`${styles.loadingState} ${fullWidth ? styles.fullWidth : ''}`.trim()} role="status" aria-live="polite">
      <Loader />
      <p>{message}</p>
    </div>
  );
}
