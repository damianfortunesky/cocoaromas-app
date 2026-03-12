import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '@/app/queryClient';
import { router } from '@/router';
import { setAuthTokenProvider } from '@/shared/api/httpClient';
import { authStorage } from '@/modules/auth/infrastructure/authStorage';
import { AuthProvider } from '@/modules/auth/presentation/context/AuthContext';
import { CartProvider } from '@/modules/cart/presentation/context/CartContext';
import { ToastProvider } from '@/shared/ui/Toast/ToastProvider';
import '@/shared/styles/globals.scss';

setAuthTokenProvider(() => authStorage.getToken());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
