import { useParams } from 'react-router-dom';
import { useProductDetail } from '@/modules/catalog/application/useCatalog';
import { Button } from '@/shared/ui/Button/Button';
import { useCart } from '@/modules/cart/application/useCart';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { data } = useProductDetail(id);
  const { addItem } = useCart();
  if (!data) return <p>Producto no encontrado.</p>;
  return <section><h1>{data.name}</h1><p>{data.description}</p><strong>${data.price}</strong><Button onClick={() => addItem(data)}>Agregar al carrito</Button></section>;
}
