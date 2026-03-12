import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import { ErrorState } from '@/shared/ui/ErrorState/ErrorState';

export function AppErrorPage() {
  const navigate = useNavigate();
  const routeError = useRouteError();

  const message = isRouteErrorResponse(routeError)
    ? routeError.statusText || routeError.data?.message || 'Error inesperado de navegación.'
    : routeError instanceof Error
      ? routeError.message
      : 'Algo salió mal al renderizar esta pantalla.';

  return (
    <section>
      <h1>Ups, hubo un problema</h1>
      <ErrorState
        title="No pudimos abrir esta pantalla"
        message={message}
        actionLabel="Volver al inicio"
        onRetry={() => navigate('/', { replace: true })}
      />
    </section>
  );
}
