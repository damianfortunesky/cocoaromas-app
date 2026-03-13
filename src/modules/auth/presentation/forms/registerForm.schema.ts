import { z } from 'zod';

export const registerFormSchema = z.object({
  firstName: z.string().trim().min(1, 'El nombre es obligatorio.'),
  lastName: z.string().trim().min(1, 'El apellido es obligatorio.'),
  email: z.string().trim().min(1, 'El email es obligatorio.').email('Ingresá un email válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  confirmPassword: z.string().min(1, 'Confirmá tu contraseña.')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword']
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
