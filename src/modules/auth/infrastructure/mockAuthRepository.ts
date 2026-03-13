import type { AuthRepository, LoginInput, RegisterInput } from '@/modules/auth/domain/auth.types';
import { authStorage } from '@/modules/auth/infrastructure/authStorage';
import { mockUsers } from '@/mocks/db';

export const mockAuthRepository: AuthRepository = {
  async login(input: LoginInput) {
    const user = mockUsers.find((u) => u.email === input.email && u.password === input.password);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    const session = { userId: user.id, email: user.email, role: user.role, token: `mock-jwt-${user.id}` };
    authStorage.save(session);
    return session;
  },
  async register(input: RegisterInput) {
    const exists = mockUsers.some((user) => user.email.toLowerCase() === input.email.toLowerCase());
    if (exists) {
      throw new Error('El email ya se encuentra registrado.');
    }

    return { message: 'Registro exitoso.' };
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
