import { Link } from 'react-router-dom';
import { useCart } from '@/modules/cart/application/useCart';
import { Button } from '@/shared/ui/Button/Button';

export function CartPage() {
  const { items, updateQuantity, removeItem, summary } = useCart();
  return <section><h1>Carrito</h1>{items.map((item)=> <div key={item.product.id}><p>{item.product.name}</p><input type="number" value={item.quantity} onChange={(e)=>updateQuantity(item.product.id, Number(e.target.value))}/><Button onClick={()=>removeItem(item.product.id)}>Quitar</Button></div>)}<hr/><p>Subtotal: ${summary.subtotal}</p><p>Descuento: ${summary.discount}</p><p>Total: ${summary.total}</p><Link to="/checkout">Ir al checkout</Link></section>;
}
