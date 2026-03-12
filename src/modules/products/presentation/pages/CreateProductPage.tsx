import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProduct } from '@/modules/products/application/useAdminProducts';
import { Input } from '@/shared/ui/Input/Input';
import { Button } from '@/shared/ui/Button/Button';

const schema = z.object({ name: z.string().min(3), category: z.string().min(2), description: z.string().min(3), imageUrl: z.string().url(), price: z.coerce.number().positive(), stock: z.coerce.number().min(0) });
type Form = z.infer<typeof schema>;

export function CreateProductPage() {
  const createProduct = useCreateProduct();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });
  return <section><h1>Crear producto</h1><form onSubmit={handleSubmit((v)=>createProduct.mutate({ ...v, active: true, attributes: {} }))}><Input label="Nombre" error={errors.name?.message} {...register('name')} /><Input label="Categoría" error={errors.category?.message} {...register('category')} /><Input label="Descripción" error={errors.description?.message} {...register('description')} /><Input label="Imagen URL" error={errors.imageUrl?.message} {...register('imageUrl')} /><Input label="Precio" type="number" error={errors.price?.message} {...register('price')} /><Input label="Stock" type="number" error={errors.stock?.message} {...register('stock')} /><Button type="submit">Guardar</Button></form></section>;
}
