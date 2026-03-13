import type { RegisterInput } from '@/modules/auth/domain/auth.types';
import { authApiRepository } from '@/modules/auth/infrastructure/authApiRepository';

export const registerUser = (input: RegisterInput) => authApiRepository.register(input);
