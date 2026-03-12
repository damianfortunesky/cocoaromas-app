import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mockAuthRepository } from '@/modules/auth/infrastructure/mockAuthRepository';
import type { LoginInput } from '@/modules/auth/domain/auth.types';

export const SESSION_QUERY_KEY = ['session'];

export function useAuth() {
  const qc = useQueryClient();
  const session = useMemo(() => mockAuthRepository.getCurrentSession(), []);

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => mockAuthRepository.login(input),
    onSuccess: (data) => qc.setQueryData(SESSION_QUERY_KEY, data)
  });

  const logoutMutation = useMutation({
    mutationFn: () => mockAuthRepository.logout(),
    onSuccess: () => qc.setQueryData(SESSION_QUERY_KEY, null)
  });

  return { session, loginMutation, logoutMutation, hasRole: mockAuthRepository.hasRole };
}
