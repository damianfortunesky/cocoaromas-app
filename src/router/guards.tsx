import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { mockAuthRepository } from '@/modules/auth/infrastructure/mockAuthRepository';
import type { Role } from '@/shared/types/common';

export function AuthGuard({ children }: PropsWithChildren) {
  return mockAuthRepository.getCurrentSession() ? <>{children}</> : <Navigate to="/login" replace />;
}

export function RoleGuard({ children, allowed }: PropsWithChildren<{ allowed: Role[] }>) {
  return mockAuthRepository.hasRole(allowed) ? <>{children}</> : <Navigate to="/no-autorizado" replace />;
}
