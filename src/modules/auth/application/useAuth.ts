import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '@/modules/auth/application/loginUser';
import { authApiRepository } from '@/modules/auth/infrastructure/authApiRepository';
import type { LoginInput } from '@/modules/auth/domain/auth.types';

export const SESSION_QUERY_KEY = ['session'];

export function useAuth() {
  const qc = useQueryClient();
  const { data: session } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: () => authApiRepository.getCurrentSession(),
    initialData: authApiRepository.getCurrentSession()
  });

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => loginUser(input),
    onSuccess: (data) => qc.setQueryData(SESSION_QUERY_KEY, data)
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApiRepository.logout(),
    onSuccess: () => qc.setQueryData(SESSION_QUERY_KEY, null)
  });

  return { session: session ?? null, loginMutation, logoutMutation, hasRole: authApiRepository.hasRole };
}
