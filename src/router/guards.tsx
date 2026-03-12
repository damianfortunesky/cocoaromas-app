import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Role } from '@/shared/types/common';
import { useAuth } from '@/modules/auth/application/useAuth';
import { LoadingState } from '@/shared/ui/LoadingState/LoadingState';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, isSessionLoading } = useAuth();
  const location = useLocation();

  if (isSessionLoading) {
    return <LoadingState message="Restaurando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function RoleGuard({ children, allowed }: PropsWithChildren<{ allowed: Role[] }>) {
  const { hasRole, isSessionLoading, isAuthenticated } = useAuth();

  if (isSessionLoading) {
    return <LoadingState message="Restaurando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return hasRole(allowed) ? <>{children}</> : <Navigate to="/no-autorizado" replace />;
}
