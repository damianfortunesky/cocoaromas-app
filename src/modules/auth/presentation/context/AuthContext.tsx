import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { authStorage } from '@/modules/auth/infrastructure/authStorage';
import { setUnauthorizedHandler } from '@/shared/api/httpClient';
import { dispatchToast } from '@/shared/ui/Toast/ToastProvider';
import type { Role, UserSession } from '@/shared/types/common';

type AuthContextValue = {
  session: UserSession | null;
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  isSessionLoading: boolean;
  setSession: (session: UserSession | null) => void;
  logout: () => void;
  hasRole: (allowed: Role[]) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    setSessionState(authStorage.get());
    setIsSessionLoading(false);
  }, []);

  const setSession = useCallback((nextSession: UserSession | null) => {
    if (nextSession) authStorage.save(nextSession);
    else authStorage.clear();
    setSessionState(nextSession);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, [setSession]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (!authStorage.get()) return;

      setSession(null);
      dispatchToast({
        variant: 'error',
        title: 'Sesión expirada',
        message: 'Por seguridad, iniciá sesión nuevamente para continuar.'
      });

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    });

    return () => setUnauthorizedHandler(null);
  }, [setSession]);

  const hasRole = useCallback((allowed: Role[]) => {
    if (!session) return false;
    return allowed.includes(session.role);
  }, [session]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session,
    token: session?.token ?? null,
    isAuthenticated: !!session,
    isSessionLoading,
    setSession,
    logout,
    hasRole
  }), [session, isSessionLoading, setSession, logout, hasRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }

  return context;
}
