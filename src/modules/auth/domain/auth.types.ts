import type { Role, UserSession } from '@/shared/types/common';

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthRepository {
  login(input: LoginInput): Promise<UserSession>;
  logout(): Promise<void>;
  getCurrentSession(): UserSession | null;
  hasRole(allowed: Role[]): boolean;
}
