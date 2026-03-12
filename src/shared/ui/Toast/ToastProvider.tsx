import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import styles from './ToastProvider.module.scss';

type ToastVariant = 'success' | 'error' | 'info';

type ToastInput = {
  title: string;
  message?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = ToastInput & { id: number; variant: ToastVariant; durationMs: number };

type ToastContextValue = {
  notify: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((toast: ToastInput) => {
    const id = Date.now() + Math.round(Math.random() * 1000);
    const nextToast: ToastItem = {
      id,
      title: toast.title,
      message: toast.message,
      variant: toast.variant ?? 'info',
      durationMs: toast.durationMs ?? 3500
    };
    setToasts((current) => [...current, nextToast]);
  }, []);

  useEffect(() => {
    const onAppToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastInput>).detail;
      if (!detail?.title) return;
      notify(detail);
    };

    window.addEventListener('app:toast', onAppToast);
    return () => window.removeEventListener('app:toast', onAppToast);
  }, [notify]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <aside className={styles.viewport} aria-live="polite" aria-label="Notificaciones">
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.variant]}`}>
            <strong>{toast.title}</strong>
            {toast.message ? <p>{toast.message}</p> : null}
            <button type="button" onClick={() => removeToast(toast.id)} aria-label="Cerrar notificación">
              ×
            </button>
          </div>
        ))}
      </aside>
      {toasts.map((toast) => (
        <AutoDismissToast key={`timer-${toast.id}`} id={toast.id} durationMs={toast.durationMs} onDismiss={removeToast} />
      ))}
    </ToastContext.Provider>
  );
}

function AutoDismissToast({ id, durationMs, onDismiss }: { id: number; durationMs: number; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), durationMs);
    return () => window.clearTimeout(timer);
  }, [id, durationMs, onDismiss]);

  return null;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }

  return context;
}

export function dispatchToast(toast: ToastInput) {
  window.dispatchEvent(new CustomEvent('app:toast', { detail: toast }));
}
