import type { LoginInput } from '@/modules/auth/domain/auth.types';
import { authApiRepository } from '@/modules/auth/infrastructure/authApiRepository';

export const loginUser = (credentials: LoginInput) => authApiRepository.login(credentials);
