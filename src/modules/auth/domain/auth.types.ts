import type { Role, UserSession } from '@/shared/types/common';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
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

export interface RegisterResponse {
  message?: string;
}

export interface AuthRepository {
  login(input: LoginInput): Promise<UserSession>;
  register(input: RegisterInput): Promise<RegisterResponse>;
  logout(): Promise<void>;
  getCurrentSession(): UserSession | null;
  hasRole(allowed: Role[]): boolean;
}
