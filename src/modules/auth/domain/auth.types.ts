import type { Role, UserSession } from '@/shared/types/common';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string | null;
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface AuthRepository {
  login(input: LoginInput): Promise<UserSession>;
  logout(): Promise<void>;
  getCurrentSession(): UserSession | null;
  hasRole(allowed: Role[]): boolean;
}
