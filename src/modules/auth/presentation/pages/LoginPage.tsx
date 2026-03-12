import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { useAuth } from '@/modules/auth/application/useAuth';
import type { HttpError } from '@/shared/api/httpErrors';
import styles from './LoginPage.module.scss';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { loginMutation } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await loginMutation.mutateAsync(data);
    navigate('/');
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
    </section>
  );
}
