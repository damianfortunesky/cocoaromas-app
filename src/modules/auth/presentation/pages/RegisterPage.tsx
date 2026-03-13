import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/application/useAuth';
import { registerFormSchema, type RegisterFormData } from '@/modules/auth/presentation/forms/registerForm.schema';
import { Button } from '@/shared/ui/Button/Button';
import type { HttpError } from '@/shared/api/httpErrors';
import { Input } from '@/shared/ui/Input/Input';
import { useToast } from '@/shared/ui/Toast/ToastProvider';
import styles from './RegisterPage.module.scss';

export function RegisterPage() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const { registerMutation } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password
    };

    try {
      await registerMutation.mutateAsync(payload);
      notify({
        variant: 'success',
        title: 'Cuenta creada con éxito',
        message: 'Ya podés iniciar sesión con tu email y contraseña.'
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch {
      notify({
        variant: 'error',
        title: 'No pudimos crear la cuenta',
        message: 'Revisá los datos e intentá nuevamente.'
      });
    }
  };

  const registerError = registerMutation.error as HttpError | null;

  return (
    <section className={styles.register}>
      <h1>Crear cuenta en CocoAromas</h1>
      <p className={styles.subtitle}>Completá tus datos para registrarte como cliente y empezar a comprar.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Nombre" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Apellido" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Contraseña" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <Input
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" loading={registerMutation.isPending || isSubmitting} disabled={registerMutation.isPending || isSubmitting}>
          Registrarme
        </Button>
      </form>

      {registerMutation.isError && (
        <p className={styles.error}>{registerError?.status === 409 ? 'Ese email ya está registrado.' : registerError?.message}</p>
      )}

      <p className={styles.loginHint}>
        ¿Ya tenés cuenta? <Link to="/login">Ingresá acá</Link>
      </p>
    </section>
  );
}
