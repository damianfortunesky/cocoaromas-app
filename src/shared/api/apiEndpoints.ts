export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh'
  },
  orders: {
    create: '/orders',
    myOrders: '/orders/me',
    adminList: '/admin/orders',
    adminById: (id: string) => `/admin/orders/${id}`,
    adminUpdateStatus: (id: string) => `/admin/orders/${id}/status`
  },
  products: '/admin/products',
  productById: (id: string) => `/admin/products/${id}`,
  stock: {
    list: '/admin/products/stock',
    byProductId: (id: string) => `/admin/products/${id}/stock`
  },
  promotions: '/admin/promotions',
  promotionById: (id: string) => `/admin/promotions/${id}`,
  promotionToggle: (id: string) => `/admin/promotions/${id}/active`,
  catalog: {
    products: '/catalog/products',
    productById: (id: string) => `/catalog/products/${id}`,
    productBySlug: (slug: string) => `/catalog/products/slug/${slug}`,
    productByIdentifier: (identifier: string) => `/catalog/products/${identifier}`,
    relatedProducts: (identifier: string) => `/catalog/products/${identifier}/related`
  }
} as const;
