import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthGuard, RoleGuard } from '@/router/guards';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { LoginPage } from '@/modules/auth/presentation/pages/LoginPage';
import { CatalogPage } from '@/modules/catalog/presentation/pages/CatalogPage';
import { ProductDetailPage } from '@/modules/catalog/presentation/pages/ProductDetailPage';
import { CartPage } from '@/modules/cart/presentation/pages/CartPage';
import { CheckoutPage } from '@/modules/orders/presentation/pages/CheckoutPage';
import { MyOrdersPage } from '@/modules/orders/presentation/pages/MyOrdersPage';
import { AdminDashboardPage } from '@/modules/admin/presentation/pages/AdminDashboardPage';
import { CreateProductPage } from '@/modules/products/presentation/pages/CreateProductPage';
import { StockManagementPage } from '@/modules/stock/presentation/pages/StockManagementPage';
import { PromotionsManagementPage } from '@/modules/promotions/presentation/pages/PromotionsManagementPage';
import { AdminOrdersPage } from '@/modules/admin/presentation/pages/AdminOrdersPage';
import { AdminUsersPage } from '@/modules/admin/presentation/pages/AdminUsersPage';

export const router = createBrowserRouter([
  {
    path: '/', element: <PublicLayout />, children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogo', element: <CatalogPage /> },
      { path: 'catalogo/:id', element: <ProductDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'carrito', element: <CartPage /> },
      { path: 'checkout', element: <AuthGuard><CheckoutPage /></AuthGuard> },
      { path: 'mis-pedidos', element: <AuthGuard><MyOrdersPage /></AuthGuard> },
      { path: 'no-autorizado', element: <UnauthorizedPage /> }
    ]
  },
  {
    path: '/admin',
    element: <AuthGuard><RoleGuard allowed={['admin', 'owner', 'employee']}><AdminLayout /></RoleGuard></AuthGuard>,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'productos/crear', element: <RoleGuard allowed={['admin']}><CreateProductPage /></RoleGuard> },
      { path: 'stock', element: <RoleGuard allowed={['admin', 'owner', 'employee']}><StockManagementPage /></RoleGuard> },
      { path: 'pedidos', element: <RoleGuard allowed={['admin', 'employee']}><AdminOrdersPage /></RoleGuard> },
      { path: 'promociones', element: <RoleGuard allowed={['admin']}><PromotionsManagementPage /></RoleGuard> },
      { path: 'usuarios', element: <RoleGuard allowed={['admin']}><AdminUsersPage /></RoleGuard> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
