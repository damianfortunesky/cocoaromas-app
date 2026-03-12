import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/modules/auth/application/loginUser';
import { authApiRepository } from '@/modules/auth/infrastructure/authApiRepository';
import { useAuthContext } from '@/modules/auth/presentation/context/AuthContext';
import type { LoginInput } from '@/modules/auth/domain/auth.types';

export function useAuth() {
  const auth = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: (input: LoginInput) => loginUser(input),
    onSuccess: (data) => auth.setSession(data)
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApiRepository.logout(),
    onSuccess: () => auth.logout()
  });

  return {
    session: auth.session,
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isSessionLoading: auth.isSessionLoading,
    logout: auth.logout,
    hasRole: auth.hasRole,
    loginMutation,
    logoutMutation
  };
}
