import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '@/shared/types/common';
import { useAuth } from '@/modules/auth/application/useAuth';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, isSessionLoading } = useAuth();
  const location = useLocation();

  if (isSessionLoading) {
    return <p>Restaurando sesión...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function RoleGuard({ children, allowed }: PropsWithChildren<{ allowed: Role[] }>) {
  const { hasRole, isSessionLoading, isAuthenticated } = useAuth();

  if (isSessionLoading) {
    return <p>Restaurando sesión...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return hasRole(allowed) ? <>{children}</> : <Navigate to="/no-autorizado" replace />;
}
