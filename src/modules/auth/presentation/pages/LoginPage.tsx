import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { useAuth } from '@/modules/auth/application/useAuth';
import type { HttpError } from '@/shared/api/httpErrors';
import { useToast } from '@/shared/ui/Toast/ToastProvider';
import styles from './LoginPage.module.scss';

const schema = z.object({
  email: z.string().email('Ingresá un email válido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.')
});
type FormData = z.infer<typeof schema>;

type LoginLocationState = {
  from?: string;
  registered?: boolean;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginMutation } = useAuth();
  const { notify } = useToast();
  const locationState = (location.state as LoginLocationState | null) ?? null;
  const redirectTo = locationState?.from ?? '/';
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!locationState?.registered) {
      return;
    }

    notify({
      variant: 'success',
      title: 'Registro exitoso',
      message: 'Tu cuenta fue creada. Ahora podés iniciar sesión.'
    });
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, locationState?.registered, navigate, notify]);

  const onSubmit = async (data: FormData) => {
    try {
      await loginMutation.mutateAsync(data);
      notify({ variant: 'success', title: 'Bienvenido de nuevo', message: 'Inicio de sesión exitoso.' });
      navigate(redirectTo, { replace: true });
    } catch {
      notify({ variant: 'error', title: 'No pudimos iniciar sesión', message: 'Revisá tus credenciales e intentá de nuevo.' });
    }
  };

  const loginErrorMessage = (loginMutation.error as HttpError | null)?.message ?? 'Credenciales inválidas';

  return (
    <section className={styles.login}>
      <h1>Ingresá a CocoAromas</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Contraseña" type="password" error={errors.password?.message} {...register('password')} />
        <Button loading={loginMutation.isPending} type="submit">Ingresar</Button>
      </form>
      {loginMutation.isError && <p className={styles.error}>{loginErrorMessage}</p>}
      <p className={styles.registerHint}>
        ¿No tenés cuenta todavía? <Link to="/register">Creá tu cuenta</Link>
      </p>
    </section>
  );
}
