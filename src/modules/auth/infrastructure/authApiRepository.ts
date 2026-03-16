import type {
  AuthRepository,
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse
} from '@/modules/auth/domain/auth.types';
import { authStorage } from '@/modules/auth/infrastructure/authStorage';
import { API_ENDPOINTS } from '@/shared/api/apiEndpoints';
import { httpClient } from '@/shared/api/httpClient';
import type { Role, UserSession } from '@/shared/types/common';

type LoginApiResponse = {
  accessToken?: string;
  token?: string;
  refreshToken?: string | null;
  user?: {
    id?: string;
    userId?: string;
    email?: string;
    role?: string;
    role_name?: string;
  };
  id?: string;
  userId?: string;
  email?: string;
  role?: string;
  role_name?: string;
};

const isRole = (value: string): value is Role => ['admin', 'owner', 'employee', 'client'].includes(value);

const normalizeRole = (value: unknown): Role | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  return isRole(normalized) ? normalized : null;
};

const normalizeLoginResponse = (response: LoginApiResponse): LoginResponse => {
  const accessToken = response.accessToken ?? response.token;
  const userId = response.user?.id ?? response.user?.userId ?? response.id ?? response.userId;
  const email = response.user?.email ?? response.email;
  const role = normalizeRole(response.user?.role ?? response.user?.role_name ?? response.role ?? response.role_name);

  if (!accessToken || !userId || !email || !role) {
    throw new Error('Respuesta de autenticación inválida.');
  }

  return {
    accessToken,
    refreshToken: response.refreshToken ?? null,
    user: {
      id: userId,
      email,
      role
    }
  };
};

const toSession = (response: LoginResponse): UserSession => ({
  userId: response.user.id,
  email: response.user.email,
  role: response.user.role,
  token: response.accessToken,
  refreshToken: response.refreshToken ?? null
});

export const authApiRepository: AuthRepository = {
  async login(input: LoginInput) {
    const { data } = await httpClient.post<LoginApiResponse>(API_ENDPOINTS.auth.login, input);
    const normalizedResponse = normalizeLoginResponse(data);
    const session = toSession(normalizedResponse);
    authStorage.save(session);
    return session;
  },
  async register(input: RegisterInput) {
    const { data } = await httpClient.post<RegisterResponse>(API_ENDPOINTS.auth.register, input);
    return data;
  },
  async logout() {
    authStorage.clear();
  },
  getCurrentSession() {
    return authStorage.get();
  },
  hasRole(allowed) {
    const role = authStorage.get()?.role;
    return !!role && allowed.includes(role);
  }
};
