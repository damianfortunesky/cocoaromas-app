import type { PropsWithChildren } from 'react';
import styles from './Modal.module.scss';

type ModalProps = PropsWithChildren<{ onClose?: () => void }>;

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" className={styles.modal} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
