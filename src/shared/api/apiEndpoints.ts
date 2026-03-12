export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh'
  },
  products: '/admin/products',
  catalog: {
    products: '/catalog/products',
    productById: (id: string) => `/catalog/products/${id}`
  }
} as const;
