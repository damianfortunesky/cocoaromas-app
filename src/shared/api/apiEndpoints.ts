export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
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
  productStatusById: (id: string) => `/admin/products/${id}/status`,
  stock: {
    list: '/admin/stocks',
    byProductId: (id: string) => `/admin/stocks/${id}`
  },
  promotions: '/admin/promotions',
  promotionById: (id: string) => `/admin/promotions/${id}`,
  promotionStatusById: (id: string) => `/admin/promotions/${id}/status`,
  categories: '/categories',
  adminCategories: '/admin/categories',
  adminCategoryById: (id: string) => `/admin/categories/${id}`,
  me: {
    profile: '/me/profile',
    addresses: '/me/addresses',
    addressById: (id: string) => `/me/addresses/${id}`
  },
  catalog: {
    products: '/products',
    productById: (id: string) => `/products/${id}`,
    productBySlug: (slug: string) => `/products/slug/${slug}`,
    productByIdentifier: (identifier: string) => `/products/${identifier}`,
    relatedProducts: (identifier: string) => `/products/${identifier}/related`
  }
} as const;
