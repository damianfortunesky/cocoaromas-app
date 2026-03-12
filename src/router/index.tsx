import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute, RoleGuard } from '@/router/guards';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { UIShowcasePage } from '@/pages/UIShowcasePage';
import { AppErrorPage } from '@/pages/AppErrorPage';
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
    path: '/', element: <PublicLayout />, errorElement: <AppErrorPage />, children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogo', element: <CatalogPage /> },
      { path: 'catalogo/:id', element: <ProductDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'carrito', element: <CartPage /> },
      { path: 'checkout', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
      { path: 'mis-pedidos', element: <ProtectedRoute><MyOrdersPage /></ProtectedRoute> },
      { path: 'no-autorizado', element: <UnauthorizedPage /> },
      { path: 'ui-showcase', element: <UIShowcasePage /> }
    ]
  },
  {
    path: '/admin',
    element: <ProtectedRoute><RoleGuard allowed={['admin', 'owner', 'employee']}><AdminLayout /></RoleGuard></ProtectedRoute>,
    errorElement: <AppErrorPage />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'productos', element: <RoleGuard allowed={['admin']}><CreateProductPage /></RoleGuard> },
      { path: 'stock', element: <RoleGuard allowed={['admin', 'owner', 'employee']}><StockManagementPage /></RoleGuard> },
      { path: 'pedidos', element: <RoleGuard allowed={['admin', 'employee']}><AdminOrdersPage /></RoleGuard> },
      { path: 'promociones', element: <RoleGuard allowed={['admin']}><PromotionsManagementPage /></RoleGuard> },
      { path: 'usuarios', element: <RoleGuard allowed={['admin']}><AdminUsersPage /></RoleGuard> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
