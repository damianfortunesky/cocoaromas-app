import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { authApiRepository } from '@/modules/auth/infrastructure/authApiRepository';
import type { Role } from '@/shared/types/common';

export function AuthGuard({ children }: PropsWithChildren) {
  return authApiRepository.getCurrentSession() ? <>{children}</> : <Navigate to="/login" replace />;
}

export function RoleGuard({ children, allowed }: PropsWithChildren<{ allowed: Role[] }>) {
  return authApiRepository.hasRole(allowed) ? <>{children}</> : <Navigate to="/no-autorizado" replace />;
}
